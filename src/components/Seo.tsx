import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Canonical origin. www redirects here, so search engines see one address. */
const CANONICAL_ORIGIN = "https://missann.us";

type SeoProps = {
  title: string;
  description: string;
  /** Keep this page out of search results (utility pages, not content). */
  noindex?: boolean;
};

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** Per-page head management: title, description, canonical, and OpenGraph. */
export default function Seo({ title, description, noindex = false }: SeoProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    const canonical = `${CANONICAL_ORIGIN}${pathname === "/" ? "" : pathname}`;
    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonical);
    // Written on every page, not just noindex ones: setMeta only ever adds or
    // updates tags, so a noindex left behind by a previous page would follow
    // the visitor around this single-page app and deindex the whole site.
    setMeta("name", "robots", noindex ? "noindex,follow" : "index,follow");
    setCanonical(canonical);
  }, [title, description, noindex, pathname]);

  return null;
}
