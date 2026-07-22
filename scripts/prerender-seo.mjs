#!/usr/bin/env node
/**
 * Build-time SEO prerendering.
 *
 * After `vite build`, for every PUBLIC route below, write
 * dist/<route>/index.html: a copy of dist/index.html with that route's
 * title, meta description, canonical, og:*, and twitter:* substituted
 * in. Values are copied verbatim from the per-page <SEO ... /> props in
 * src/pages/*.tsx so they match what each page sets client-side.
 *
 * Excluded: "/" (root index.html), /admin, /admin/email-list,
 * /unsubscribe (noindex), /services/coolpeel (redirect), and NotFound.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const BASE_URL = "https://virginialaserspecialists.com";

// Values below are copied verbatim from each page's <SEO title=... description=... canonicalUrl=... />.
const ROUTES = [
  {
    path: "/booking",
    title: "Book Online | Virginia Laser Specialists - Vienna, VA",
    description:
      "Book your laser hair removal or CoolPeel CO2 resurfacing appointment online with Virginia Laser Specialists in Vienna, VA. Free consultations available.",
  },
  {
    path: "/pricing",
    title:
      "CoolPeel Laser Cost | Laser Hair Removal Packages and Pricing - Virginia Laser Specialists",
    description:
      "CoolPeel laser cost and laser hair removal cost Northern Virginia at Virginia Laser Specialists, plus laser hair removal packages near me with 25% off 5-packs. 703-752-6608.",
  },
  {
    path: "/specials",
    title: "Laser Specials & Promotions | Tysons VA",
    description:
      "Limited-time laser specials on CoolPeel & laser hair removal in Tysons VA. Book your free consultation at Virginia Laser Specialists — 703-752-6608.",
  },
  {
    path: "/summer-presale",
    title: "Summer Pre-Sale: Buy Now, Treat Later | Virginia Laser Specialists",
    description:
      "Exclusive Summer Pre-Sale June 15-28, 2026. Buy CoolPeel and Laser Hair Removal packages now at special pricing. Treat later. Cherry financing available.",
  },
  {
    path: "/gallery",
    title: "Photo Gallery | Virginia Laser Specialists",
    description:
      "Tour our laser treatment facility at 8100 Boone Blvd, Vienna VA. Lutronic Clarity II & Cartessa Tetra Pro. Book your free consultation — 703-752-6608.",
  },
  {
    path: "/about",
    title: "Medical Spa Tysons and Vienna VA | About Virginia Laser Specialists",
    description:
      "Medical spa Tysons and medical spa Vienna VA for laser hair removal, CoolPeel CO2 resurfacing, and scar treatments. Licensed estheticians and certified laser techs. 703-752-6608.",
  },
  {
    path: "/contact",
    title: "Contact Virginia Laser Specialists | Tysons VA",
    description:
      "Visit us at 8100 Boone Blvd, Suite 270, Vienna VA. Tue–Fri 10–6, Sat 9–1. Book your free laser consultation — 703-752-6608.",
  },
  {
    path: "/laser-hair-removal",
    title:
      "Clarity II Laser Hair Removal Vienna VA and Tysons - Virginia Laser Specialists",
    description:
      "Clarity II laser hair removal Vienna and Tysons Corner patients trust. Lutronic Clarity II dual wavelength for all skin types. 25% off packages. Free consult: 703-547-4499.",
  },
  {
    path: "/laser-skin-resurfacing",
    title: "Fractional CO2 Laser Tysons | CO2 Laser Resurfacing Vienna VA",
    description:
      "Fractional CO2 laser Tysons and CO2 laser resurfacing Vienna VA with CoolPeel and DEKA Tetra Pro. From acne scar treatment to scar removal and stretch mark removal Vienna VA, choose laser skin resurfacing Northern Virginia. 703-752-6608.",
  },
  {
    path: "/coolpeel-co2-laser-tysons-va",
    title:
      "CoolPeel Vienna VA | CoolPeel CO2 Laser Tysons - Virginia Laser Specialists",
    description:
      "CoolPeel Vienna VA and CoolPeel skin resurfacing Tysons with the DEKA Tetra Pro Vienna CO2 platform. 1-3 day recovery, transparent pricing, and free consultations. 703-752-6608.",
  },
  {
    path: "/faq",
    title: "Laser Treatment FAQ | Tysons VA",
    description:
      "CoolPeel, Tetra Pro & laser hair removal FAQs for Tysons VA patients. Book your free consultation at Virginia Laser Specialists — 703-752-6608.",
  },
];

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

function transform(html, { title, description, canonical }) {
  let out = html;

  // <title>
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  // meta name="description"
  out = replaceAttr(out, "meta", "name", "description", "content", description);

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
  out = replaceAttr(out, "meta", "property", "og:description", "content", description);
  out = replaceAttr(out, "meta", "property", "og:url", "content", canonical);
  out = replaceAttr(out, "meta", "name", "twitter:title", "content", title);
  out = replaceAttr(out, "meta", "name", "twitter:description", "content", description);

  // If og:title / twitter:title tags didn't exist in the source, inject them.
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
    if (!route.title || !route.description) {
      skipped.push(`${route.path} (missing meta)`);
      continue;
    }
    const canonical = `${BASE_URL}${route.path}`;
    const html = transform(template, {
      title: route.title,
      description: route.description,
      canonical,
    });
    const outDir = path.join(DIST, route.path.replace(/^\//, ""));
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(path.join(outDir, "index.html"), html, "utf8");
    written.push(route.path);
  }

  console.log(`[prerender-seo] Wrote ${written.length} route(s):`);
  for (const r of written) console.log(`  ✓ dist${r}/index.html`);
  if (skipped.length) {
    console.log(`[prerender-seo] Skipped:`);
    for (const s of skipped) console.log(`  - ${s}`);
  }
}

main().catch((err) => {
  console.error(`[prerender-seo] Failed: ${err.stack || err.message}`);
  process.exit(1);
});
