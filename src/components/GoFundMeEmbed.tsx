type GoFundMeEmbedProps = {
  /** GoFundMe campaign URL, or null while the campaign is pending. */
  url: string | null;
};

export default function GoFundMeEmbed({ url }: GoFundMeEmbedProps) {
  if (!url) {
    return (
      <div className="border border-brass bg-cream-dark/40 px-6 py-10 text-center">
        <h3 className="font-display text-2xl font-semibold">
          Restoration Fund
        </h3>
        <p className="mx-auto mt-3 max-w-md text-lg">
          Our restoration fund launches soon — join the email list below to be
          notified.
        </p>
        <a
          href="#signup"
          className="mt-6 inline-block border border-navy px-6 py-2 text-sm font-semibold tracking-widest uppercase hover:bg-navy hover:text-cream"
        >
          Join the Email List
        </a>
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
          title="GoFundMe: Restore Miss Ann"
          className="h-[540px] w-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
}
