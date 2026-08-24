import { useRef, useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";
import { isValidEmail, looksLikeSpam, type SubmitState } from "../lib/forms";

const SUCCESS_MESSAGE =
  "Thank you — we'll be in touch about Miss Ann's restoration.";

export default function EmailSignupForm() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const mountedAt = useRef(Date.now());

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setState({
        status: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }
    if (looksLikeSpam(honeypot, mountedAt.current)) {
      setState({ status: "success" });
      return;
    }
    if (!supabase) {
      setState({
        status: "error",
        message:
          "The email list isn't quite ready yet — please check back soon.",
      });
      return;
    }
    setState({ status: "submitting" });
    const { error } = await supabase
      .from("email_signups")
      .insert({ email: email.trim().toLowerCase() });
    // 23505 = unique violation: already signed up, which is a success for them.
    if (error && error.code !== "23505") {
      setState({
        status: "error",
        message: "Something went wrong — please try again.",
      });
      return;
    }
    setState({ status: "success" });
    setEmail("");
  }

  if (state.status === "success") {
    return (
      <p role="status" className="border-l-2 border-brass py-2 pl-4 text-lg">
        {SUCCESS_MESSAGE}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="signup-email" className="visually-hidden">
          Email address
        </label>
        <input
          id="signup-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          aria-describedby={
            state.status === "error" ? "signup-error" : undefined
          }
          className="flex-1 border border-grayblue bg-white px-4 py-3 placeholder:text-grayblue"
        />
        <button
          type="submit"
          disabled={state.status === "submitting"}
          className="bg-navy px-8 py-3 text-sm font-semibold tracking-widest text-cream uppercase hover:bg-brass hover:text-navy-deep disabled:opacity-60"
        >
          {state.status === "submitting" ? "Joining…" : "Notify Me"}
        </button>
      </div>
      <div aria-hidden="true" className="visually-hidden">
        <label htmlFor="signup-website">Leave this field empty</label>
        <input
          id="signup-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>
      {state.status === "error" && (
        <p id="signup-error" role="alert" className="mt-2 text-sm text-red-800">
          {state.message}
        </p>
      )}
    </form>
  );
}
