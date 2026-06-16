
ALTER TABLE public.specials
  ADD COLUMN IF NOT EXISTS image_position TEXT NOT NULL DEFAULT 'above',
  ADD COLUMN IF NOT EXISTS primary_cta_label TEXT NOT NULL DEFAULT 'View Specials',
  ADD COLUMN IF NOT EXISTS primary_cta_url TEXT NOT NULL DEFAULT '/specials',
  ADD COLUMN IF NOT EXISTS secondary_cta_label TEXT NOT NULL DEFAULT 'Maybe Later',
  ADD COLUMN IF NOT EXISTS secondary_cta_url TEXT NOT NULL DEFAULT '';

ALTER TABLE public.specials
  ADD CONSTRAINT specials_image_position_check
  CHECK (image_position IN ('above','below','left','right'));
