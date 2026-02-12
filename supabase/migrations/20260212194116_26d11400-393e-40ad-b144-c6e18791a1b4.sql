
-- Add storage policies for email-assets bucket (admin-only uploads)
CREATE POLICY "Admins can upload email assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'email-assets'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update email assets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'email-assets'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete email assets"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'email-assets'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

-- Fix overly permissive email_leads update policy
-- Drop old permissive policy and replace with restricted one
DROP POLICY IF EXISTS "Service role can update confirmation_sent" ON public.email_leads;

CREATE POLICY "Service role can update confirmation_sent"
ON public.email_leads
FOR UPDATE
USING (false)
WITH CHECK (false);
