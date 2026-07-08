import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  type?: string;
  image?: string;
}

const setMeta = (selector: string, attr: string, value: string, create: () => HTMLElement) => {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const SEO = ({ title, description, canonicalUrl, type = "website", image }: SEOProps) => {
  const baseUrl = "https://virginialaserspecialists.com";
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;
  const defaultImage = "https://storage.googleapis.com/gpt-engineer-file-uploads/6irTnypLT0T0JetI2hSqoSKB96W2/social-images/social-1769708068627-ChatGPT Image Jan 21, 2026, 02_17_14 PM.png";
  const finalImage = image || defaultImage;

  // Direct DOM fallback in case Helmet no-ops (e.g. provider timing issues).
  useEffect(() => {
    if (typeof document === "undefined") return;
    const prevTitle = document.title;
    document.title = title;

    const metaUpdates: Array<[string, string, "name" | "property", string]> = [
      [`meta[name="description"]`, description, "name", "description"],
      [`meta[property="og:title"]`, title, "property", "og:title"],
      [`meta[property="og:description"]`, description, "property", "og:description"],
      [`meta[property="og:type"]`, type, "property", "og:type"],
      [`meta[property="og:url"]`, fullCanonicalUrl, "property", "og:url"],
      [`meta[property="og:image"]`, finalImage, "property", "og:image"],
      [`meta[name="twitter:card"]`, "summary_large_image", "name", "twitter:card"],
      [`meta[name="twitter:title"]`, title, "name", "twitter:title"],
      [`meta[name="twitter:description"]`, description, "name", "twitter:description"],
      [`meta[name="twitter:image"]`, finalImage, "name", "twitter:image"],
    ];
    for (const [sel, val, keyAttr, keyVal] of metaUpdates) {
      setMeta(sel, "content", val, () => {
        const m = document.createElement("meta");
        m.setAttribute(keyAttr, keyVal);
        return m;
      });
    }

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", fullCanonicalUrl);

    return () => {
      document.title = prevTitle;
    };
  }, [title, description, fullCanonicalUrl, type, finalImage]);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Virginia Laser Specialists" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
};

export default SEO;
