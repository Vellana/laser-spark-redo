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
 * Excluded: "/" (root index.html), /admin, /admin/email-list,
 * /unsubscribe (noindex), /services/coolpeel (redirect), and NotFound.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const PAGES = path.join(ROOT, "src", "pages");
const BASE_URL = "https://virginialaserspecialists.com";

// route -> source page whose <SEO ... /> props are the single source of truth.
const ROUTES = [
  { path: "/booking", source: "Booking.tsx" },
  { path: "/pricing", source: "Pricing.tsx" },
  { path: "/specials", source: "Specials.tsx" },
  { path: "/summer-presale", source: "SummerPresale.tsx", noindex: true },
  { path: "/gallery", source: "Gallery.tsx" },
  { path: "/about", source: "About.tsx" },
  { path: "/contact", source: "Contact.tsx" },
  { path: "/laser-hair-removal", source: "LaserHairRemoval.tsx" },
  { path: "/laser-skin-resurfacing", source: "LaserSkinResurfacing.tsx" },
  { path: "/coolpeel-co2-laser-tysons-va", source: "CoolPeelTysons.tsx" },
  { path: "/faq", source: "FAQ.tsx" },
];

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

const PRERENDER_VERSION = "v2";

function transform(html, { title, description, canonical, noindex }) {
  let out = html;

  // <title>
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  // Descriptions (name/property variants).
  out = replaceAttr(out, "meta", "name", "description", "content", description);
  out = replaceAttr(out, "meta", "property", "og:description", "content", description);
  out = replaceAttr(out, "meta", "name", "twitter:description", "content", description);

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
  ensureMeta("name", "description", description);
  ensureMeta("property", "og:description", description);
  ensureMeta("name", "twitter:description", description);
  ensureMeta("property", "og:title", title);
  ensureMeta("name", "twitter:title", title);

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
    const { title, description } = parseSeoProps(pageSource);
    if (!title || !description) {
      skipped.push(
        `${route.path} (missing ${!title ? "title" : ""}${!title && !description ? " and " : ""}${!description ? "description" : ""} in ${route.source} <SEO />)`,
      );
      continue;
    }
    const canonical = `${BASE_URL}${route.path}`;
    const html = transform(template, { title, description, canonical, noindex: route.noindex });
    const outDir = path.join(DIST, route.path.replace(/^\//, ""));
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(path.join(outDir, "index.html"), html, "utf8");
    written.push({ path: route.path, title, description });
  }

  console.log(`[prerender-seo] Wrote ${written.length} route(s):`);
  for (const r of written) {
    console.log(`  ✓ dist${r.path}/index.html`);
    console.log(`      title: ${r.title}`);
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
