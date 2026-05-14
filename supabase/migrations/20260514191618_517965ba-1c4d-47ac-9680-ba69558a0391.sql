CREATE TABLE public.office_closures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  closure_date DATE NOT NULL UNIQUE,
  reason TEXT NOT NULL DEFAULT '',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_office_closures_date ON public.office_closures(closure_date);

ALTER TABLE public.office_closures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view office closures"
ON public.office_closures
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can insert office closures"
ON public.office_closures
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update office closures"
ON public.office_closures
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete office closures"
ON public.office_closures
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));