import type { ReactNode } from "react";
import PlaceholderImage from "./PlaceholderImage";

export type Era = {
  years: string;
  title: string;
  body: ReactNode;
  imageSrc: string;
  imageCaption: string;
};

type TimelineProps = {
  eras: Era[];
};

/** Alternating left/right timeline on desktop; stacked on mobile. */
export default function Timeline({ eras }: TimelineProps) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 hidden h-full w-px -translate-x-1/2 bg-brass/40 md:block"
      />
      <ol className="space-y-16 md:space-y-24">
        {eras.map((era, index) => {
          const textFirst = index % 2 === 0;
          return (
            <li
              key={era.years}
              className="relative md:grid md:grid-cols-2 md:gap-16"
            >
              <span
                aria-hidden="true"
                className="absolute top-2 left-1/2 hidden h-3 w-3 -translate-x-1/2 rotate-45 bg-brass md:block"
              />
              <div
                className={
                  textFirst
                    ? "md:pr-8 md:text-right"
                    : "md:order-2 md:pl-8 md:text-left"
                }
              >
                <p className="text-sm font-semibold tracking-[0.2em] text-brass-dark uppercase">
                  {era.years}
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
                  {era.title}
                </h3>
                <p className="mt-4 leading-relaxed">{era.body}</p>
              </div>
              <div
                className={
                  textFirst
                    ? "mt-6 md:mt-0 md:pl-8"
                    : "mt-6 md:order-1 md:mt-0 md:pr-8"
                }
              >
                <PlaceholderImage
                  src={era.imageSrc}
                  caption={era.imageCaption}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
