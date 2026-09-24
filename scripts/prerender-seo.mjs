#!/usr/bin/env node
/**
 * Build-time SEO prerendering.
 *
 * After `vite build`, for every PUBLIC route below, write
 * dist/<route>/index.html: a copy of dist/index.html with that route's
 * title, meta description, canonical, og:*, and twitter:* substituted
 * in.
 *
 * Titles and descriptions are PARSED AT BUILD TIME from each route's own
 * <SEO title="..." description="..." /> props in src/pages/*.tsx, so the
 * prerendered head and the client-side head can never drift apart.
 *
 * ...AND ITS OWN BODY (Sep 16 2026).
 *
 * Until now this script rewrote the HEAD ONLY. The <div id="root"><noscript>
 * block in dist/index.html was copied verbatim to every route, so all eleven
 * URLs served the SAME 173-177 words, the same H1 ("Virginia Laser Specialists
 * - Laser Hair Removal & CoolPeel Skin Resurfacing in Tysons, VA") and the same
 * three H2s. Measured live on 2026-09-16 across /, /laser-hair-removal,
 * /laser-skin-resurfacing, /coolpeel-co2-laser-tysons-va, /pricing, /about and
 * /faq: identical, every one. On /laser-skin-resurfacing the words "acne scar"
 * and "stretch mark" appeared zero times in the served HTML although both are
 * in its meta description, and its two money pages were absent from
 * `site:virginialaserspecialists.com` entirely while /unsubscribe was indexed.
 *
 * So every route now gets its OWN crawler body, built from that page's own
 * source: its real H1, its own static headings and paragraphs, and a link list
 * scraped from the footer. Nothing is written here by hand and nothing is
 * invented - if it is not already on the page, it does not reach the body.
 *
 * Move Marketing is the proof this works: it ships per-route crawler bodies the
 * same way and holds #1 for marketing agency DMV, DMV marketing agency,
 * influencer marketing DMV and UGC content agency DC.
 *
 * WHY IT STAYS INSIDE <noscript>. The alternative - putting the block in the
 * #root shell so a rendering crawler counts it too - would flash unstyled text
 * on every page load before React mounts, which is a visible change to a site
 * whose branding is fenced. mm-hub's bodies are in <noscript> and rank, so
 * <noscript> is demonstrably not the binding constraint.
 *
 * FENCES THIS FILE ENFORCES AT BUILD TIME (see the guards near the bottom):
 *  - no route may ship the homepage H1 (that is the duplicate-body fingerprint)
 *  - no crawler body may carry a price, a percentage discount or a dated offer
 *    (operational facts are the client's, not SEO's, and a promo copied into
 *    eleven pages is eleven places to go stale)
 *  - no heading may be a glued "<service> <City> <ST> and <service> <City> <ST>"
 *    keyword chain
 *
 * Excluded: /admin, /admin/email-list, /services/coolpeel (redirect), and
 * NotFound. /unsubscribe is NOT excluded any more - see the ROUTES comment.
 */
import { promises as fs, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const PAGES = path.join(ROOT, "src", "pages");
const BASE_URL = "https://virginialaserspecialists.com";

// route -> source page whose <SEO ... /> props are the single source of truth.
const ROUTES = [
  { path: "/", source: "Index.tsx" },
  { path: "/booking", crumb: "Book Now", source: "Booking.tsx" },
  { path: "/pricing", crumb: "Pricing", source: "Pricing.tsx" },
  { path: "/specials", crumb: "Specials", source: "Specials.tsx" },
  { path: "/summer-presale", source: "SummerPresale.tsx", noindex: true },
  { path: "/gallery", crumb: "Gallery", source: "Gallery.tsx" },
  { path: "/about", crumb: "About", source: "About.tsx" },
  { path: "/contact", crumb: "Contact", source: "Contact.tsx" },
  { path: "/laser-hair-removal", crumb: "Laser Hair Removal", source: "LaserHairRemoval.tsx" },
  { path: "/laser-skin-resurfacing", crumb: "Laser Skin Resurfacing", source: "LaserSkinResurfacing.tsx" },
  { path: "/coolpeel-co2-laser-tysons-va", crumb: "CoolPeel CO₂ Tysons VA", source: "CoolPeelTysons.tsx", title: "CoolPeel Skin Resurfacing Tysons | CoolPeel Vienna VA", description: "CO2 laser Tysons and CoolPeel skin resurfacing Tysons on the DEKA Tetra Pro platform, plus CoolPeel Vienna VA. 1-3 day recovery. Call 703-547-4499.", faq: "coolpeel" },
  { path: "/faq", crumb: "FAQ", source: "FAQ.tsx", faq: "faq" },
  // /unsubscribe was SKIPPED, which is not the same as excluded. A skipped
  // route falls back to dist/index.html, so it served the homepage title AND
  // canonical="https://virginialaserspecialists.com/" with no robots tag -
  // verified live 2026-09-16, and Google has it indexed while the two service
  // money pages are not. It is prerendered now for the sole purpose of getting
  // a real `noindex, follow` and its own canonical.
  { path: "/unsubscribe", source: "Unsubscribe.tsx", noindex: true },
];

/**
 * Extract an array literal (`const <name> ... = [ ... ];`) from a page source
 * and evaluate it. Q&A text is therefore always read from the same array the
 * page renders from, so the prerendered JSON-LD cannot drift from the visible
 * accordion copy.
 */
function extractArray(source, name) {
  const decl = new RegExp(`\\bconst\\s+${name}\\b[^=]*=\\s*\\[`).exec(source);
  if (!decl) throw new Error(`array "${name}" not found`);
  const start = decl.index + decl[0].length - 1;
  let depth = 0;
  let inStr = null;
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    if (inStr) {
      if (ch === "\\") i++;
      else if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") inStr = ch;
    else if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) {
        const literal = source.slice(start, i + 1);
        // eslint-disable-next-line no-new-func
        return new Function(`return (${literal});`)();
      }
    }
  }
  throw new Error(`array "${name}" is unterminated`);
}

function answerToText(a) {
  return typeof a === "string" ? a : [a.intro, ...a.bullets].filter(Boolean).join(" • ");
}

// Per-route FAQPage builders. Only these two routes get FAQPage markup, and
// only because both render the same Q&A visibly on the page.
const FAQ_BUILDERS = {
  faq(source) {
    return ["generalFAQs", "coolpeelFAQs", "tetraProFAQs", "hairRemovalFAQs"]
      .flatMap((name) => extractArray(source, name))
      .map((item) => ({ question: item.q, answer: answerToText(item.a) }));
  },
  coolpeel(source) {
    return extractArray(source, "faqs").map((item) => ({
      question: item.question,
      answer: item.answer,
    }));
  },
};

// Per-route Service JSON-LD. The pages' own <Helmet>/jsonLd Service blocks never
// reach production (Helmet is inert on this build), so before this every
// service page shipped only the sitewide MedicalSpa. Descriptions reuse the
// sitewide OfferCatalog text and each page's own copy - nothing invented, no
// prices. provider points at the MedicalSpa @id declared in index.html.
const PROVIDER = { "@id": `${BASE_URL}/#medspa` };
const SERVICE_LD = {
  "/laser-hair-removal": {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}/laser-hair-removal#service`,
    name: "Laser Hair Removal",
    alternateName: "Clarity II laser hair removal",
    serviceType: "Laser hair removal",
    description:
      "Permanent hair reduction with the Lutronic Clarity II dual-wavelength laser (Alexandrite and Nd:YAG), safe for all skin types, at our Vienna VA medical spa serving Tysons Corner and McLean.",
    url: `${BASE_URL}/laser-hair-removal`,
    provider: PROVIDER,
    areaServed: ["Vienna, VA", "Tysons Corner, VA", "McLean, VA"],
  },
  "/laser-skin-resurfacing": {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}/laser-skin-resurfacing#service`,
    name: "CO2 Laser Skin Resurfacing",
    alternateName: "Fractional CO2 laser resurfacing",
    serviceType: "Laser skin resurfacing",
    description:
      "Fractional CO2 laser resurfacing on the Tetra Pro platform: CoolPeel for mild wrinkles, sun damage and uneven texture with minimal downtime, or DEKA Pulse for deep wrinkles, scars and severe sun damage.",
    url: `${BASE_URL}/laser-skin-resurfacing`,
    provider: PROVIDER,
    areaServed: ["Vienna, VA", "Tysons, VA"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Laser skin resurfacing treatments",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Scar Removal", description: "Laser treatment to minimize scars and improve skin texture." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Acne Scar Treatment", description: "Targeted laser treatment for acne scarring and skin resurfacing." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Stretch Mark Removal", description: "Laser treatment to reduce the appearance of stretch marks." } },
      ],
    },
  },
  "/coolpeel-co2-laser-tysons-va": {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}/coolpeel-co2-laser-tysons-va#service`,
    name: "CoolPeel CO2 Laser Resurfacing",
    serviceType: "CoolPeel CO2 laser resurfacing",
    description:
      "CoolPeel skin resurfacing performed with the Cartessa Tetra Pro fractional CO2 laser. Treats fine lines, sun damage, large pores, and uneven texture with 1-3 days of downtime.",
    url: `${BASE_URL}/coolpeel-co2-laser-tysons-va`,
    provider: PROVIDER,
    areaServed: ["Tysons, VA", "Vienna, VA"],
  },
};

// ---------------------------------------------------------------------------
// CRAWLER BODIES
//
// One per route, built from that route's own page source. See the file header
// for what was wrong and why this exists.
// ---------------------------------------------------------------------------

/** Strip JSX/HTML down to the text a reader would actually see. */
function textOf(fragment) {
  return fragment
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/\{"\s*"\}/g, " ")     // the {" "} spacer JSX uses between links
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Static elements of one tag from a page source.
 *
 * "Static" means no `{expression}` anywhere inside: an interpolated heading or
 * paragraph depends on runtime state, and half-rendering it into the crawler
 * layer would produce text no visitor ever sees. Those are skipped, never
 * guessed at.
 */
function staticMatches(source, tag) {
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "g");
  const out = [];
  for (const m of source.matchAll(re)) {
    if (m[1].includes("{")) continue;
    const text = textOf(m[1]);
    if (text) out.push({ text, start: m.index, end: m.index + m[0].length });
  }
  return out;
}

function staticTags(source, tag) {
  return staticMatches(source, tag).map((m) => m.text);
}

/**
 * OPERATIONAL FACTS NEVER REACH A CRAWLER BODY.
 *
 * Prices, percentage discounts and dated offers belong to the client and change
 * without telling us. /pricing already carries a "Valid June 15-20, 2026" line
 * that is three months stale; copying that shape into eleven prerendered files
 * would create eleven stale copies, and the standing rule is that SEO never
 * touches a price, an hour, a policy or a promotion. Any paragraph matching
 * this is dropped from the body - the page still renders it for humans.
 */
const OPERATIONAL_RE = /\$\s?\d|\b\d{1,3}\s?%\s?off\b|\bvalid\b|\bfinancing\b|\$0 down|\bcannot be combined\b|\bsale\b/i;

/**
 * A GLUED KEYWORD CHAIN, not a service area.
 *
 * "Serving Tysons, Vienna & McLean" is a sentence. "Acne Scar Treatment Vienna
 * VA and Scar Removal Vienna VA" is a rank tracker talking. The difference is
 * the repeated "<phrase> <City> <ST>" shape, so that is what this matches -
 * counting geo mentions would fire on every honest service-area line.
 */
const CITY_ST = "(?:Vienna|Tysons(?: Corner)?|McLean|Fairfax|Falls Church)\\s*,?\\s*VA";
const CHAIN_RE = new RegExp(`${CITY_ST}\\b[\\s\\S]{0,40}\\band\\b[\\s\\S]{0,40}${CITY_ST}\\b`, "i");

/**
 * SITEWIDE LINK LIST, appended to every generated body.
 *
 * Scraped from the footer's own quickLinks array, so every anchor is a label a
 * visitor already sees and nothing reads as a keyword chain. It also gives a
 * JS-free crawler a path into /laser-skin-resurfacing and
 * /coolpeel-co2-laser-tysons-va from every other page, which matters because
 * neither is currently in Google's index.
 */
const siteLinks = (() => {
  const src = readFileSync(path.join(ROOT, "src", "components", "Footer.tsx"), "utf8");
  const m = src.match(/const\s+quickLinks\s*=\s*\[([\s\S]*?)\n\s*\];/);
  if (!m) throw new Error("[prerender-seo] Footer.tsx: could not find `const quickLinks = [...]` to build the crawler link list.");
  const links = [...m[1].matchAll(/name:\s*"([^"]+)",\s*href:\s*"([^"]+)"/g)]
    .map((x) => ({ name: x[1], href: x[2] }))
    .filter((l) => l.href.startsWith("/") && !l.href.includes("#") && !l.href.startsWith("/admin"));
  if (links.length < 8) throw new Error(`[prerender-seo] Footer.tsx quickLinks parsed to only ${links.length} links - the scrape broke.`);
  return links;
})();

const SITE_LINKS_HTML =
  "<nav>" +
  siteLinks.map((l) => `<a href="${escapeAttr(l.href)}">${escapeHtml(l.name)}</a>`).join(" | ") +
  "</nav>";

/**
 * Build one route's crawler body. Returns { html, h1 } or throws.
 *
 * `maxParagraphs` keeps the block proportionate: it is a fallback for a crawler
 * that cannot run the page, not a second copy of the site.
 */
function buildBody(routePath, source, sourceFile) {
  const h1s = staticTags(source, "h1");
  if (!h1s.length) {
    throw new Error(`[prerender-seo] ${routePath}: no static <h1> in ${sourceFile} to head its crawler body.`);
  }
  const h1 = h1s[0];
  const usable = (p) => p.length > 40 && !OPERATIONAL_RE.test(p);

  const parts = [`<h1>${escapeHtml(h1)}</h1>`];
  const used = new Set();

  const intro = staticTags(source, "p").find(usable);
  if (intro) { parts.push(`<p>${escapeHtml(intro)}</p>`); used.add(intro); }

  // Every <h2 opening tag, static or interpolated, starts a new page section.
  const h2Starts = [...source.matchAll(/<h2\b/g)].map((m) => m.index);

  for (const h2 of staticMatches(source, "h2").slice(0, 8)) {
    if (h2.text === h1) continue;
    parts.push(`<h2>${escapeHtml(h2.text)}</h2>`);
    // The first unused static paragraph INSIDE THIS HEADING'S OWN SECTION: after
    // the heading and before the next <h2> in the source, so the body reads as
    // headings with their own copy. Sliced by offsets, not searched for by text.
    //
    // v5 (2026-09-24): until now the search ran to the end of the file, so a
    // heading with no static paragraph of its own took the NEXT section's. Live
    // that day, the CoolPeel FAQ heading carried the street address, "Visit Us"
    // carried the opening hours, and on /laser-hair-removal "Why Choose Us"
    // carried the Treatment Areas line. A heading with no copy of its own now
    // ships alone rather than borrowing someone else's.
    const nextH2 = h2Starts.find((i) => i > h2.start);
    const section = source.slice(h2.end, nextH2 ?? source.length);
    const next = staticTags(section, "p").find((p) => usable(p) && !used.has(p));
    if (next) { parts.push(`<p>${escapeHtml(next)}</p>`); used.add(next); }
  }

  parts.push(SITE_LINKS_HTML);
  return { html: `<main>${parts.join("")}</main>`, h1 };
}

/**
 * Minimum crawler-body length, in words.
 *
 * Content routes must carry real copy. Utility routes genuinely have none -
 * /booking is a Vagaro widget, /gallery is images, /pricing and /specials are
 * price tables whose paragraphs are deliberately filtered out by
 * OPERATIONAL_RE - so holding them to a prose floor would either fail the build
 * for ever or invite someone to pad them with copy nobody wrote. They still
 * have to beat the floor that proves the swap happened at all.
 */
const THIN_ROUTES = new Set([
  "/booking", "/gallery", "/pricing", "/specials", "/unsubscribe", "/summer-presale",
  // /contact is a form and a contact card. Its only prose is one line; the rest
  // is the address and the opening hours, which are operational facts and stay
  // on the page rather than being copied into a build artifact.
  "/contact",
]);
const minWordsFor = (p) => (THIN_ROUTES.has(p) ? 25 : 60);

function faqSchema(entries) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}


/**
 * Pull the first <SEO ... /> element's title/description props out of a page.
 * Handles single- or multi-line prop lists and any prop ordering.
 */
function parseSeoProps(source) {
  const tag = source.match(/<SEO\b([\s\S]*?)\/>/);
  if (!tag) return {};
  const props = tag[1];
  const read = (name) => {
    const m = props.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`));
    return m ? m[1].trim() : undefined;
  };
  return { title: read("title"), description: read("description") };
}

// Attribute-order-agnostic replacer for <tag ... key="oldvalue" ...>.
function replaceAttr(html, tagPattern, keyAttr, keyVal, valueAttr, newValue) {
  const re = new RegExp(
    `<${tagPattern}\\b([^>]*?)\\b${keyAttr}\\s*=\\s*"${keyVal}"([^>]*)>`,
    "i",
  );
  return html.replace(re, (match, before, after) => {
    const rebuild = (segment) =>
      segment.replace(
        new RegExp(`\\b${valueAttr}\\s*=\\s*"[^"]*"`, "i"),
        `${valueAttr}="${escapeAttr(newValue)}"`,
      );
    let updatedBefore = rebuild(before);
    let updatedAfter = rebuild(after);
    if (
      !new RegExp(`\\b${valueAttr}\\s*=`, "i").test(updatedBefore) &&
      !new RegExp(`\\b${valueAttr}\\s*=`, "i").test(updatedAfter)
    ) {
      updatedAfter = ` ${valueAttr}="${escapeAttr(newValue)}"` + updatedAfter;
    }
    return `<${tagPattern.replace(/\\/g, "")}${updatedBefore} ${keyAttr}="${keyVal}"${updatedAfter}>`;
  });
}

function escapeAttr(v) {
  return String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function escapeHtml(v) {
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeRegExp(v) {
  return String(v).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Replace a matching meta tag regardless of attribute order/quotes, or insert
// it when the template has no matching tag.
function upsertMeta(html, keyAttr, keyValue, content) {
  const tagRe = new RegExp(
    `<meta\\b(?=[^>]*\\b${keyAttr}\\s*=\\s*(["'])${escapeRegExp(keyValue)}\\1)[^>]*>`,
    "i",
  );
  const existing = html.match(tagRe);

  if (existing) {
    const tag = existing[0];
    const contentRe = /\bcontent\s*=\s*(["'])[^"']*\1/i;
    const replacement = contentRe.test(tag)
      ? tag.replace(contentRe, `content="${escapeAttr(content)}"`)
      : tag.replace(/\s*\/?\s*>$/, ` content="${escapeAttr(content)}" />`);
    return html.replace(tagRe, replacement);
  }

  return html.replace(
    /<\/head>/i,
    `  <meta ${keyAttr}="${keyValue}" content="${escapeAttr(content)}" />\n  </head>`,
  );
}

function readMetaContent(html, keyAttr, keyValue) {
  const tagRe = new RegExp(
    `<meta\\b(?=[^>]*\\b${keyAttr}\\s*=\\s*(["'])${escapeRegExp(keyValue)}\\1)[^>]*>`,
    "i",
  );
  const tag = html.match(tagRe)?.[0];
  if (!tag) return undefined;
  return tag.match(/\bcontent\s*=\s*(["'])(.*?)\1/i)?.[2]?.trim();
}

// v4: every route carries its OWN crawler body, not the homepage's.
// v5: a crawler-body heading only takes a paragraph from its own section.
const PRERENDER_VERSION = "v5";

/**
 * The homepage <noscript> H1 from index.html - the fingerprint of a duplicate
 * body. The "/" output MUST match it (positive control, proving the pattern is
 * live) and every other route MUST NOT. Written with a raw "&" in index.html
 * and re-encodable to "&amp;", so the pattern takes either; matching only one
 * spelling would leave this guard unable to fail.
 */
const HOME_H1_RE = /Virginia Laser Specialists - Laser Hair Removal (?:&|&amp;) CoolPeel Skin Resurfacing in Tysons, VA/;

function transform(html, { title, description, canonical, noindex, jsonLd, serviceLd, breadcrumbLd, body }) {
  let out = html;

  // <title>
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  // Descriptions (name/property variants): replace when present, insert when absent.
  out = upsertMeta(out, "name", "description", description);
  out = upsertMeta(out, "property", "og:description", description);
  out = upsertMeta(out, "name", "twitter:description", description);

  // canonical link
  out = out.replace(
    /<link\b([^>]*?)\brel\s*=\s*"canonical"([^>]*)>/i,
    (m, before, after) => {
      const inject = (seg) =>
        seg.replace(/\bhref\s*=\s*"[^"]*"/i, `href="${escapeAttr(canonical)}"`);
      let b = inject(before);
      let a = inject(after);
      if (!/\bhref\s*=/i.test(b) && !/\bhref\s*=/i.test(a)) {
        a = ` href="${escapeAttr(canonical)}"` + a;
      }
      return `<link${b} rel="canonical"${a}>`;
    },
  );

  // OG / Twitter
  out = replaceAttr(out, "meta", "property", "og:title", "content", title);
  out = replaceAttr(out, "meta", "property", "og:url", "content", canonical);
  out = replaceAttr(out, "meta", "name", "twitter:title", "content", title);

  // Inject any tag the template did not already contain.
  const ensureMeta = (attr, key, value) => {
    const re = new RegExp(`<meta\\b[^>]*\\b${attr}\\s*=\\s*"${key}"`, "i");
    if (!re.test(out)) {
      out = out.replace(
        /<\/head>/i,
        `  <meta ${attr}="${key}" content="${escapeAttr(value)}" />\n  </head>`,
      );
    }
  };
  ensureMeta("property", "og:title", title);
  ensureMeta("name", "twitter:title", title);

  // Per-route JSON-LD (crawler-visible without JavaScript).
  for (const block of [jsonLd, serviceLd, breadcrumbLd]) {
    if (!block) continue;
    const json = JSON.stringify(block).replace(/</g, "\\u003c");
    out = out.replace(
      /<\/head>/i,
      `  <script type="application/ld+json">${json}</script>\n  </head>`,
    );
  }

  // Swap the homepage <noscript> fallback for this route's own body. Matches
  // the BODY noscript - the one wrapping a <header> inside #root - never the
  // Google Tag Manager <noscript><iframe> in the head region.
  if (body) {
    const before = out;
    out = out.replace(/<noscript>\s*<header[\s\S]*?<\/noscript>/i, () => `<noscript>${body.html}</noscript>`);
    if (out === before) {
      throw new Error("[prerender-seo] could not find the body <noscript> in dist/index.html to replace - the shell changed.");
    }
  }

  // Version marker so the deployed script version is verifiable from raw HTML.
  out = out.replace(
    /<\/head>/i,
    `  <!-- prerender-seo ${PRERENDER_VERSION} -->\n  </head>`,
  );

  if (noindex) {
    out = replaceAttr(out, "meta", "name", "robots", "content", "noindex, follow");
    if (!/<meta\b[^>]*\bname\s*=\s*"robots"/i.test(out)) {
      out = out.replace(
        /<\/head>/i,
        `  <meta name="robots" content="noindex, follow" />\n  </head>`,
      );
    }
  }

  return out;
}

async function main() {
  const indexPath = path.join(DIST, "index.html");
  let template;
  try {
    template = await fs.readFile(indexPath, "utf8");
  } catch (err) {
    console.error(`[prerender-seo] dist/index.html missing — did vite build run? ${err.message}`);
    process.exit(1);
  }

  const written = [];
  const skipped = [];

  for (const route of ROUTES) {
    let pageSource;
    try {
      pageSource = await fs.readFile(path.join(PAGES, route.source), "utf8");
    } catch (err) {
      skipped.push(`${route.path} (source ${route.source} unreadable)`);
      continue;
    }
    let { title } = parseSeoProps(pageSource);
    let { description } = parseSeoProps(pageSource);
    if (route.title) title = route.title;
    if (route.description) description = route.description;
    if (!title || !description) {
      skipped.push(
        `${route.path} (missing ${!title ? "title" : ""}${!title && !description ? " and " : ""}${!description ? "description" : ""} in ${route.source} <SEO />)`,
      );
      continue;
    }
    const canonical = `${BASE_URL}${route.path}`;
    let jsonLd;
    if (route.faq) {
      const entries = FAQ_BUILDERS[route.faq](pageSource);
      if (!entries.length) {
        throw new Error(`[prerender-seo] ${route.path}: no FAQ entries parsed from ${route.source}`);
      }
      jsonLd = faqSchema(entries);
    }
    // BreadcrumbList. Labels are the page's own nav names, copied verbatim
    // from src/components/Footer.tsx - nothing invented. The homepage gets
    // none (a breadcrumb to itself is noise), and neither does the noindex
    // /summer-presale route.
    const breadcrumbLd = route.crumb && !route.noindex
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
            { "@type": "ListItem", position: 2, name: route.crumb, item: canonical },
          ],
        }
      : undefined;
    const serviceLd = route.noindex ? undefined : SERVICE_LD[route.path];

    // The homepage keeps index.html's hand-written <noscript>; every other
    // route gets its own, built from its own source.
    const body = route.path === "/" ? undefined : buildBody(route.path, pageSource, route.source);

    const html = transform(template, { title, description, canonical, noindex: route.noindex, jsonLd, serviceLd, breadcrumbLd, body });
    const outDir = path.join(DIST, route.path.replace(/^\//, ""));
    await fs.mkdir(outDir, { recursive: true });
    const outPath = path.join(outDir, "index.html");
    await fs.writeFile(outPath, html, "utf8");

    // Re-read the emitted artifact so a silent replacement/insertion failure
    // can never pass the deploy build.
    const emitted = await fs.readFile(outPath, "utf8");
    const emittedDescription = readMetaContent(emitted, "name", "description");
    if (!emittedDescription) {
      throw new Error(
        `[prerender-seo] ${route.path}: emitted description meta tag is missing or empty`,
      );
    }

    // --- Body guards, asserted against the FILE THAT SHIPS, not the inputs ---
    const crawlerBody = emitted.match(/<noscript>\s*<(?:header|main)[\s\S]*?<\/noscript>/i)?.[0] ?? "";
    const crawlerText = textOf(crawlerBody);
    const words = crawlerText ? crawlerText.split(/\s+/).length : 0;

    if (route.path === "/") {
      // Positive control. If the homepage stops matching, HOME_H1_RE has gone
      // stale and the duplicate check below is silently matching nothing.
      if (!HOME_H1_RE.test(emitted)) {
        throw new Error("[prerender-seo] /: the homepage <noscript> H1 no longer matches HOME_H1_RE, so the duplicate-body guard below would pass for every route without testing anything.");
      }
    } else {
      if (HOME_H1_RE.test(emitted)) {
        throw new Error(`[prerender-seo] ${route.path}: the homepage crawler body leaked - this route would read to a JS-free crawler as a copy of the homepage.`);
      }
      if (!emitted.includes(`<h1>${escapeHtml(body.h1)}</h1>`)) {
        throw new Error(`[prerender-seo] ${route.path}: crawler body does not carry its own H1 (${body.h1}).`);
      }
      if (words < minWordsFor(route.path)) {
        throw new Error(`[prerender-seo] ${route.path}: crawler body is only ${words} words (floor ${minWordsFor(route.path)}) - too thin to ship.`);
      }
      // Paragraphs only. A HEADING may legitimately name the page - the
      // /summer-presale H1 is "Summer Pre-Sale: Buy Now, Treat Later" - while a
      // paragraph is where an actual price or dated offer would be asserted.
      const crawlerParagraphs = [...crawlerBody.matchAll(/<p>([\s\S]*?)<\/p>/g)]
        .map((m) => textOf(m[1])).join(" ");
      if (OPERATIONAL_RE.test(crawlerParagraphs)) {
        throw new Error(`[prerender-seo] ${route.path}: crawler body carries a price, discount or dated offer ("${crawlerParagraphs.match(OPERATIONAL_RE)[0]}"). Operational facts are the client's; keep them out of the prerendered layer.`);
      }
      if (CHAIN_RE.test(crawlerText)) {
        throw new Error(`[prerender-seo] ${route.path}: crawler body carries a glued keyword chain ("${crawlerText.match(CHAIN_RE)[0]}"). Rewrite the heading on the page so it reads aloud.`);
      }
    }

    written.push({ path: route.path, title, description, h1: body?.h1, words });
  }

  // Every non-home route must have a DISTINCT H1. Two routes sharing one is the
  // same defect as sharing the homepage's, one step less obvious.
  const byH1 = new Map();
  for (const r of written) {
    if (!r.h1) continue;
    if (byH1.has(r.h1)) {
      throw new Error(`[prerender-seo] ${byH1.get(r.h1)} and ${r.path} ship the same crawler H1 ("${r.h1}").`);
    }
    byH1.set(r.h1, r.path);
  }

  console.log(`[prerender-seo] Wrote ${written.length} route(s):`);
  for (const r of written) {
    console.log(`  ✓ dist${r.path}/index.html  (crawler body ${r.words} words)`);
    console.log(`      title: ${r.title}`);
    console.log(`      h1:    ${r.h1 ?? "(homepage noscript, unchanged)"}`);
    console.log(`      desc (${r.description.length} chars): ${r.description}`);
  }
  if (skipped.length) {
    console.log(`[prerender-seo] Skipped:`);
    for (const s of skipped) console.log(`  - ${s}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(`[prerender-seo] Failed: ${err.stack || err.message}`);
  process.exit(1);
});
