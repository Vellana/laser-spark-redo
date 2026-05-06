CREATE TABLE public.resend_email_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resend_email_id TEXT,
  recipient TEXT,
  subject TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_resend_events_recipient ON public.resend_email_events (recipient);
CREATE INDEX idx_resend_events_email_id ON public.resend_email_events (resend_email_id);
CREATE INDEX idx_resend_events_created_at ON public.resend_email_events (created_at DESC);

ALTER TABLE public.resend_email_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view email events"
  ON public.resend_email_events FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete email events"
  ON public.resend_email_events FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));