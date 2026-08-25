import { Link } from "react-router-dom";

type RestorationFundProps = {
  /** Stripe Payment Link URL once one exists; null until then. */
  url: string | null;
};

const WAYS_TO_HELP = [
  {
    title: "Offer your support directly",
    body: (
      <>
        If you would like to contribute to her restoration, or you represent
        an organization interested in her preservation,{" "}
        <Link
          to="/contact"
          className="font-semibold underline underline-offset-4 hover:text-brass-dark"
        >
          please get in touch
        </Link>
        . We would be glad to talk with you.
      </>
    ),
  },
  {
    title: "Join the email list",
    body: "Be the first to hear when new ways to help open up, and follow her progress along the way.",
  },
  {
    title: "Share her story",
    body: "See the Miss Ann exhibit at the Colonial Beach Historical Society & Museum, and tell someone who remembers her. A hundred years of history survive because people keep telling it.",
  },
];

/**
 * The restoration fund block on /restore. Always offers the non-monetary
 * ways to help; adds a direct donate button once a Stripe Payment Link
 * exists. No nonprofit stands behind the project yet, so a donation
 * disclosure runs alongside the button — remove it if a fiscal sponsor
 * (e.g. CBHS) is arranged later.
 */
export default function RestorationFund({ url }: RestorationFundProps) {
  return (
    <div className="border border-brass bg-cream-dark/40 px-6 py-10 sm:px-12">
      <h2 className="text-center font-display text-2xl font-semibold">
        How You Can Help
      </h2>
      <div aria-hidden="true" className="mx-auto my-5 h-px w-16 bg-brass" />

      {url && (
        <div className="mx-auto mb-10 max-w-xl text-center">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-brass px-10 py-4 text-base font-semibold tracking-widest text-navy-deep uppercase hover:bg-navy hover:text-cream"
          >
            Donate Now
          </a>
          <p className="mt-4 text-sm text-grayblue">
            Miss&nbsp;Ann&rsquo;s restoration is not yet organized under a
            registered nonprofit, so donations are not tax-deductible.
          </p>
        </div>
      )}

      <p className="mx-auto max-w-xl text-center text-lg">
        {url
          ? "Every gift goes directly toward her restoration. There are other ways to take part too."
          : "Her restoration fund is being organized now. In the meantime, there are three ways to take part in bringing her back."}
      </p>
      <ul className="mx-auto mt-8 max-w-xl space-y-6">
        {WAYS_TO_HELP.map((item) => (
          <li key={item.title}>
            <h3 className="font-display text-lg font-semibold">
              {item.title}
            </h3>
            <p className="mt-1">{item.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
