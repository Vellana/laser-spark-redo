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
    <div class="vagaro" style="width:100%;padding:0;border:0;margin:0 auto;text-align:center;"><script type="text/javascript" src="https://www.vagaro.com//resources/WidgetEmbeddedLoader/OZqpD3KrDZKcT3qmV35y6JuPlXez3Ly6puSdBuOc1WJD1wOc1WO61CxdfkJE1wgEJgoapOUc9CvdfoS6XgQc9YO4pkvdfYP6PWP6O?v=uS8wb4IQMLQyEGgQDzZAGDOBDJvZEZ44J2VsUEfOlkX#"></script></div>
  </body>
</html>`;

const VagaroConsultWidget = () => {
  return (
    <div
      className="w-full"
      style={{ maxWidth: "340px", margin: "0 auto" }}
    >
      <iframe
        title="Book a Free Consultation"
        srcDoc={VAGARO_EMBED_HTML}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
        className="block border-0"
        style={{ width: "340px", height: "900px", margin: "0 auto" }}
      />
    </div>
  );
};

export default VagaroConsultWidget;
