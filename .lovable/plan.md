
# Plan: Move Before & After Section Below Hero

## Current State
The `<BeforeAfterPreview />` component is currently placed near the bottom of the LaserSkinResurfacing page (line 512), just before the CTA section.

## Change Required
Move the `<BeforeAfterPreview />` component from its current location (line 512) to immediately after the Hero section (after line 81).

## Technical Details

**File:** `src/pages/LaserSkinResurfacing.tsx`

1. **Remove** the `<BeforeAfterPreview />` component from line 512
2. **Insert** the `<BeforeAfterPreview />` component right after the Hero section closing tag (after line 81)

### New Page Structure Order:
1. Hero Section (lines 44-81)
2. **Before & After Preview** (moved here)
3. Technology Section (The Tetra Pro CO₂ Platform)
4. Treatment Comparison (Choose Your Treatment)
5. What We Treat (Skin Concerns We Address)
6. Care Guides (with tabs)
7. CTA Section

This change will give visitors immediate social proof by showing real results right after the initial hero section, before they dive into the technical details.
