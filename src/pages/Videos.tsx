import Seo from "../components/Seo";
import YouTubeEmbed from "../components/YouTubeEmbed";
import { YOUTUBE_VIDEOS } from "../config";

export default function Videos() {
  return (
    <>
      <Seo
        title="Videos — Miss Ann | Historic 1926 Yacht"
        description="Watch Miss Ann on the water — films and features on the historic 1926 fantail motor yacht and her restoration."
      />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
        <header className="text-center">
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            Videos
          </h1>
          <div aria-hidden="true" className="mx-auto my-6 h-px w-24 bg-brass" />
          <p className="mx-auto max-w-xl text-lg text-grayblue">
            Her story, told on the water — and the restoration that will carry
            it forward.
          </p>
        </header>

        <div className="mt-14 grid gap-12 md:grid-cols-2">
          {YOUTUBE_VIDEOS.map(({ id, title }) => (
            <figure key={id}>
              <YouTubeEmbed id={id} title={title} />
              <figcaption className="mt-3 font-display text-lg">
                {title}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
