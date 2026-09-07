import { useLocation } from "react-router-dom";
import { useEffect } from "react";

/**
 * 404 page.
 *
 * The head tags here are set IMPERATIVELY, on purpose, and not through <Helmet>.
 *
 * Why: react-helmet-async is inert on this site. Verified live on the deployed
 * bundle - the rendered 404 carried ZERO tags marked data-rh and NO robots meta
 * at all, so the <Helmet> block that used to live here never applied. Every
 * page's real head comes from scripts/prerender-seo.mjs at build time, which is
 * why nobody noticed.
 *
 * That leaves a hole exactly here: an unknown URL is not in the prerender map,
 * so static hosting serves index.html and the junk URL inherits the HOMEPAGE
 * title, description and canonical while returning HTTP 200. To Google that is
 * a real, indexable page - a soft 404, and an unbounded number of them, each
 * self-canonicalising to the homepage.
 *
 * Do NOT "fix" this by making Helmet work globally. The prerendered head and
 * the SEO props have drifted apart on several routes, and prerender is the
 * correct one; switching Helmet on would let stale props overwrite live titles
 * that were deliberately tuned.
 *
 * This mirrors the same fix already shipped on cremeluxspa.com, which has the
 * identical prerender-plus-inert-Helmet architecture.
 */
const TITLE = "Page Not Found (404) | Virginia Laser Specialists";
const DESCRIPTION =
  "The page you're looking for doesn't exist. Return to Virginia Laser Specialists for laser hair removal and CoolPeel CO2 resurfacing in Tysons, VA.";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = TITLE;

    const setMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      const created = !tag;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      const previous = tag.content;
      tag.content = content;
      return () => {
        if (created) tag!.remove();
        else tag!.content = previous;
      };
    };

    const restoreRobots = setMeta("robots", "noindex, nofollow");
    const restoreDescription = setMeta("description", DESCRIPTION);

    // The inherited canonical points at the homepage, which would tell Google
    // this URL IS the homepage. Drop it while the 404 is on screen.
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const canonicalHref = canonical?.href;
    canonical?.remove();

    return () => {
      document.title = previousTitle;
      restoreRobots();
      restoreDescription();
      if (canonical && canonicalHref) {
        canonical.href = canonicalHref;
        document.head.appendChild(canonical);
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:opacity-80">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
