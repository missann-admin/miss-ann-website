// Emails a notification whenever someone submits a form.
//
// Without this, a submission is only discoverable by querying the database by
// hand. That is how three weeks of outage went unnoticed in September 2026,
// and it matters more now that /filedrop tells people "we'll email you a
// private upload link" — a promise nobody can keep if nobody knows a request
// arrived.
//
// Triggered by a Supabase Database Webhook on INSERT into form_submissions.
// The webhook sends the service role key as the Authorization header, so this
// function is deployed WITH the default JWT verification (unlike paypal-ipn,
// which must accept unauthenticated calls from PayPal):
//
//   supabase functions deploy submission-notify
//
// Secrets:
//   supabase secrets set RESEND_API_KEY=re_...
//   supabase secrets set NOTIFY_TO=missannadmin@gmail.com
//   supabase secrets set NOTIFY_FROM="Miss Ann <notifications@missann.us>"
//
// NOTIFY_FROM must be on a domain verified in Resend. Until missann.us is
// verified there, leave it unset — it falls back to Resend's shared
// onboarding sender, which can only deliver to the Resend account's own
// address. That is why NOTIFY_TO should start as missannadmin@gmail.com and
// only become admin@missann.us once the domain is verified.

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const NOTIFY_TO = Deno.env.get("NOTIFY_TO") ?? "missannadmin@gmail.com";
const NOTIFY_FROM = Deno.env.get("NOTIFY_FROM") ?? "onboarding@resend.dev";

/** Shape Supabase sends for a Database Webhook. */
type WebhookPayload = {
  type: string;
  table: string;
  record: Record<string, unknown> | null;
};

function str(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function list(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v) => typeof v === "string") : [];
}

/**
 * Headline for the inbox. The form is named first so a full inbox can be
 * triaged without opening anything — a file drop needs a reply, a signup
 * does not.
 */
function subjectFor(form: string, name: string | null): string {
  const who = name ? ` from ${name}` : "";
  switch (form) {
    case "filedrop":
      return `Miss Ann — material offered${who} (needs an upload link)`;
    case "contact":
      return `Miss Ann — new message${who}`;
    case "email-signup":
      return `Miss Ann — new email signup${who}`;
    case "donation":
      return `Miss Ann — donation received${who}`;
    default:
      return `Miss Ann — new ${form} submission${who}`;
  }
}

function bodyFor(record: Record<string, unknown>): string {
  const form = str(record.form) ?? "unknown";
  const name = str(record.name);
  const email = str(record.email);
  const message = str(record.message);
  const materials = list(record.materials);
  const interests = list(record.interests);
  const amountCents = typeof record.amount_cents === "number"
    ? record.amount_cents
    : null;

  const lines: string[] = [];
  lines.push(`Form:     ${form}`);
  if (name) lines.push(`Name:     ${name}`);
  if (email) lines.push(`Email:    ${email}`);
  if (materials.length) lines.push(`Material: ${materials.join(", ")}`);
  if (interests.length) lines.push(`Interest: ${interests.join(", ")}`);
  if (amountCents !== null) {
    lines.push(`Amount:   $${(amountCents / 100).toFixed(2)}`);
  }
  lines.push(`Consent:  ${record.email_consent ? "yes" : "no"}`);
  if (str(record.page_path)) lines.push(`Page:     ${record.page_path}`);
  if (str(record.referrer)) lines.push(`Referrer: ${record.referrer}`);
  if (message) lines.push("", "Message:", message);

  if (form === "filedrop") {
    lines.push(
      "",
      "— This person is waiting on a private upload link. Nothing is sent",
      "  automatically; reply to them directly.",
    );
  }

  return lines.join("\n");
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let payload: WebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const record = payload.record;
  if (!record) {
    return new Response("no record", { status: 200 });
  }

  const form = str(record.form) ?? "unknown";
  const name = str(record.name);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: [NOTIFY_TO],
      // So a reply goes straight back to the person who wrote in, rather
      // than to the notification sender.
      reply_to: str(record.email) ?? undefined,
      subject: subjectFor(form, name),
      text: bodyFor(record),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("failed to send notification", res.status, body);
    // A 500 tells Supabase the webhook failed, which surfaces it in the
    // webhook logs. The submission itself is already safely stored — this
    // only ever affects the notification.
    return new Response("failed to send notification", { status: 500 });
  }

  return new Response("ok", { status: 200 });
});
