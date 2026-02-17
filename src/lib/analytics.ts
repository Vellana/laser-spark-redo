// GTM dataLayer helper utilities

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function getUtmParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const val = params.get(key);
    if (val) utms[key] = val;
  }
  return utms;
}

export function pushEvent(eventName: string, extra: Record<string, unknown> = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    timestamp: new Date().toISOString(),
    page_url: window.location.href,
    ...getUtmParams(),
    ...extra,
  });
}

export function getStoredUtms(): Record<string, string> {
  // Check URL first, then sessionStorage fallback
  const params = getUtmParams();
  if (Object.keys(params).length > 0) {
    try { sessionStorage.setItem("vls_utms", JSON.stringify(params)); } catch {}
    return params;
  }
  try {
    const stored = sessionStorage.getItem("vls_utms");
    if (stored) return JSON.parse(stored);
  } catch {}
  return {};
}
