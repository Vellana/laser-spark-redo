
-- Drop the broken UPDATE policy
DROP POLICY IF EXISTS "Service role can update confirmation_sent" ON public.email_leads;

-- Allow service_role (used by edge functions) to update email_leads
CREATE POLICY "Service role can update leads"
ON public.email_leads FOR UPDATE TO service_role
USING (true) WITH CHECK (true);

-- Allow admins to update email_leads (for discount_claimed toggling in admin panel)
CREATE POLICY "Admins can update leads"
ON public.email_leads FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
