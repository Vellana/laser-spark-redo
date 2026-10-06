CREATE TABLE public.service_prices (
  key text PRIMARY KEY,
  category text NOT NULL DEFAULT 'laser_hair',
  name text NOT NULL,
  single_price numeric,
  package_price numeric,
  display_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.service_prices TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.service_prices TO authenticated;
GRANT ALL ON public.service_prices TO service_role;
ALTER TABLE public.service_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view prices" ON public.service_prices FOR SELECT USING (true);
CREATE POLICY "Admins manage prices" ON public.service_prices FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.price_discounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL DEFAULT 'Sale',
  discount_type text NOT NULL DEFAULT 'percent',
  value numeric NOT NULL DEFAULT 0,
  applies_to text NOT NULL DEFAULT 'both',
  scope text NOT NULL DEFAULT 'all',
  category text,
  service_keys text[] NOT NULL DEFAULT '{}',
  promo_code text,
  note text,
  start_date date,
  end_date date,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.price_discounts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.price_discounts TO authenticated;
GRANT ALL ON public.price_discounts TO service_role;
ALTER TABLE public.price_discounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active discounts" ON public.price_discounts FOR SELECT USING (is_active = true);
CREATE POLICY "Admins view all discounts" ON public.price_discounts FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage discounts" ON public.price_discounts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_touch_service_prices BEFORE UPDATE ON public.service_prices FOR EACH ROW EXECUTE FUNCTION public.touch_newsletter_draft();
CREATE TRIGGER trg_touch_price_discounts BEFORE UPDATE ON public.price_discounts FOR EACH ROW EXECUTE FUNCTION public.touch_newsletter_draft();

INSERT INTO public.service_prices (key, category, name, single_price, package_price, display_order) VALUES
('abdomen','laser_hair','Abdomen',250,937.50,1),
('arms_half','laser_hair','Arms (Half)',300,1125,2),
('arms_full','laser_hair','Arms (Full)',400,1500,3),
('back_half','laser_hair','Back (Half)',250,937.50,4),
('back_full','laser_hair','Back (Full)',400,1500,5),
('bikini','laser_hair','Bikini Line',250,937.50,6),
('brazilian','laser_hair','Brazilian/Brozilian',300,1125,7),
('breasts','laser_hair','Breasts',100,375,8),
('chest','laser_hair','Chest',250,937.50,9),
('chin','laser_hair','Chin',100,375,10),
('face','laser_hair','Face (Full)',250,937.50,11),
('feet','laser_hair','Feet',100,375,12),
('hands','laser_hair','Hands',100,375,13),
('legs_half','laser_hair','Legs (Half)',350,1312.50,14),
('legs_full','laser_hair','Legs (Full)',500,1875,15),
('neck','laser_hair','Neck (Front or Back)',100,375,16),
('shoulders','laser_hair','Shoulders',100,375,17),
('sideburns','laser_hair','Sideburns',100,375,18),
('underarms','laser_hair','Underarms',150,562.50,19),
('upper_lip','laser_hair','Upper Lip',100,375,20),
('full_body','laser_hair','Full Body',1850,6937.50,21),
('coolpeel','coolpeel','CoolPeel',750,2000,30);