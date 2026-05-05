CREATE TABLE public.inquiry_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id UUID NOT NULL REFERENCES public.contact_inquiries(id) ON DELETE CASCADE,
  reply_message TEXT NOT NULL,
  sent_by UUID,
  sent_by_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_inquiry_replies_inquiry_id ON public.inquiry_replies(inquiry_id, created_at DESC);

ALTER TABLE public.inquiry_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view inquiry replies"
ON public.inquiry_replies FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert inquiry replies"
ON public.inquiry_replies FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update inquiry replies"
ON public.inquiry_replies FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete inquiry replies"
ON public.inquiry_replies FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Backfill existing single replies into the new thread table
INSERT INTO public.inquiry_replies (inquiry_id, reply_message, created_at)
SELECT id, admin_reply, COALESCE(replied_at, now())
FROM public.contact_inquiries
WHERE admin_reply IS NOT NULL AND TRIM(admin_reply) <> '';