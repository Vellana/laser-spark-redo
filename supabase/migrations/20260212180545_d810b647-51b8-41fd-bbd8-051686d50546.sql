
-- Create contact inquiries table
CREATE TABLE public.contact_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT,
  contact_method TEXT NOT NULL DEFAULT 'email',
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  admin_reply TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an inquiry
CREATE POLICY "Anyone can submit inquiry"
ON public.contact_inquiries
FOR INSERT
WITH CHECK (true);

-- Only admins can view inquiries
CREATE POLICY "Admins can view inquiries"
ON public.contact_inquiries
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update inquiries (for replies)
CREATE POLICY "Admins can update inquiries"
ON public.contact_inquiries
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete inquiries
CREATE POLICY "Admins can delete inquiries"
ON public.contact_inquiries
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));
