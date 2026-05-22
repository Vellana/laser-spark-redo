import { useEffect, useRef } from "react";

const VAGARO_SCRIPT_SRC =
  "https://www.vagaro.com//resources/WidgetEmbeddedLoader/OZqpD3KrDZKcT3qmV35y6JuPlXez3Ly6puSdBuOc1WJD1wOc1WO61CxdfkJE1wgEJgoapOUc9CvdfoS6XgQc9YO4pkvdfYP6PWP6O?v=uS8wb4IQMLQyEGgQDzZAGDOBDJvZEZ44J2VsUEfOlkX#";

/**
 * Embeds the Vagaro consultation booking widget (Amy Kirschner — consultation only).
 * This is the ONLY customer-facing booking path while the in-house picker awaits
 * Vagaro calendar sync. Do not remove the in-house picker code/edge functions.
 */
const VagaroConsultWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // Avoid double-injecting if component remounts
    if (containerRef.current.querySelector("script[data-vagaro-loader]")) return;

    const script = document.createElement("script");
    script.src = VAGARO_SCRIPT_SRC;
    script.async = true;
    script.setAttribute("data-vagaro-loader", "true");
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center">
      <div id="frameTitle" className="embedded-widget-title" />
    </div>
  );
};

export default VagaroConsultWidget;
