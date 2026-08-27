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
// the Edge Function environment — no need to set them. PAYPAL_RECEIVER_EMAIL
// must be set by hand to the Business account's email:
//   supabase secrets set PAYPAL_RECEIVER_EMAIL=frank@example.com
//
// PayPal has no signing secret for IPN. Authenticity is instead verified by
// posting the exact received body back to PayPal, which replies VERIFIED or
// INVALID — see verifyWithPaypal below.

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// VERIFIED only proves the transaction is real — not that it was paid to us.
// Without this check, anyone could point their own PayPal account's IPN URL
// at this function and inject donations with an email and amount of their
// choosing. Checking the receiver is PayPal's own documented requirement.
const RECEIVER_EMAIL = Deno.env.get("PAYPAL_RECEIVER_EMAIL")!;

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

  // Reject anything paid to a different PayPal account (see RECEIVER_EMAIL).
  const receiver = params.get("receiver_email") ?? params.get("business");
  if (!receiver || receiver.toLowerCase() !== RECEIVER_EMAIL.toLowerCase()) {
    console.error("IPN for unexpected receiver", receiver);
    return new Response("wrong receiver", { status: 400 });
  }

  const paymentStatus = params.get("payment_status");
  const email = params.get("payer_email");
  const txnId = params.get("txn_id");
  const grossStr = params.get("mc_gross");
  const currency = params.get("mc_currency");

  // Only a completed donation payment counts; ignore refunds, pending,
  // denied, and other IPN event types PayPal may also send here. mc_gross is
  // denominated in mc_currency, so anything but USD would be summed into
  // total_donated_cents at the wrong scale — ignore it rather than corrupt
  // the running total.
  if (
    paymentStatus !== "Completed" ||
    currency !== "USD" ||
    !email ||
    !txnId ||
    !grossStr
  ) {
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
