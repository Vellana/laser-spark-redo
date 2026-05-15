
-- 1. site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert site settings"
  ON public.site_settings FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete site settings"
  ON public.site_settings FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed default
INSERT INTO public.site_settings (key, value)
VALUES ('min_booking_advance_hours', '48'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 2. is_admin_override flag on appointments
ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS is_admin_override BOOLEAN NOT NULL DEFAULT false;

-- 3. Update validation trigger to enforce min advance
CREATE OR REPLACE FUNCTION public.validate_appointment_insert()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_dow INT;
  v_start TIME;
  v_end TIME;
  v_minutes INT;
  v_today DATE;
  v_collision INT;
  v_closed INT;
  v_min_hours INT;
  v_slot_ts TIMESTAMPTZ;
BEGIN
  -- 1. Office closures
  SELECT COUNT(*) INTO v_closed
  FROM public.office_closures
  WHERE closure_date = NEW.appointment_date;
  IF v_closed > 0 THEN
    RAISE EXCEPTION 'Office is closed on %', NEW.appointment_date
      USING ERRCODE = 'check_violation';
  END IF;

  -- 2. Past dates (ET wall date)
  v_today := (now() AT TIME ZONE 'America/New_York')::date;
  IF NEW.appointment_date < v_today THEN
    RAISE EXCEPTION 'Cannot book a past date (%)', NEW.appointment_date
      USING ERRCODE = 'check_violation';
  END IF;

  -- 3. Business hours by DOW
  v_dow := EXTRACT(DOW FROM NEW.appointment_date)::INT;
  IF v_dow = 0 OR v_dow = 1 THEN
    RAISE EXCEPTION 'Office is closed on that day of the week'
      USING ERRCODE = 'check_violation';
  ELSIF v_dow = 6 THEN
    v_start := TIME '09:00';
    v_end   := TIME '12:30';
  ELSE
    v_start := TIME '10:00';
    v_end   := TIME '17:30';
  END IF;

  IF NEW.appointment_time < v_start OR NEW.appointment_time >= v_end THEN
    RAISE EXCEPTION 'Time % is outside business hours', NEW.appointment_time
      USING ERRCODE = 'check_violation';
  END IF;

  -- 4. 30-min boundary
  v_minutes := EXTRACT(HOUR FROM NEW.appointment_time)::INT * 60
             + EXTRACT(MINUTE FROM NEW.appointment_time)::INT;
  IF (v_minutes % 30) <> 0 OR EXTRACT(SECOND FROM NEW.appointment_time)::INT <> 0 THEN
    RAISE EXCEPTION 'Time % is not a valid 30-minute slot', NEW.appointment_time
      USING ERRCODE = 'check_violation';
  END IF;

  -- 5. Minimum booking advance (skipped when admin override is set)
  IF COALESCE(NEW.is_admin_override, false) = false THEN
    SELECT COALESCE((value)::int, 48) INTO v_min_hours
    FROM public.site_settings
    WHERE key = 'min_booking_advance_hours';
    IF v_min_hours IS NULL THEN v_min_hours := 48; END IF;

    v_slot_ts := ((NEW.appointment_date::text || ' ' || NEW.appointment_time::text)::timestamp
                  AT TIME ZONE 'America/New_York');
    IF v_slot_ts < (now() + make_interval(hours => v_min_hours)) THEN
      RAISE EXCEPTION 'Booking must be at least % hours in advance', v_min_hours
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;

  -- 6. Collision
  SELECT COUNT(*) INTO v_collision
  FROM public.appointments
  WHERE appointment_date = NEW.appointment_date
    AND appointment_time = NEW.appointment_time
    AND status = 'confirmed';
  IF v_collision > 0 THEN
    RAISE EXCEPTION 'That slot is already booked'
      USING ERRCODE = 'unique_violation';
  END IF;

  RETURN NEW;
END;
$function$;
