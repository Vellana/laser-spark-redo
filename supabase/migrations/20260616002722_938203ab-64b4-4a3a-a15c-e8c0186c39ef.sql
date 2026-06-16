
ALTER TABLE public.specials
  ADD COLUMN IF NOT EXISTS button_order TEXT NOT NULL DEFAULT 'primary_first';

ALTER TABLE public.specials
  ADD CONSTRAINT specials_button_order_check
  CHECK (button_order IN ('primary_first','secondary_first'));
