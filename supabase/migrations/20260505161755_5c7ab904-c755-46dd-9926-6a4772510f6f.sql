CREATE TABLE public.newsletter_send_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  recipient_count INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  errors TEXT[] DEFAULT '{}',
  sent_by UUID,
  sent_by_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter_send_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view newsletter send log"
ON public.newsletter_send_log
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete newsletter send log"
ON public.newsletter_send_log
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_newsletter_send_log_created_at ON public.newsletter_send_log (created_at DESC);