import Seo from "../components/Seo";
import ContactForm from "../components/ContactForm";

const references = [
  {
    name: "Virginia Department of Historic Resources",
    description: "Official register listing 242-0034 — Miss Ann (Yacht)",
    href: "https://www.dhr.virginia.gov/historic-registers/242-0034/",
  },
  {
    name: "National Register of Historic Places",
    description: "1998 Final Nomination (PDF)",
    href: "https://www.dhr.virginia.gov/wp-content/uploads/2018/04/242-0034_Miss_Ann_Yacht_1998_Final_Nomination.pdf",
  },
  {
    name: "Naval History and Heritage Command",
    description: "DANFS ship history — Aquamarine (PYc-7)",
    href: "https://www.history.navy.mil/research/histories/ship-histories/danfs/a/aquamarine.html",
  },
  {
    name: "Hagley Museum & Library",
    description: "1926 construction photographs of Siele",
    href: "https://digital.hagley.org/72350_3166",
  },
  {
    name: "Colonial Beach Historical Society & Museum",
    description: "Steward of Miss Ann's story in Colonial Beach",
    href: "https://www.cbhistoryandmuseum.org",
  },
];

export default function Contact() {
  return (
    <>
      <Seo
        title="Contact & Historical Reference — Miss Ann"
        description="Write to the Miss Ann restoration project, explore the historical record, and visit the Miss Ann exhibit at the Colonial Beach Historical Society & Museum."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <header className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            Contact &amp; Historical Reference
          </h1>
          <div aria-hidden="true" className="mx-auto my-6 h-px w-24 bg-brass" />
        </header>

        <div className="mt-12 grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold">
              Send a Message
            </h2>
            <p className="mt-2 mb-6 text-grayblue">
              Questions about Miss&nbsp;Ann, her history, or her restoration —
              we&rsquo;d be glad to hear from you.
            </p>
            <ContactForm />
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold">
              Historical Reference
            </h2>
            <p className="mt-2 mb-6 text-grayblue">
              The documentary record of her first century.
            </p>
            <ul className="space-y-4">
              {references.map(({ name, description, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block border-l-2 border-brass py-1 pl-4 hover:border-navy"
                  >
                    <span className="font-semibold underline-offset-4 group-hover:underline">
                      {name}
                    </span>
                    <span className="block text-sm text-grayblue">
                      {description}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-10 border border-brass bg-navy px-6 py-8 text-cream">
              <h2 className="font-display text-2xl font-semibold">
                Visit the Exhibit
              </h2>
              <p className="mt-3">
                Colonial Beach Historical Society &amp; Museum
                <br />
                128 Hawthorne St, Colonial Beach, VA 22443
              </p>
              <p className="mt-3 text-cream/80">
                Miss&nbsp;Ann exhibit opening 2026 &mdash;{" "}
                <a
                  href="https://www.cbhistoryandmuseum.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brass underline underline-offset-4 hover:text-cream"
                >
                  cbhistoryandmuseum.org
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
