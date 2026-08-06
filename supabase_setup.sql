-- ============================================================
-- SASYA AI - Clean Supabase Setup SQL
-- ============================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if they exist to start fresh
-- (Cascades will remove policies and constraints automatically)
DROP TABLE IF EXISTS public.crop_expenses CASCADE;
DROP TABLE IF EXISTS public.crop_income CASCADE;
DROP TABLE IF EXISTS public.feedback CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.government_schemes CASCADE;
DROP TABLE IF EXISTS public.market_prices CASCADE;
DROP TABLE IF EXISTS public.weather CASCADE;
DROP TABLE IF EXISTS public.predictions CASCADE;
DROP TABLE IF EXISTS public.disease_reports CASCADE;
DROP TABLE IF EXISTS public.crops CASCADE;
DROP TABLE IF EXISTS public.farms CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 3. Enum
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('FARMER', 'EXPERT', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN null;
END $$;


-- ============================================================
-- 4. CREATE TABLES
-- ============================================================

CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  name          TEXT,
  phone         TEXT,
  role          user_role NOT NULL DEFAULT 'FARMER',
  language      TEXT NOT NULL DEFAULT 'en',
  location      TEXT,
  profile_image TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.farms (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  location   TEXT,
  size_acres FLOAT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.crops (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  farm_id    UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  variety    TEXT,
  planted_at TIMESTAMPTZ,
  health     TEXT,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.disease_reports (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  crop_name      TEXT NOT NULL,
  disease_name   TEXT,
  confidence     FLOAT,
  image          TEXT NOT NULL,
  recommendation TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.predictions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id     UUID NOT NULL UNIQUE REFERENCES public.disease_reports(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  model_version TEXT NOT NULL,
  confidence    FLOAT NOT NULL,
  raw_output    TEXT NOT NULL
);

CREATE TABLE public.weather (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location    TEXT NOT NULL UNIQUE,
  temperature FLOAT NOT NULL,
  humidity    FLOAT NOT NULL,
  rainfall    FLOAT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.market_prices (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crop       TEXT NOT NULL,
  market     TEXT NOT NULL,
  state      TEXT NOT NULL,
  price      FLOAT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (crop, market, state)
);

CREATE TABLE public.government_schemes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  link        TEXT,
  category    TEXT,
  pros        TEXT,
  cons        TEXT,
  min_acres   FLOAT
);

CREATE TABLE public.notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.feedback (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating     INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.crop_expenses (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crop_id     UUID REFERENCES public.crops(id) ON DELETE CASCADE, -- Made optional for global expenses
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category    TEXT NOT NULL CHECK (category IN ('Seeds','Fertilizer','Labour','Water','Pesticides','Machinery','Transport','Other')),
  amount      FLOAT NOT NULL CHECK (amount >= 0),
  expense_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  note        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.crop_income (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crop_id     UUID REFERENCES public.crops(id) ON DELETE CASCADE, -- Made optional for global income
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount      FLOAT NOT NULL CHECK (amount >= 0),
  income_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source      TEXT,
  note        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_reports    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_expenses      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_income        ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 6. RLS POLICIES 
-- ============================================================

-- Profiles
CREATE POLICY "Enable insert for users based on user_id" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Enable select for users based on user_id" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Enable update for users based on user_id" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Farms
CREATE POLICY "Enable insert for users based on user_id" ON public.farms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable select for users based on user_id" ON public.farms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable update for users based on user_id" ON public.farms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users based on user_id" ON public.farms FOR DELETE USING (auth.uid() = user_id);

-- Crops
CREATE POLICY "Enable insert for users based on user_id" ON public.crops FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable select for users based on user_id" ON public.crops FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable update for users based on user_id" ON public.crops FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users based on user_id" ON public.crops FOR DELETE USING (auth.uid() = user_id);

-- Disease Reports
CREATE POLICY "Enable insert for users based on user_id" ON public.disease_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable select for users based on user_id" ON public.disease_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable update for users based on user_id" ON public.disease_reports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users based on user_id" ON public.disease_reports FOR DELETE USING (auth.uid() = user_id);

-- Predictions
CREATE POLICY "Enable insert for users based on user_id" ON public.predictions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable select for users based on user_id" ON public.predictions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable update for users based on user_id" ON public.predictions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users based on user_id" ON public.predictions FOR DELETE USING (auth.uid() = user_id);

-- Weather (public read)
CREATE POLICY "Enable select for all users" ON public.weather FOR SELECT USING (true);

-- Market Prices (public read)
CREATE POLICY "Enable select for all users" ON public.market_prices FOR SELECT USING (true);

-- Government Schemes (public read)
CREATE POLICY "Enable select for all users" ON public.government_schemes FOR SELECT USING (true);

-- Notifications
CREATE POLICY "Enable insert for users based on user_id" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable select for users based on user_id" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable update for users based on user_id" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users based on user_id" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- Feedback
CREATE POLICY "Enable insert for users based on user_id" ON public.feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable select for users based on user_id" ON public.feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable update for users based on user_id" ON public.feedback FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users based on user_id" ON public.feedback FOR DELETE USING (auth.uid() = user_id);

-- Crop Expenses
CREATE POLICY "Enable insert for users based on user_id" ON public.crop_expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable select for users based on user_id" ON public.crop_expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable update for users based on user_id" ON public.crop_expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users based on user_id" ON public.crop_expenses FOR DELETE USING (auth.uid() = user_id);

-- Crop Income
CREATE POLICY "Enable insert for users based on user_id" ON public.crop_income FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable select for users based on user_id" ON public.crop_income FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable update for users based on user_id" ON public.crop_income FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users based on user_id" ON public.crop_income FOR DELETE USING (auth.uid() = user_id);


-- ============================================================
-- 7. TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 8. SEED DATA
-- ============================================================

-- Backfill profiles for existing users (in case the table was dropped)
INSERT INTO public.profiles (id, email, name)
SELECT id, email, raw_user_meta_data->>'name'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.market_prices (crop, market, state, price) VALUES
  ('Wheat',  'APMC Delhi',   'Delhi',       2200),
  ('Rice',   'APMC Mumbai',  'Maharashtra', 2600),
  ('Maize',  'APMC Pune',    'Maharashtra', 1800),
  ('Cotton', 'APMC Nagpur',  'Maharashtra', 6000),
  ('Onion',  'APMC Nashik',  'Maharashtra', 1500)
ON CONFLICT (crop, market, state) DO NOTHING;

INSERT INTO public.government_schemes (title, description, eligibility, category, pros, cons, min_acres, link) VALUES
  ('PM-KISAN', 'Income support of ₹6,000 per year to all landholding farmer families.', 'All landholding farmers'' families with cultivable land.', 'Income Support', 'Direct bank transfer · ₹6,000/yr helps small farmers', 'Only landholding farmers', 0.1, 'https://pmkisan.gov.in'),
  ('PM Fasal Bima Yojana', 'Crop insurance to provide financial support.', 'Farmers growing notified crops.', 'Insurance', 'Covers natural calamities', 'Claims can take time', 0.1, 'https://pmfby.gov.in'),
  ('Kisan Credit Card', 'Provides credit support to farmers.', 'Farmers, sharecroppers.', 'Credit & Finance', 'Low interest', 'Requires KYC', 0.1, 'https://www.nabard.org/kisan-credit-card.aspx'),
  ('Soil Health Card', 'Free soil testing with crop-wise fertiliser recommendations.', 'Any farmer.', 'Soil & Inputs', 'Free test', 'Results take weeks', 0, 'https://www.soilhealth.dac.gov.in')
ON CONFLICT DO NOTHING;
