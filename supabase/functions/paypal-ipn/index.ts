// PayPal IPN (Instant Payment Notification) receiver — logs completed
// donations into the CRM.
//
// Setup (needs a PayPal Business account — Personal accounts can't generate
// a Donate button or configure IPN):
//   1. Deploy: supabase functions deploy paypal-ipn --no-verify-jwt
//      (PayPal can't send our Supabase auth header, so JWT verification
//      must be off for this one function).
//   2. PayPal > Account Settings > Notifications > Instant Payment
//      Notifications > enable, and set the URL to this function's URL.
//   3. Create the Donate button: PayPal > Pay & Get Paid > "PayPal Buttons"
//      (or the legacy Donate button generator) — copy the resulting
//      donate link (https://www.paypal.com/donate/?hosted_button_id=...)
//      into DONATE_URL in src/config.ts.
//
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically in
// the Edge Function environment — no need to set them.
//
// PayPal has no signing secret for IPN. Authenticity is instead verified by
// posting the exact received body back to PayPal, which replies VERIFIED or
// INVALID — see verifyWithPaypal below.

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// https://ipnpb.paypal.com is production; use
// https://ipnpb.sandbox.paypal.com for testing against a sandbox button.
const PAYPAL_IPN_VERIFY_URL = "https://ipnpb.paypal.com/cgi-bin/webscr";

async function verifyWithPaypal(rawBody: string): Promise<boolean> {
  const verifyBody = `cmd=_notify-validate&${rawBody}`;
  const res = await fetch(PAYPAL_IPN_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: verifyBody,
  });
  const text = await res.text();
  return text.trim() === "VERIFIED";
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const rawBody = await req.text();

  if (!(await verifyWithPaypal(rawBody))) {
    return new Response("Invalid IPN", { status: 400 });
  }

  const params = new URLSearchParams(rawBody);
  const paymentStatus = params.get("payment_status");
  const email = params.get("payer_email");
  const txnId = params.get("txn_id");
  const grossStr = params.get("mc_gross");

  // Only a completed donation payment counts; ignore refunds, pending,
  // denied, and other IPN event types PayPal may also send here.
  if (paymentStatus !== "Completed" || !email || !txnId || !grossStr) {
    return new Response("ignored", { status: 200 });
  }

  const amountCents = Math.round(parseFloat(grossStr) * 100);
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    return new Response("ignored", { status: 200 });
  }

  const firstName = params.get("first_name") ?? "";
  const lastName = params.get("last_name") ?? "";
  const name = `${firstName} ${lastName}`.trim() || null;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/form_submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      name,
      email,
      form: "donation",
      amount_cents: amountCents,
      payment_event_id: `paypal:${txnId}`,
      interests: ["donate"],
      email_consent: false,
    }),
  });

  // A 409 here means this txn_id was already processed (PayPal can send
  // duplicate IPNs) — the unique index on payment_event_id caught it.
  // That's success, not an error.
  if (!res.ok && res.status !== 409) {
    const body = await res.text();
    console.error("failed to record donation", res.status, body);
    return new Response("failed to record donation", { status: 500 });
  }

  return new Response("ok", { status: 200 });
});
