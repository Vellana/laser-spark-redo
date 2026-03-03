

## Plan: GTM Tracking Events + SEO/Technical Polish

### 1. GTM Tracking: `free_consult_booking` Event

The `pushEvent` utility already sends `page_url` and UTMs automatically. We need to fire `free_consult_booking` on every "Book Free Consultation" button click across the site.

**Files to update:**
- **`src/components/Hero.tsx`** — Add `onClick={() => pushEvent("free_consult_booking")}` to the Book Free Consultation `<Link>`
- **`src/components/Navigation.tsx`** — Add the event to both desktop (line 95) and mobile (line 146) Book Free Consultation buttons
- **`src/components/Services.tsx`** — Add the event to the Book Free Consultation button
- **`src/pages/Pricing.tsx`** — Add the event to the consultation button
- **`src/pages/LaserHairRemoval.tsx`** — Add the event to both consultation buttons
- **`src/pages/LaserSkinResurfacing.tsx`** — Add the event to both consultation buttons
- **`src/pages/About.tsx`** — Add the event to the consultation button
- **`src/pages/Contact.tsx`** — Add the event to the consultation button (if present)

Each will import `pushEvent` from `@/lib/analytics` and call `pushEvent("free_consult_booking")` on click.

### 2. GTM Tracking: `email_signup` Event

Currently the event is named `email_signup_submitted`. The user wants an `email_signup` event that captures email, page URL, and UTMs.

**Files to update:**
- **`src/components/SpecialsPopup.tsx`** — Change `pushEvent("email_signup_submitted", { source: "specials_popup" })` to `pushEvent("email_signup", { email: result.data, source: "specials_popup" })`
- **`src/pages/Contact.tsx`** — Change `pushEvent("email_signup_submitted", { source: "contact_form" })` to `pushEvent("email_signup", { email: formData.email, source: "contact_form" })`

(Page URL and UTMs are already included by `pushEvent` automatically.)

### 3. Image Alt Text Audit

Most images already have descriptive alt text. A few need improvement:
- **`src/components/About.tsx`** — Change `"Modern laser treatment facility"` to `"Virginia Laser Specialists modern treatment facility in Tysons VA"`
- **`src/components/CherryFinancing.tsx`** — Change `"Cherry Financing"` to `"Cherry Financing logo — flexible payment plans for laser treatments"`
- **`src/components/Team.tsx`** — Team member alts use `member.name` only; append role context like `${member.name} — ${member.role} at Virginia Laser Specialists`

### 4. Heading Structure

Verify and fix heading hierarchy (h1 → h2 → h3) on key pages. The homepage and service pages already have proper H1s. Will check for any skipped levels.

### 5. Robots.txt Update

Add explicit `Disallow` for the admin route and any non-essential paths:

```
Disallow: /admin
```

The current robots.txt is correct for the domain (virginialaserspecialists.com) and sitemap reference. Just needs the admin exclusion.

### 6. Meta Title/Description Keyword Audit

The user references "Virginia Laser Services" but the actual business name used throughout is **"Virginia Laser Specialists"**. I'll confirm all meta titles and descriptions include the target keywords (CoolPeel, Laser Hair Removal, Tysons VA) and the business name.

**Pages to verify/update:**
- `index.html` — Already includes all keywords ✓
- `src/pages/Index.tsx` — Already includes all keywords ✓
- `src/pages/LaserHairRemoval.tsx` — Verify business name in title
- `src/pages/LaserSkinResurfacing.tsx` — Verify CoolPeel in title
- `src/pages/CoolPeelTysons.tsx` — Verify keywords
- `src/pages/BookConsultation.tsx` — Already good ✓
- `src/pages/About.tsx` — Verify keywords present
- `src/pages/Gallery.tsx` — Verify keywords present
- `src/pages/Pricing.tsx` — Verify keywords present
- `src/pages/Specials.tsx` — Verify keywords present

Will ensure each page's SEO component title follows the pattern: `[Page Topic] | Virginia Laser Specialists | Tysons VA` and descriptions mention CoolPeel or Laser Hair Removal where relevant.

### Summary of Changes

| Area | Files Changed |
|------|--------------|
| `free_consult_booking` event | ~8 component/page files |
| `email_signup` event rename | 2 files |
| Alt text improvements | 3 files |
| robots.txt admin disallow | 1 file |
| Meta keyword consistency | ~4-6 page files |

No database or edge function changes required. No new dependencies needed.

