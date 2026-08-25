import { useRef, useState, type FormEvent } from "react";
import { supabaseConfigured, supabaseInsert } from "../lib/supabase";
import { isValidEmail, looksLikeSpam, type SubmitState } from "../lib/forms";
import { captureAttribution } from "../lib/attribution";
import { CONTACT_INTERESTS } from "../config";

const SUCCESS_MESSAGE =
  "Thank you — we'll be in touch about Miss Ann's restoration.";

const inputClasses =
  "w-full border border-grayblue bg-white px-4 py-3 placeholder:text-grayblue";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const mountedAt = useRef(Date.now());

  function toggleInterest(value: string) {
    setInterests((current) =>
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setState({ status: "error", message: "Please tell us your name." });
      return;
    }
    if (!isValidEmail(email)) {
      setState({
        status: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }
    if (interests.length === 0 && !message.trim()) {
      setState({
        status: "error",
        message:
          "Please choose how you'd like to help, or leave us a message.",
      });
      return;
    }
    if (looksLikeSpam(honeypot, mountedAt.current)) {
      setState({ status: "success" });
      return;
    }
    if (!supabaseConfigured) {
      setState({
        status: "error",
        message:
          "The contact form isn't quite ready yet — please check back soon.",
      });
      return;
    }
    setState({ status: "submitting" });
    const { error } = await supabaseInsert("form_submissions", {
      name: name.trim(),
      email: email.trim(),
      message: message.trim() || null,
      interests,
      email_consent: consent,
      ...captureAttribution("contact"),
    });
    if (error) {
      setState({
        status: "error",
        message: "Something went wrong — please try again.",
      });
      return;
    }
    setState({ status: "success" });
  }

  if (state.status === "success") {
    return (
      <p role="status" className="border-l-2 border-brass py-2 pl-4 text-lg">
        {SUCCESS_MESSAGE}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="contact-name" className="mb-1 block font-semibold">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClasses}
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-1 block font-semibold">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClasses}
        />
      </div>

      <fieldset>
        <legend className="mb-2 font-semibold">
          How would you like to take part?
        </legend>
        <p className="mb-3 text-sm text-grayblue">
          Choose as many as you like — it helps us know how best to reply.
        </p>
        <div className="space-y-2">
          {CONTACT_INTERESTS.map(({ value, label }) => (
            <label
              key={value}
              className="flex cursor-pointer items-start gap-3 text-base"
            >
              <input
                type="checkbox"
                checked={interests.includes(value)}
                onChange={() => toggleInterest(value)}
                className="mt-1 h-4 w-4 shrink-0 accent-[#B08D42]"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="contact-message" className="mb-1 block font-semibold">
          Message{" "}
          <span className="font-normal text-grayblue">(optional)</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="If she's part of your story, we'd love to hear about it."
          className={inputClasses}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-base">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-[#B08D42]"
        />
        <span>
          Send me occasional news about Miss&nbsp;Ann&rsquo;s restoration. We
          will never share your address, and you may unsubscribe at any time.
        </span>
      </label>

      <div aria-hidden="true" className="visually-hidden">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-red-800">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={state.status === "submitting"}
        className="bg-navy px-8 py-3 text-sm font-semibold tracking-widest text-cream uppercase hover:bg-brass hover:text-navy-deep disabled:opacity-60"
      >
        {state.status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
