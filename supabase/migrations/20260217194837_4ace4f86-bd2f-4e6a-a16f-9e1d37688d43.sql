
-- Create appointments table for direct website bookings
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  treatment_interest TEXT NOT NULL,
  notes TEXT DEFAULT '',
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  UNIQUE(appointment_date, appointment_time, status)
);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Anyone can create an appointment (public form)
CREATE POLICY "Anyone can book appointment"
ON public.appointments
FOR INSERT
WITH CHECK (true);

-- Admins can view all appointments
CREATE POLICY "Admins can view appointments"
ON public.appointments
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update appointments (cancel, etc.)
CREATE POLICY "Admins can update appointments"
ON public.appointments
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete appointments
CREATE POLICY "Admins can delete appointments"
ON public.appointments
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role can read appointments for availability checking
-- (handled by service role key bypassing RLS)

-- Add UTM tracking columns to email_leads
ALTER TABLE public.email_leads
ADD COLUMN IF NOT EXISTS utm_source TEXT,
ADD COLUMN IF NOT EXISTS utm_medium TEXT,
ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
ADD COLUMN IF NOT EXISTS utm_content TEXT,
ADD COLUMN IF NOT EXISTS utm_term TEXT;

-- Create index on appointment date for fast availability queries
CREATE INDEX idx_appointments_date_status ON public.appointments(appointment_date, status);
