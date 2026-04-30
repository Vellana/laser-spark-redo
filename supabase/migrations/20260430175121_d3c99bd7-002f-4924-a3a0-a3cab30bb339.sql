
-- Subscribers table
CREATE TABLE public.email_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT true,
  opted_out BOOLEAN NOT NULL DEFAULT false,
  opted_out_at TIMESTAMP WITH TIME ZONE,
  opted_back_in_at TIMESTAMP WITH TIME ZONE,
  opted_back_in_by TEXT,
  source TEXT NOT NULL DEFAULT 'vagaro_import',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_email_subscribers_email ON public.email_subscribers(LOWER(email));
CREATE INDEX idx_email_subscribers_opted_out ON public.email_subscribers(opted_out);

ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

-- Public can subscribe (insert)
CREATE POLICY "Anyone can subscribe"
  ON public.email_subscribers FOR INSERT
  WITH CHECK (true);

-- Public can update their own row (needed for self-service unsubscribe by email)
CREATE POLICY "Anyone can update subscriber by email"
  ON public.email_subscribers FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Admins can view all
CREATE POLICY "Admins can view subscribers"
  ON public.email_subscribers FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete
CREATE POLICY "Admins can delete subscribers"
  ON public.email_subscribers FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Opt-in confirmation audit log
CREATE TABLE public.opt_in_confirmations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_name TEXT NOT NULL,
  subscriber_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.opt_in_confirmations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view confirmations"
  ON public.opt_in_confirmations FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert confirmations"
  ON public.opt_in_confirmations FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
