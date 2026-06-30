
CREATE TABLE public.scheduled_newsletters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  image_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  recipient_emails JSONB,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INT NOT NULL DEFAULT 0,
  last_error TEXT,
  sent_at TIMESTAMPTZ,
  sent_count INT,
  failed_count INT,
  total_count INT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_scheduled_newsletters_pending ON public.scheduled_newsletters (scheduled_for) WHERE status = 'pending';

GRANT SELECT, INSERT, UPDATE, DELETE ON public.scheduled_newsletters TO authenticated;
GRANT ALL ON public.scheduled_newsletters TO service_role;

ALTER TABLE public.scheduled_newsletters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view scheduled newsletters"
ON public.scheduled_newsletters FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert scheduled newsletters"
ON public.scheduled_newsletters FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update scheduled newsletters"
ON public.scheduled_newsletters FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete scheduled newsletters"
ON public.scheduled_newsletters FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
