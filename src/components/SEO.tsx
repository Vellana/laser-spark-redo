import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  type?: string;
  image?: string;
}

/**
 * Per-page head tags, rendered through react-helmet-async ONLY.
 *
 * Who owns what (2026-09-28):
 *  - scripts/prerender-seo.mjs writes the same tags into each route's static
 *    HTML (that is what a crawler reads before JavaScript), and stamps every tag
 *    this component also emits with data-rh="true". Helmet therefore REPLACES
 *    the static copy instead of appending a second one. The list it stamps is
 *    read from the <Helmet> block below, so add or remove a tag here and the
 *    prerender follows.
 *  - There used to be an imperative useEffect here that rewrote the FIRST
 *    matching tag in the DOM. It is gone on purpose: it left every page with two
 *    canonicals and two of every og/twitter tag, and on /booking (which passed
 *    no canonicalUrl) it rewrote the prerender's correct canonical to the
 *    homepage. Do not bring it back.
 *
 * canonicalUrl: when a page leaves it out, the canonical is the page's OWN
 * route (trailing slash dropped), never the homepage, so forgetting the prop
 * cannot tell Google a page is a copy of "/".
 */
const SEO = ({ title, description, canonicalUrl, type = "website", image }: SEOProps) => {
  const { pathname } = useLocation();
  const baseUrl = "https://virginialaserspecialists.com";
  const routePath = pathname.replace(/\/+$/, "") || "/";
  const fullCanonicalUrl = `${baseUrl}${canonicalUrl ?? routePath}`;
  const defaultImage = "https://storage.googleapis.com/gpt-engineer-file-uploads/6irTnypLT0T0JetI2hSqoSKB96W2/social-images/social-1769708068627-ChatGPT%20Image%20Jan%2021%2C%202026%2C%2002_17_14%20PM.png";
  const finalImage = image || defaultImage;

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
      <meta property="og:image" content={finalImage} />
      <meta property="og:site_name" content="Virginia Laser Specialists" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalImage} />
    </Helmet>
  );
};

export default SEO;
