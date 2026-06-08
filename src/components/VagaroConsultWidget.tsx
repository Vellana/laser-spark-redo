/**
 * Embeds the Vagaro consultation booking widget (Amy Kirschner — consultation only).
 * This is the ONLY customer-facing booking path while the in-house picker awaits
 * Vagaro calendar sync. Do not remove the in-house picker code/edge functions.
 *
 * The Vagaro loader uses document.write, which no-ops after the host page has
 * finished parsing. We embed it inside an <iframe srcdoc> so document.write
 * runs during the iframe's initial parse and renders correctly.
 *
 * Width: full container up to ~1100px so the Vagaro embed reflows the two
 * consult cards (Skin Resurfacing + Hair Removal) side-by-side on
 * desktop/tablet. On narrow viewports it naturally stacks and scrolls.
 */
const VAGARO_EMBED_HTML = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>html,body{margin:0;padding:0;background:transparent;}</style>
  </head>
  <body>
    <div id="frameTitle" class="embedded-widget-title" style="font-size: 23px; color: #333; font-family: Arial, Helvetica, sans-serif; line-height: 24px; padding: 18px 10px 8px; text-align: center; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;"></div>
    <div class="vagaro" style="width:250px; padding:0; border:0; margin:0 auto; text-align:center;">
      <style>.vagaro a { font-size: 14px; color: #AAA; text-decoration: none; }</style>
      <a href="https://www.vagaro.com/pro/">Powered by Vagaro</a>&nbsp;
      <a href="https://www.vagaro.com/pro/salon-software">Salon Software</a>,&nbsp;
      <a href="https://www.vagaro.com/pro/spa-software">Spa Software</a>&nbsp;&amp;&nbsp;
      <a href="https://www.vagaro.com/pro/fitness-software">Fitness Software</a>
      <script type="text/javascript" src="https://www.vagaro.com//resources/WidgetEmbeddedLoader/OZqpD3KrDZKcT3qmV35y79oz34mC2PeFJ4mC30m9dSycvCu7gCmjZcoapOUc9CvdfoS6XgQc9YO0?v=vhAbavvjpYdIUc0l5kIhATwM2tpAlfZYK02XBwE6Yle#"></script>
    </div>
  </body>
</html>`;

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

const VagaroConsultWidget = () => {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Vagaro's embed reflows based on the iframe width: narrow → single-column
  // (mobile-optimized), wide → side-by-side cards (desktop-optimized).
  const width = isMobile ? 340 : 1080;
  const height = isMobile ? 900 : 760;

  return (
    <div className="w-full" style={{ maxWidth: `${width}px`, margin: "0 auto" }}>
      <iframe
        key={isMobile ? "m" : "d"}
        title="Book a Free Consultation"
        srcDoc={VAGARO_EMBED_HTML}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
        className="block border-0"
        style={{ width: "100%", height: `${height}px`, margin: "0 auto" }}
      />
    </div>
  );
};

export default VagaroConsultWidget;
