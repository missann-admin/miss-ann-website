import { Link } from "react-router-dom";

type SupportCTAProps = {
  /** On /restore itself, point the CTA at the email signup instead. */
  toSignup?: boolean;
};

export default function SupportCTA({ toSignup = false }: SupportCTAProps) {
  return (
    <section aria-label="Support her restoration" className="bg-navy text-cream">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div aria-hidden="true" className="mx-auto mb-6 h-px w-24 bg-brass" />
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">
          Support Her Restoration
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-cream/90">
          Help return this National Register landmark to the water for her
          second century.
        </p>
        <Link
          to={toSignup ? "/restore#signup" : "/restore"}
          className="mt-8 inline-block bg-brass px-8 py-3 text-sm font-semibold tracking-widest text-navy-deep uppercase hover:bg-cream"
        >
          {toSignup ? "Join the Email List" : "Restore Miss Ann"}
        </Link>
      </div>
    </section>
  );
}
