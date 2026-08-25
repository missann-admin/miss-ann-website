import Seo from "../components/Seo";
import Timeline, { type Era } from "../components/Timeline";

const eras: Era[] = [
  {
    years: "1926",
    title: "Siele",
    body: (
      <>
        Commissioned by Detroit banker John H. French, designed by Benjamin T.
        Dobson, built by Pusey &amp; Jones, Wilmington, Delaware (yard hull
        #396). Keel laid December 1, 1925; christened by Mrs. French and
        launched April 10, 1926. &ldquo;Siele&rdquo; was an anagram of his
        wife&rsquo;s name. Steel hull with seven watertight compartments, teak
        decks and deckhouse, walnut-paneled salons, six staterooms, twin 300-hp
        Winton diesels.
      </>
    ),
    imageSrc: "/images/era-siele.jpg",
    imageCaption:
      "Siele on the ways at Pusey & Jones, Wilmington, Delaware, 1926",
  },
  {
    years: "1926",
    title: "Maiden Voyage",
    body: (
      <>
        In early August 1926, John and Elsie French, their servants, and
        friends set out from New York for what was meant to be a leisurely
        passage home to Detroit by way of the Great Lakes. A sudden storm blew
        up and Siele broached; her deep, narrow-beamed hull — built to keep
        Elsie, who feared the water, feeling safe — righted itself as designed.
        Mrs. French, thrown to the deck, went below and did not set foot aboard
        Siele again.
      </>
    ),
    imageSrc: "/images/era-maiden-voyage.jpg",
    imageCaption: "Elsie French christens Siele, April 10, 1926",
  },
  {
    years: "1936–1941",
    title: "Sea Wolf",
    body: (
      <>
        Sold in 1936 to Robert H. Wolfe of Columbus, Ohio, publisher of the{" "}
        <em>Columbus Dispatch</em>, who renamed her <em>Sea Wolf</em> and kept
        her at the Catawba Yacht Club between Sandusky and Toledo, Ohio. On
        January 13, 1941, Mr. Wolfe turned her over to the U.S. Navy to assist
        the war effort.
      </>
    ),
    imageSrc: "/images/era-seawolf.jpg",
    imageCaption: "Her salon during the Sea Wolf years, ca. 1936–1941",
  },
  {
    years: "1941–1946",
    title: "USS Aquamarine (PYc-7)",
    body: (
      <>
        Commissioned April 19, 1941, and refit at Charleston with
        higher-output diesels, a gyrocompass, battleship-gray paint, and two
        30-caliber guns. Assigned to the Naval Research Laboratory for
        pioneering underwater-acoustics research on the Potomac and
        Chesapeake, where NRL developed a bubble-cloud ship-quieting technique
        that cut underwater noise by 20 decibels and was adopted across the
        fleet. In the fall of 1943 she operated off the Connecticut coast near
        New London, and in the winter and spring of 1944 she cruised between
        Florida and the Bahamas — both times on further classified NRL
        experimental work. In 1945–46 she served as special tender to the
        presidential yachts USS <em>Potomac</em> and USS <em>Williamsburg</em>.
        Decommissioned June 21, 1946.
      </>
    ),
    imageSrc: "/images/era-aquamarine.jpg",
    imageCaption: "USS Aquamarine (PYc-7) in battleship gray",
  },
  {
    years: "1947–1954",
    title: "Silent Years",
    body: (
      <>
        The Navy transferred her to the Maritime Commission&rsquo;s War
        Shipping Administration for disposal in January 1947. Retired Colonel
        Edward Grimm bought the hull, intending to restore her and carry her
        home to the Philippines — a bigger undertaking than he expected. She
        sat uncared for and deteriorating in a salvage yard for the next
        several years.
      </>
    ),
    imageSrc: "/images/era-silent.jpg",
    imageCaption: "Laid up, late 1940s",
  },
  {
    years: "1954–2008",
    title: "Miss Ann at the Tides Inn",
    body: (
      <>
        Hearing she might be for sale and seeing her true potential, Ennolls
        A. Stephens, owner of The Tides Inn in Irvington, Virginia, made
        Colonel Grimm an offer; Grimm agreed, stripping the Navy engines and
        gyrocompass before the hull changed hands. Stephens hired
        New York yacht designer John H. Wells to rebuild her — new bow, graceful
        fanned stern, factory-rebuilt Cleveland diesel engines — and discovered
        the beautiful 1920s woodwork hidden under decades of battleship-gray
        paint. His hotel guests voted on a name for the rebuilt yacht, and it
        was clear the choice would be his wife&rsquo;s: Ann. For 52 years she
        carried Tides Inn guests along Carter Creek and the Rappahannock,
        wintering in Florida with the Stephenses from 1957 to 1960 and
        returning each spring when the inn reopened. In 1956, retired Navy
        Captain William Thomas heard her horn from shore and recognized it
        instantly: he had commanded her as USS <em>Aquamarine</em> a decade
        earlier.
      </>
    ),
    imageSrc: "/images/era-tidesinn.jpg",
    imageCaption: "Miss Ann on Carter Creek at The Tides Inn",
  },
  {
    years: "2008–Today",
    title: "Home to Colonial Beach",
    body: (
      <>
        Purchased by the Schroff brothers, who spent their boyhood summers at
        Colonial Beach. In 1998 she had been listed on the National Register of
        Historic Places and the Virginia Landmarks Register. Since 2019 she has
        been docked at Evans Island in Monroe Bay — and her restoration has
        begun.
      </>
    ),
    imageSrc: "/images/era-colonialbeach.jpg",
    imageCaption: "At Evans Island, Monroe Bay, Colonial Beach",
  },
];

const particulars = [
  { label: "Length", value: "127 feet" },
  { label: "Beam", value: "20.5 feet" },
  { label: "Draft", value: "7.5 feet" },
  { label: "Displacement", value: "183 tons" },
  { label: "Hull", value: "Steel" },
  { label: "Built", value: "1926, Pusey & Jones" },
  { label: "Propulsion", value: "Twin 425-hp diesels" },
  { label: "Cruising Speed", value: "9 knots" },
  { label: "National Register", value: "#98001310" },
  { label: "Virginia DHR File", value: "242-0034" },
];

export default function History() {
  return (
    <>
      <Seo
        title="Her Story — Miss Ann | Historic 1926 Yacht"
        description="From the 1926 yacht Siele to USS Aquamarine to the Tides Inn flagship Miss Ann — a century on the water, era by era."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <header className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            Her Story
          </h1>
          <div aria-hidden="true" className="mx-auto my-6 h-px w-24 bg-brass" />
          <p className="text-lg text-grayblue">
            Five names, three lives, one century — from a Gilded Age shipyard
            to the waters of Colonial Beach.
          </p>
        </header>

        <div className="mt-16 sm:mt-20">
          <Timeline eras={eras} />
        </div>
      </section>

      <section
        aria-labelledby="particulars-heading"
        className="mx-auto max-w-3xl px-4 pb-20"
      >
        <div className="border border-brass bg-navy px-6 py-10 text-cream sm:px-12">
          <h2
            id="particulars-heading"
            className="text-center font-display text-2xl font-semibold"
          >
            Vessel Particulars
          </h2>
          <div aria-hidden="true" className="mx-auto my-5 h-px w-16 bg-brass" />
          <dl className="mx-auto grid max-w-xl gap-x-8 gap-y-3 sm:grid-cols-2">
            {particulars.map(({ label, value }) => (
              <div key={label} className="text-center sm:text-left">
                <dt className="text-xs font-semibold tracking-[0.2em] text-brass uppercase">
                  {label}
                </dt>
                <dd className="mt-0.5 text-lg">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
