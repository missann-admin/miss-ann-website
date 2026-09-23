import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import FileDropForm from "../components/FileDropForm";

export default function FileDrop() {
  return (
    <>
      <Seo
        title="Share Her History — Miss Ann"
        description="Photographs, papers, film, or memorabilia connected to Miss Ann — tell us what you have and we'll send a private upload link."
        noindex
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <header className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            Share Her History
          </h1>
          <div aria-hidden="true" className="mx-auto my-6 h-px w-24 bg-brass" />
          <p className="text-lg text-grayblue">
            A hundred years leave traces in attics and albums. If you have
            photographs, papers, film, or anything else touching
            Miss&nbsp;Ann&rsquo;s story, we would be grateful to see it.
          </p>
        </header>

        <div className="mt-12 grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold">
              Tell Us What You Have
            </h2>
            <p className="mt-2 mb-6 text-grayblue">
              Fill this in and we&rsquo;ll reply with a private link for
              sending your files — no account to create, nothing to install.
            </p>
            <FileDropForm />
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold">
              A Few Notes
            </h2>
            <dl className="mt-4 space-y-5">
              <div className="border-l-2 border-brass py-1 pl-4">
                <dt className="font-semibold">Originals stay with you</dt>
                <dd className="mt-1 text-grayblue">
                  We only ever need a scan or a photograph. Nothing you own
                  leaves your hands.
                </dd>
              </div>
              <div className="border-l-2 border-brass py-1 pl-4">
                <dt className="font-semibold">Condition doesn&rsquo;t matter</dt>
                <dd className="mt-1 text-grayblue">
                  Faded, torn, unlabelled, out of focus — send it anyway. A
                  blurred snapshot has settled more than one question about her
                  past.
                </dd>
              </div>
              <div className="border-l-2 border-brass py-1 pl-4">
                <dt className="font-semibold">We&rsquo;ll ask before using it</dt>
                <dd className="mt-1 text-grayblue">
                  Nothing you send appears on this site or in the museum
                  exhibit without your permission, and we will always credit
                  you as you prefer.
                </dd>
              </div>
              <div className="border-l-2 border-brass py-1 pl-4">
                <dt className="font-semibold">Not sure it&rsquo;s useful?</dt>
                <dd className="mt-1 text-grayblue">
                  Send it. What looks ordinary to you may be the only surviving
                  record of a year we know almost nothing about.
                </dd>
              </div>
            </dl>

            <div className="mt-10 border border-brass bg-navy px-6 py-8 text-cream">
              <h3 className="font-display text-xl font-semibold">
                Something other than files?
              </h3>
              <p className="mt-2 text-cream/90">
                Memories, corrections, or a story about her — those are just as
                welcome, and the{" "}
                <Link
                  to="/contact"
                  className="text-brass underline underline-offset-4 hover:text-cream"
                >
                  contact page
                </Link>{" "}
                is the place for them.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
