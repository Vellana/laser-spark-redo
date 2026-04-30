
DROP POLICY IF EXISTS "Anyone can update subscriber by email" ON public.email_subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.email_subscribers;

-- Secure RPC: subscribe (creates new or reactivates if previously opted out)
CREATE OR REPLACE FUNCTION public.subscribe_email(
  p_email TEXT,
  p_first_name TEXT DEFAULT NULL,
  p_last_name TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_source TEXT DEFAULT 'website'
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email TEXT := LOWER(TRIM(p_email));
  v_existing public.email_subscribers%ROWTYPE;
BEGIN
  IF v_email IS NULL OR v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Invalid email';
  END IF;

  SELECT * INTO v_existing FROM public.email_subscribers WHERE LOWER(email) = v_email;

  IF FOUND THEN
    IF v_existing.opted_out THEN
      UPDATE public.email_subscribers
      SET subscribed = true,
          opted_out = false,
          opted_back_in_at = now(),
          opted_back_in_by = 'self_resubscribe',
          first_name = COALESCE(NULLIF(TRIM(p_first_name), ''), first_name),
          last_name  = COALESCE(NULLIF(TRIM(p_last_name), ''), last_name),
          phone      = COALESCE(NULLIF(TRIM(p_phone), ''), phone)
      WHERE id = v_existing.id;
      RETURN 'reactivated';
    END IF;
    RETURN 'already_subscribed';
  END IF;

  INSERT INTO public.email_subscribers (email, first_name, last_name, phone, source)
  VALUES (v_email,
          NULLIF(TRIM(p_first_name), ''),
          NULLIF(TRIM(p_last_name), ''),
          NULLIF(TRIM(p_phone), ''),
          COALESCE(NULLIF(TRIM(p_source), ''), 'website'));

  RETURN 'subscribed';
END;
$$;

REVOKE ALL ON FUNCTION public.subscribe_email(TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.subscribe_email(TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

-- Secure RPC: unsubscribe by email
CREATE OR REPLACE FUNCTION public.unsubscribe_email(p_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email TEXT := LOWER(TRIM(p_email));
  v_count INT;
BEGIN
  IF v_email IS NULL OR v_email = '' THEN
    RAISE EXCEPTION 'Invalid email';
  END IF;

  UPDATE public.email_subscribers
  SET opted_out = true,
      subscribed = false,
      opted_out_at = now()
  WHERE LOWER(email) = v_email
    AND opted_out = false;

  GET DIAGNOSTICS v_count = ROW_COUNT;

  IF v_count > 0 THEN
    RETURN 'unsubscribed';
  END IF;

  -- Also create a row if email isn't on file, to honor the opt-out
  INSERT INTO public.email_subscribers (email, subscribed, opted_out, opted_out_at, source)
  VALUES (v_email, false, true, now(), 'unsubscribe_form')
  ON CONFLICT (email) DO NOTHING;

  RETURN 'recorded';
END;
$$;

REVOKE ALL ON FUNCTION public.unsubscribe_email(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.unsubscribe_email(TEXT) TO anon, authenticated;
