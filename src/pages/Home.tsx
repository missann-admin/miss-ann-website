import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { DONATE_URL } from "../config";

const highlights = [
  {
    title: "Built 1926",
    text: "Launched by the famed Pusey & Jones shipyard of Wilmington, Delaware — steel hull, teak decks, and walnut-paneled salons.",
  },
  {
    title: "Served in WWII",
    text: "As USS Aquamarine (PYc-7), a Naval Research Laboratory vessel and special tender to two presidential yachts.",
  },
  {
    title: "52 Years at the Tides Inn",
    text: "The beloved flagship of The Tides Inn, Irvington, Virginia, carrying guests along Carter Creek from 1954 to 2008.",
  },
];

export default function Home() {
  return (
    <>
      <Seo
        title="Miss Ann | Historic 1926 Fantail Motor Yacht — Colonial Beach, Virginia"
        description="Miss Ann is a 127-foot 1926 fantail motor yacht listed on the National Register of Historic Places, docked at Colonial Beach, Virginia. Learn her story and support her restoration."
      />

      <section className="relative bg-navy text-cream">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero.jpg')" }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-navy/60" />
        <div className="relative mx-auto max-w-4xl px-4 py-32 text-center sm:py-44">
          <h1 className="font-display text-5xl font-bold tracking-[0.25em] sm:text-7xl">
            MISS&nbsp;ANN
          </h1>
          <p className="mt-6 text-sm font-semibold tracking-[0.2em] text-cream/90 uppercase sm:text-base">
            A 1926 Fantail Motor Yacht{" "}
            <span aria-hidden="true" className="text-brass">
              &bull;
            </span>{" "}
            National Register of Historic Places
          </p>
          {DONATE_URL ? (
            <a
              href={DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-block bg-brass px-10 py-4 text-base font-semibold tracking-widest text-navy-deep uppercase hover:bg-cream"
            >
              Donate Now
            </a>
          ) : (
            <Link
              to="/restore"
              className="mt-10 inline-block bg-brass px-10 py-4 text-base font-semibold tracking-widest text-navy-deep uppercase hover:bg-cream"
            >
              Restore Miss Ann
            </Link>
          )}
        </div>
      </section>

      <section aria-label="Her legacy" className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
        <div aria-hidden="true" className="mx-auto mb-8 h-px w-24 bg-brass" />
        <p className="text-center font-display text-xl leading-relaxed sm:text-2xl">
          Launched in 1926 from the famed Pusey&nbsp;&amp;&nbsp;Jones shipyard,
          Miss&nbsp;Ann has lived three lives: Gatsby-era luxury yacht,
          decorated Navy research vessel USS&nbsp;<em>Aquamarine</em> — tender
          to two presidential yachts — and, for half a century, the beloved
          flagship of the Tides&nbsp;Inn. Listed on the National Register of
          Historic Places, she now rests at Colonial&nbsp;Beach, Virginia,
          awaiting her second century.
        </p>
      </section>

      <section
        aria-label="Highlights"
        className="border-y border-cream-dark bg-cream-dark/30"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3 sm:gap-8">
          {highlights.map(({ title, text }) => (
            <div key={title} className="text-center">
              <h2 className="font-display text-2xl font-semibold">{title}</h2>
              <div aria-hidden="true" className="mx-auto my-3 h-px w-12 bg-brass" />
              <p className="text-grayblue">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <aside aria-label="News" className="mx-auto max-w-4xl px-4 py-14">
        <div className="border border-brass/60 bg-cream px-6 py-6 text-center sm:px-10">
          <p className="text-xs font-semibold tracking-[0.25em] text-brass-dark uppercase">
            News
          </p>
          <p className="mt-2 text-lg">
            See the Miss&nbsp;Ann exhibit at the{" "}
            <a
              href="https://www.cbhistoryandmuseum.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-4 hover:text-brass-dark"
            >
              Colonial Beach Historical Society &amp; Museum
            </a>{" "}
            — 128 Hawthorne St, Colonial Beach — opening 2026.
          </p>
        </div>
      </aside>
    </>
  );
}
