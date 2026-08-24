import { useRef, useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";
import { isValidEmail, looksLikeSpam, type SubmitState } from "../lib/forms";

const SUCCESS_MESSAGE =
  "Thank you — we'll be in touch about Miss Ann's restoration.";

const inputClasses =
  "w-full border border-grayblue bg-white px-4 py-3 placeholder:text-grayblue";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const mountedAt = useRef(Date.now());

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !message.trim()) {
      setState({
        status: "error",
        message: "Please fill in your name and a message.",
      });
      return;
    }
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
          "The contact form isn't quite ready yet — please check back soon.",
      });
      return;
    }
    setState({ status: "submitting" });
    const { error } = await supabase.from("contact_messages").insert({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
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
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
      <div>
        <label htmlFor="contact-message" className="mb-1 block font-semibold">
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputClasses}
        />
      </div>
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
