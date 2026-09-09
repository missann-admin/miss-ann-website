import { Link } from "react-router-dom";
import Seo from "../components/Seo";

export default function ThankYou() {
  return (
    <>
      <Seo
        title="Thank You — Miss Ann | Historic 1926 Yacht"
        description="Thank you for supporting the restoration of Miss Ann, a 1926 fantail motor yacht on the National Register of Historic Places."
      />

      <section className="mx-auto max-w-2xl px-4 py-20 text-center sm:py-28">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">
          Thank You
        </h1>
        <div aria-hidden="true" className="mx-auto my-6 h-px w-24 bg-brass" />

        <p className="text-lg leading-relaxed">
          Your generosity helps carry Miss&nbsp;Ann into her second century.
          Every gift goes directly toward her restoration, and we&rsquo;re
          grateful you chose to be part of her story.
        </p>

        <p className="mt-6 text-lg leading-relaxed">
          Watch for updates on her progress, and if you haven&rsquo;t already,
          join the email list to hear when the next chapter unfolds.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/restore#signup"
            className="inline-block bg-brass px-8 py-3 text-sm font-semibold tracking-widest text-navy-deep uppercase hover:bg-navy hover:text-cream"
          >
            Join the Email List
          </Link>
          <Link
            to="/history"
            className="inline-block border border-brass px-8 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-brass hover:text-navy-deep"
          >
            Read Her Story
          </Link>
        </div>
      </section>
    </>
  );
}
