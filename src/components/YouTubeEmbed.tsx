import { useState } from "react";

type YouTubeEmbedProps = {
  id: string;
  title: string;
};

/**
 * Click-to-load YouTube embed (lite-youtube pattern): shows only the thumbnail
 * until the visitor chooses to play, keeping page loads fast.
 */
export default function YouTubeEmbed({ id, title }: YouTubeEmbedProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="aspect-video w-full border border-cream-dark"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className="group relative block aspect-video w-full overflow-hidden border border-cream-dark bg-navy"
    >
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover opacity-90 group-hover:opacity-100"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-navy/80 ring-2 ring-brass group-hover:bg-brass">
          <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-cream">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
