
CREATE TABLE public.newsletter_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  image_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  recipient_emails JSONB,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.newsletter_drafts TO authenticated;
GRANT ALL ON public.newsletter_drafts TO service_role;

ALTER TABLE public.newsletter_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage drafts" ON public.newsletter_drafts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_newsletter_draft()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_touch_newsletter_draft
BEFORE UPDATE ON public.newsletter_drafts
FOR EACH ROW EXECUTE FUNCTION public.touch_newsletter_draft();

CREATE INDEX idx_newsletter_drafts_updated ON public.newsletter_drafts(updated_at DESC);
