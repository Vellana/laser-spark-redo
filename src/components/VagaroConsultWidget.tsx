import { useEffect, useState } from "react";

/**
 * Embeds the Vagaro consultation booking widget (Amy Kirschner — consultation only).
 * This is the ONLY customer-facing booking path while the in-house picker awaits
 * Vagaro calendar sync. Do not remove the in-house picker code/edge functions.
 *
 * The Vagaro loader uses document.write, which no-ops after the host page has
 * finished parsing. We embed it inside an <iframe srcdoc> so document.write
 * runs during the iframe's initial parse and renders correctly.
 *
 * Always uses mobile-optimized width (single-column consult cards).
 * Supports dark mode by injecting an override stylesheet inside the iframe
 * keyed to the parent site's current theme (matches system dark mode).
 */
const DARK_OVERRIDES = `
  html, body { background: #0f172a !important; color: #e5e7eb !important; }
  #frameTitle { color: #e5e7eb !important; }
  .vagaro a { color: #94a3b8 !important; }
  /* Vagaro widget cards / containers */
  [class*="widget"], [class*="Widget"],
  [class*="card"], [class*="Card"],
  [class*="service"], [class*="Service"],
  .v-card, .v-list, .v-item, .v-row, .v-col,
  div, section, article, li, ul {
    background-color: transparent !important;
    color: #e5e7eb !important;
    border-color: #334155 !important;
  }
  /* Buttons keep brand accent, ensure readable text */
  button, [class*="btn"], [class*="Button"], a[role="button"] {
    background-color: #3d5a80 !important;
    color: #ffffff !important;
    border-color: #3d5a80 !important;
  }
  /* Pricing / meta text */
  span, p, h1, h2, h3, h4, h5, h6, label, small, strong, em {
    color: #e5e7eb !important;
  }
  hr { border-color: #334155 !important; }
`;

const buildEmbedHtml = (dark: boolean) => `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>html,body{margin:0;padding:0;background:transparent;}</style>
    ${dark ? `<style>${DARK_OVERRIDES}</style>` : ""}
  </head>
  <body>
    <div id="frameTitle" class="embedded-widget-title" style="font-size: 23px; color: ${dark ? "#e5e7eb" : "#333"}; font-family: Arial, Helvetica, sans-serif; line-height: 24px; padding: 18px 10px 8px; text-align: center; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;"></div>
    <div class="vagaro" style="width:250px; padding:0; border:0; margin:0 auto; text-align:center;">
      <style>.vagaro a { font-size: 14px; color: ${dark ? "#94a3b8" : "#AAA"}; text-decoration: none; }</style>
      <a href="https://www.vagaro.com/pro/">Powered by Vagaro</a>&nbsp;
      <a href="https://www.vagaro.com/pro/salon-software">Salon Software</a>,&nbsp;
      <a href="https://www.vagaro.com/pro/spa-software">Spa Software</a>&nbsp;&amp;&nbsp;
      <a href="https://www.vagaro.com/pro/fitness-software">Fitness Software</a>
      <script type="text/javascript" src="https://www.vagaro.com//resources/WidgetEmbeddedLoader/OZqpD3KrDZKcT3qmV35y79oz34mC2PeFJ4mC30m9dSycvCu7gCmjZcoapOUc9CvdfoS6XgQc9YO0?v=vhAbavvjpYdIUc0l5kIhATwM2tpAlfZYK02XBwE6Yle#"></script>
    </div>
  </body>
</html>`;

const getIsDark = () =>
  typeof document !== "undefined" &&
  document.documentElement.classList.contains("dark");

const VagaroConsultWidget = () => {
  const width = 340;
  const height = 900;
  const [isDark, setIsDark] = useState<boolean>(getIsDark);

  useEffect(() => {
    // Track <html class="dark"> toggles (site supports system dark mode).
    const obs = new MutationObserver(() => setIsDark(getIsDark()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="w-full" style={{ maxWidth: `${width}px`, margin: "0 auto" }}>
      <iframe
        key={isDark ? "dark" : "light"}
        title="Book a Free Consultation"
        srcDoc={buildEmbedHtml(isDark)}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
        className="block border-0"
        style={{ width: "100%", height: `${height}px`, margin: "0 auto" }}
      />
    </div>
  );
};

export default VagaroConsultWidget;
