
CREATE TABLE public.specials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  highlight_text text DEFAULT '',
  disclaimer text DEFAULT '',
  image_urls text[] DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.specials ENABLE ROW LEVEL SECURITY;

-- Anyone can view active specials
CREATE POLICY "Anyone can view active specials"
  ON public.specials FOR SELECT
  TO public
  USING (is_active = true);

-- Admins can view all specials
CREATE POLICY "Admins can view all specials"
  ON public.specials FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can create specials
CREATE POLICY "Admins can create specials"
  ON public.specials FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update specials
CREATE POLICY "Admins can update specials"
  ON public.specials FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can delete specials
CREATE POLICY "Admins can delete specials"
  ON public.specials FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
