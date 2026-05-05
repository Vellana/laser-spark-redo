
-- Restrict admin policies on appointments to authenticated role
DROP POLICY IF EXISTS "Admins can view appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can update appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can delete appointments" ON public.appointments;

CREATE POLICY "Admins can view appointments" ON public.appointments
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update appointments" ON public.appointments
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete appointments" ON public.appointments
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Restrict admin policies on contact_inquiries to authenticated role
DROP POLICY IF EXISTS "Admins can view inquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Admins can update inquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Admins can delete inquiries" ON public.contact_inquiries;

CREATE POLICY "Admins can view inquiries" ON public.contact_inquiries
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update inquiries" ON public.contact_inquiries
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete inquiries" ON public.contact_inquiries
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Remove broad SELECT (listing) policy on email-assets bucket; public URLs still work without it
DROP POLICY IF EXISTS "Email assets are publicly accessible" ON storage.objects;
