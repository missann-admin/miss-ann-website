import { useRef, useState, type FormEvent } from "react";
import { supabaseConfigured, supabaseInsert } from "../lib/supabase";
import { isValidEmail, looksLikeSpam, type SubmitState } from "../lib/forms";
import { captureAttribution } from "../lib/attribution";
import { FILEDROP_MATERIALS } from "../config";

// Unlike the other two forms, nothing further happens automatically here —
// someone reads the request and sends back an upload link — so the message
// has to set that expectation rather than end the conversation.
const SUCCESS_MESSAGE =
  "Thank you — we'll email you a private upload link shortly.";

const inputClasses =
  "w-full border border-grayblue bg-white px-4 py-3 placeholder:text-grayblue";

/**
 * Intake form for material people want to contribute. Deliberately takes no
 * files: a description comes in, a person reads it, and a private upload link
 * goes back out. That keeps uploads off our infrastructure entirely and puts
 * a human between a stranger and any storage.
 */
export default function FileDropForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [materials, setMaterials] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const mountedAt = useRef(Date.now());

  function toggleMaterial(value: string) {
    setMaterials((current) =>
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
    if (materials.length === 0 && !message.trim()) {
      setState({
        status: "error",
        message:
          "Please tell us what kind of material you have, or describe it below.",
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
        message: "This form isn't quite ready yet — please check back soon.",
      });
      return;
    }
    setState({ status: "submitting" });
    const { error } = await supabaseInsert("form_submissions", {
      name: name.trim(),
      email: email.trim(),
      message: message.trim() || null,
      materials,
      // 'memories' already exists as a contact interest, so contributors land
      // in the segment they belong to without inventing a new one.
      interests: ["memories"],
      email_consent: consent,
      ...captureAttribution("filedrop"),
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
        <label htmlFor="filedrop-name" className="mb-1 block font-semibold">
          Name
        </label>
        <input
          id="filedrop-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClasses}
        />
      </div>
      <div>
        <label htmlFor="filedrop-email" className="mb-1 block font-semibold">
          Email
        </label>
        <input
          id="filedrop-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClasses}
        />
      </div>

      <fieldset>
        <legend className="mb-2 font-semibold">What do you have?</legend>
        <p className="mb-3 text-sm text-grayblue">
          Choose as many as apply — nothing needs to be sorted or scanned
          first.
        </p>
        <div className="space-y-2">
          {FILEDROP_MATERIALS.map(({ value, label }) => (
            <label
              key={value}
              className="flex cursor-pointer items-start gap-3 text-base"
            >
              <input
                type="checkbox"
                checked={materials.includes(value)}
                onChange={() => toggleMaterial(value)}
                className="mt-1 h-4 w-4 shrink-0 accent-[#B08D42]"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="filedrop-message" className="mb-1 block font-semibold">
          Tell us about it{" "}
          <span className="font-normal text-grayblue">(optional)</span>
        </label>
        <textarea
          id="filedrop-message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Roughly how much there is, what years it covers, and how it came to you — whatever you know."
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
        <label htmlFor="filedrop-website">Leave this field empty</label>
        <input
          id="filedrop-website"
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
        {state.status === "submitting" ? "Sending…" : "Request Upload Link"}
      </button>
    </form>
  );
}
