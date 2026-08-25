import Seo from "../components/Seo";
import RestorationFund from "../components/RestorationFund";
import EmailSignupForm from "../components/EmailSignupForm";
import PlaceholderImage from "../components/PlaceholderImage";
import { GOFUNDME_URL } from "../config";

export default function Restore() {
  return (
    <>
      <Seo
        title="Restore Miss Ann — Support Her Restoration"
        description="Help restore Miss Ann, one of the last surviving 1920s fantail motor yachts, a WWII veteran, and a Virginia landmark on the National Register of Historic Places."
      />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
        <header className="text-center">
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            Restore Miss Ann
          </h1>
          <div aria-hidden="true" className="mx-auto my-6 h-px w-24 bg-brass" />
        </header>

        <div className="space-y-6 text-lg leading-relaxed">
          <p>
            Miss&nbsp;Ann is one of the last surviving 1920s fantail motor
            yachts in America. Her steel hull, teak decks, and walnut-paneled
            salons were shaped by Pusey&nbsp;&amp;&nbsp;Jones craftsmen at the
            height of the great yachting age — workmanship that can be
            restored, but never replicated.
          </p>
          <p>
            She is a veteran of the Second World War. As USS{" "}
            <em>Aquamarine</em>, she carried the Naval Research
            Laboratory&rsquo;s pioneering underwater-acoustics work that helped
            quiet the American fleet, and finished her service as tender to two
            presidential yachts.
          </p>
          <p>
            And she is a Virginia landmark, listed on the National Register of
            Historic Places and the Virginia Landmarks Register after half a
            century as the flagship of The Tides&nbsp;Inn. Restoring her
            preserves a piece of the Chesapeake&rsquo;s living history for her
            second century.
          </p>
        </div>

        <div className="mt-12">
          <PlaceholderImage
            src="/images/restore.jpg"
            caption="Miss Ann today at Evans Island, Monroe Bay — restoration under way"
          />
        </div>
      </section>

      <section
        aria-label="Restoration fund"
        className="mx-auto max-w-3xl px-4 pb-8"
      >
        <RestorationFund url={GOFUNDME_URL} />
      </section>

      <section
        id="signup"
        aria-labelledby="signup-heading"
        className="mx-auto max-w-3xl scroll-mt-8 px-4 pt-8 pb-20"
      >
        <h2
          id="signup-heading"
          className="text-center font-display text-2xl font-semibold"
        >
          Stay Informed
        </h2>
        <p className="mt-3 mb-6 text-center text-grayblue">
          Join the email list for restoration news and word of the
          fund&rsquo;s opening.
        </p>
        <EmailSignupForm />
      </section>
    </>
  );
}
