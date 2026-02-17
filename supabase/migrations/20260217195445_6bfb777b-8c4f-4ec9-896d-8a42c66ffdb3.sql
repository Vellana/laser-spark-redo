
-- Add reminder_sent column to track which appointments already got reminders
ALTER TABLE public.appointments
ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN NOT NULL DEFAULT false;

-- Index for efficient reminder queries
CREATE INDEX IF NOT EXISTS idx_appointments_reminder ON public.appointments(appointment_date, reminder_sent, status);
