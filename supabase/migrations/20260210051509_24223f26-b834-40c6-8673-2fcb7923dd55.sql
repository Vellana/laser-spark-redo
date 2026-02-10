
-- Fix 1: Replace the overly permissive UPDATE policy on email_leads
-- Drop the existing permissive policy
DROP POLICY IF EXISTS "Allow updating confirmation_sent" ON public.email_leads;

-- Only allow service_role to update (edge functions use service role key)
-- This prevents any anonymous/authenticated user from updating leads
CREATE POLICY "Service role can update confirmation_sent"
ON public.email_leads
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- Fix 2: Add explicit write policies on user_roles for admins only
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
