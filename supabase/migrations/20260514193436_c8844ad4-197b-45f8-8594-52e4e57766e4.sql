-- Server-side re-validation trigger for appointment inserts.
-- Defense-in-depth: the public INSERT policy stays WITH CHECK (true) so the
-- existing booking flow is unchanged, but this trigger rejects any insert
-- that would have been blocked by the frontend availability grid.

CREATE OR REPLACE FUNCTION public.validate_appointment_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_dow INT;
  v_start TIME;
  v_end TIME;
  v_minutes INT;
  v_today DATE;
  v_collision INT;
  v_closed INT;
BEGIN
  -- 1. Reject if the date is on a recorded office closure
  SELECT COUNT(*) INTO v_closed
  FROM public.office_closures
  WHERE closure_date = NEW.appointment_date;
  IF v_closed > 0 THEN
    RAISE EXCEPTION 'Office is closed on %', NEW.appointment_date
      USING ERRCODE = 'check_violation';
  END IF;

  -- 2. Reject past dates (America/New_York wall date)
  v_today := (now() AT TIME ZONE 'America/New_York')::date;
  IF NEW.appointment_date < v_today THEN
    RAISE EXCEPTION 'Cannot book a past date (%)', NEW.appointment_date
      USING ERRCODE = 'check_violation';
  END IF;

  -- 3. Business hours by day-of-week (0=Sun..6=Sat), ET
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

  -- 4. Must be on a 30-minute slot boundary
  v_minutes := EXTRACT(HOUR FROM NEW.appointment_time)::INT * 60
             + EXTRACT(MINUTE FROM NEW.appointment_time)::INT;
  IF (v_minutes % 30) <> 0 OR EXTRACT(SECOND FROM NEW.appointment_time)::INT <> 0 THEN
    RAISE EXCEPTION 'Time % is not a valid 30-minute slot', NEW.appointment_time
      USING ERRCODE = 'check_violation';
  END IF;

  -- 5. Reject collision with an existing confirmed appointment
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
$$;

DROP TRIGGER IF EXISTS validate_appointment_insert_trigger ON public.appointments;
CREATE TRIGGER validate_appointment_insert_trigger
  BEFORE INSERT ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_appointment_insert();