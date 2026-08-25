import { Link } from "react-router-dom";

type RestorationFundProps = {
  /** Campaign URL once a public fundraising campaign exists; null until then. */
  url: string | null;
};

/**
 * The restoration fund block on /restore. Until a public campaign exists, this
 * offers concrete ways to help rather than promising a launch date — a donor
 * moved by the story can reach the project directly, which suits substantial
 * gifts better than a campaign link anyway.
 */
export default function RestorationFund({ url }: RestorationFundProps) {
  if (!url) {
    return (
      <div className="border border-brass bg-cream-dark/40 px-6 py-10 sm:px-12">
        <h2 className="text-center font-display text-2xl font-semibold">
          How You Can Help
        </h2>
        <div aria-hidden="true" className="mx-auto my-5 h-px w-16 bg-brass" />
        <p className="mx-auto max-w-xl text-center text-lg">
          Her restoration fund is being organized now. In the meantime, there
          are three ways to take part in bringing her back.
        </p>
        <ul className="mx-auto mt-8 max-w-xl space-y-6">
          <li>
            <h3 className="font-display text-lg font-semibold">
              Offer your support directly
            </h3>
            <p className="mt-1">
              If you would like to contribute to her restoration, or you
              represent an organization interested in her preservation,{" "}
              <Link
                to="/contact"
                className="font-semibold underline underline-offset-4 hover:text-brass-dark"
              >
                please get in touch
              </Link>
              . We would be glad to talk with you.
            </p>
          </li>
          <li>
            <h3 className="font-display text-lg font-semibold">
              Join the email list
            </h3>
            <p className="mt-1">
              Be the first to hear when the restoration fund opens, and follow
              her progress along the way.
            </p>
          </li>
          <li>
            <h3 className="font-display text-lg font-semibold">
              Share her story
            </h3>
            <p className="mt-1">
              See the Miss&nbsp;Ann exhibit at the Colonial Beach Historical
              Society &amp; Museum, and tell someone who remembers her. A
              hundred years of history survive because people keep telling it.
            </p>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="text-center">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-brass px-10 py-4 text-base font-semibold tracking-widest text-navy-deep uppercase hover:bg-navy hover:text-cream"
      >
        Donate to Her Restoration
      </a>
      <div className="mx-auto mt-8 max-w-xl">
        <iframe
          src={`${url}/widget/large`}
          title="Restoration fund: Miss Ann"
          className="h-[540px] w-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
}
