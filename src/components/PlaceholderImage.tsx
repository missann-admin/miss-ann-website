import { useState } from "react";

type PlaceholderImageProps = {
  /** Path under /public, e.g. "/images/era-siele.jpg". Shown when the file exists. */
  src?: string;
  /** Caption shown under the image and used as alt text. */
  caption: string;
  /** Tailwind aspect-ratio class for the block. */
  aspect?: string;
  className?: string;
};

/**
 * Renders the real photograph when the file exists; until then, an elegant
 * gray-and-brass placeholder block. Photos drop into /public/images with the
 * filenames listed in public/images/README.md — no code changes needed.
 */
export default function PlaceholderImage({
  src,
  caption,
  aspect = "aspect-[3/2]",
  className = "",
}: PlaceholderImageProps) {
  const [available, setAvailable] = useState(Boolean(src));

  return (
    <figure className={className}>
      {available && src ? (
        <img
          src={src}
          alt={caption}
          loading="lazy"
          onError={() => setAvailable(false)}
          className={`w-full border border-cream-dark object-cover ${aspect}`}
        />
      ) : (
        <div
          role="img"
          aria-label={`${caption} (photograph forthcoming)`}
          className={`flex w-full flex-col items-center justify-center gap-3 border border-brass/50 bg-gradient-to-br from-navy/10 via-grayblue/20 to-navy/20 ${aspect}`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 64 64"
            className="h-10 w-10 opacity-60"
          >
            <g
              stroke="#8a6d2f"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            >
              <circle cx="32" cy="32" r="15" />
              <circle cx="32" cy="32" r="5.5" />
              <line x1="41" y1="32" x2="55" y2="32" />
              <line x1="38.4" y1="38.4" x2="48.3" y2="48.3" />
              <line x1="32" y1="41" x2="32" y2="55" />
              <line x1="25.6" y1="38.4" x2="15.7" y2="48.3" />
              <line x1="23" y1="32" x2="9" y2="32" />
              <line x1="25.6" y1="25.6" x2="15.7" y2="15.7" />
              <line x1="32" y1="23" x2="32" y2="9" />
              <line x1="38.4" y1="25.6" x2="48.3" y2="15.7" />
            </g>
          </svg>
          <span className="px-4 text-center text-xs tracking-[0.2em] text-grayblue uppercase">
            Photograph forthcoming
          </span>
        </div>
      )}
      <figcaption className="mt-2 text-sm text-grayblue italic">
        {caption}
      </figcaption>
    </figure>
  );
}
