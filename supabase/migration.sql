-- ============================================================
-- SASYA AI - Supabase SQL Migration (v3 - fully idempotent)
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- Safe to re-run multiple times.
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('FARMER', 'EXPERT', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- DROP EXISTING POLICIES (so re-runs don't fail)
-- ============================================================
DO $$ BEGIN
  DROP POLICY IF EXISTS "profiles_select_own"       ON public.profiles;
  DROP POLICY IF EXISTS "profiles_update_own"       ON public.profiles;
  DROP POLICY IF EXISTS "profiles_insert_own"       ON public.profiles;
  DROP POLICY IF EXISTS "farms_own"                 ON public.farms;
  DROP POLICY IF EXISTS "crops_own"                 ON public.crops;
  DROP POLICY IF EXISTS "disease_reports_own"       ON public.disease_reports;
  DROP POLICY IF EXISTS "predictions_own"           ON public.predictions;
  DROP POLICY IF EXISTS "weather_public_read"       ON public.weather;
  DROP POLICY IF EXISTS "market_prices_public_read" ON public.market_prices;
  DROP POLICY IF EXISTS "schemes_public_read"       ON public.government_schemes;
  DROP POLICY IF EXISTS "notifications_own"         ON public.notifications;
  DROP POLICY IF EXISTS "feedback_own"              ON public.feedback;
EXCEPTION WHEN undefined_table THEN null;
END $$;

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
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

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- FARMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.farms (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  location   TEXT,
  size_acres FLOAT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CROPS (user_id stored directly for simple RLS)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.crops (
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

-- ============================================================
-- DISEASE REPORTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.disease_reports (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  crop_name      TEXT NOT NULL,
  disease_name   TEXT,
  confidence     FLOAT,
  image          TEXT NOT NULL,
  recommendation TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PREDICTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.predictions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id     UUID NOT NULL UNIQUE REFERENCES public.disease_reports(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  model_version TEXT NOT NULL,
  confidence    FLOAT NOT NULL,
  raw_output    TEXT NOT NULL
);

-- ============================================================
-- WEATHER
-- ============================================================
CREATE TABLE IF NOT EXISTS public.weather (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location    TEXT NOT NULL UNIQUE,
  temperature FLOAT NOT NULL,
  humidity    FLOAT NOT NULL,
  rainfall    FLOAT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MARKET PRICES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.market_prices (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crop       TEXT NOT NULL,
  market     TEXT NOT NULL,
  state      TEXT NOT NULL,
  price      FLOAT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (crop, market, state)
);

-- ============================================================
-- GOVERNMENT SCHEMES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.government_schemes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  link        TEXT
);

-- v4 columns (idempotent on existing tables)
ALTER TABLE public.government_schemes ADD COLUMN IF NOT EXISTS category  TEXT;
ALTER TABLE public.government_schemes ADD COLUMN IF NOT EXISTS pros       TEXT;
ALTER TABLE public.government_schemes ADD COLUMN IF NOT EXISTS cons       TEXT;
ALTER TABLE public.government_schemes ADD COLUMN IF NOT EXISTS min_acres  FLOAT;

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- FEEDBACK
-- ============================================================
CREATE TABLE IF NOT EXISTS public.feedback (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating     INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CROP EXPENSES (crop-wise cost tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.crop_expenses (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crop_id     UUID NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category    TEXT NOT NULL CHECK (category IN ('Seeds','Fertilizer','Labour','Water','Pesticides','Machinery','Transport','Other')),
  amount      FLOAT NOT NULL CHECK (amount >= 0),
  expense_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  note        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CROP INCOME (revenue per crop — sales / harvest value)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.crop_income (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crop_id     UUID NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount      FLOAT NOT NULL CHECK (amount >= 0),
  income_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source      TEXT,
  note        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Drop expense/income policies in their own block AFTER the tables exist,
-- so a missing table never rolls back the other policy drops above.
DO $$ BEGIN
  DROP POLICY IF EXISTS "crop_expenses_own" ON public.crop_expenses;
  DROP POLICY IF EXISTS "crop_income_own"   ON public.crop_income;
EXCEPTION WHEN undefined_table THEN null;
END $$;

-- ============================================================
-- ENABLE ROW LEVEL SECURITY
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
-- ROW LEVEL SECURITY POLICIES
-- All policies use direct user_id = auth.uid() — no subqueries
-- ============================================================

-- Profiles
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Farms
CREATE POLICY "farms_own" ON public.farms
  FOR ALL USING (auth.uid() = user_id);

-- Crops (user_id on the row — simple and unambiguous)
CREATE POLICY "crops_own" ON public.crops
  FOR ALL USING (auth.uid() = user_id);

-- Disease Reports
CREATE POLICY "disease_reports_own" ON public.disease_reports
  FOR ALL USING (auth.uid() = user_id);

-- Predictions (user_id stored directly)
CREATE POLICY "predictions_own" ON public.predictions
  FOR ALL USING (auth.uid() = user_id);

-- Weather (public read)
CREATE POLICY "weather_public_read" ON public.weather
  FOR SELECT USING (true);

-- Market Prices (public read)
CREATE POLICY "market_prices_public_read" ON public.market_prices
  FOR SELECT USING (true);

-- Government Schemes (public read)
CREATE POLICY "schemes_public_read" ON public.government_schemes
  FOR SELECT USING (true);

-- Notifications
CREATE POLICY "notifications_own" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- Feedback
CREATE POLICY "feedback_own" ON public.feedback
  FOR ALL USING (auth.uid() = user_id);

-- Crop Expenses (user_id on the row — simple and unambiguous)
CREATE POLICY "crop_expenses_own" ON public.crop_expenses
  FOR ALL USING (auth.uid() = user_id);

-- Crop Income (user_id on the row — simple and unambiguous)
CREATE POLICY "crop_income_own" ON public.crop_income
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- SEED DATA
-- ============================================================
INSERT INTO public.market_prices (crop, market, state, price) VALUES
  ('Wheat',  'APMC Delhi',   'Delhi',       2200),
  ('Rice',   'APMC Mumbai',  'Maharashtra', 2600),
  ('Maize',  'APMC Pune',    'Maharashtra', 1800),
  ('Cotton', 'APMC Nagpur',  'Maharashtra', 6000),
  ('Onion',  'APMC Nashik',  'Maharashtra', 1500)
ON CONFLICT (crop, market, state) DO NOTHING;

-- Government schemes (delete-then-insert keeps re-runs idempotent)
DELETE FROM public.government_schemes
  WHERE title IN ('PM-KISAN','PM Fasal Bima Yojana','Kisan Credit Card',
                  'PM-KUSUM','Soil Health Card','PMKSY - Micro Irrigation',
                  'PM-KMY Pension');
INSERT INTO public.government_schemes
  (title, description, eligibility, category, pros, cons, min_acres, link) VALUES
  (
    'PM-KISAN',
    'Income support of ₹6,000 per year to all landholding farmer families.',
    'All landholding farmers'' families with cultivable land.',
    'Income Support',
    'Direct bank transfer · ₹6,000/yr helps small farmers · No loan or repayment',
    'Only landholding farmers · ~₹500/month is modest · Needs updated Aadhaar/bank linkage',
    0.1,
    'https://pmkisan.gov.in'
  ),
  (
    'PM Fasal Bima Yojana',
    'Crop insurance to provide financial support to farmers suffering crop loss/damage.',
    'All farmers growing notified crops in notified areas.',
    'Insurance',
    'Covers natural calamities & pests · Low premium (2% kharif, 1.5% rabi) · Paperless claims',
    'Only notified crops/areas · Claims can take time · Self-reported loss needs proof photos',
    0.1,
    'https://pmfby.gov.in'
  ),
  (
    'Kisan Credit Card',
    'Provides adequate and timely credit support to farmers for their agricultural operations.',
    'Farmers, sharecroppers, oral lessees, and self-help groups.',
    'Credit & Finance',
    'Low interest ~4% with prompt repayment · Covers inputs, equipment, consumption · Flexible withdrawals',
    'Must repay on time or interest rises · Requires KYC & land documents · Credit limit depends on records',
    0.1,
    'https://www.nabard.org/kisan-credit-card.aspx'
  ),
  (
    'PM-KUSUM',
    'Subsidised solar water pumps (up to 60-80%) plus income from surplus solar power.',
    'Farmers with irrigation-capable land, especially off-grid areas.',
    'Energy & Water',
    'Cuts electricity/diesel cost · 60-80% subsidy · Sell surplus power to grid',
    'High upfront contribution · Needs clear land/roof · Waitlists in some states',
    0.5,
    'https://pmkusum.mnre.gov.in'
  ),
  (
    'Soil Health Card',
    'Free soil testing with crop-wise fertiliser recommendations every 2 years.',
    'Any farmer can request a test from local soil testing lab.',
    'Soil & Inputs',
    'Free test · Tailored NPK plan reduces input cost · Improves yields',
    'Results take weeks · Sample must be correctly drawn · Recommendations need following up',
    0,
    'https://www.soilhealth.dac.gov.in'
  ),
  (
    'PMKSY - Micro Irrigation',
    'Subsidy (up to 55%) for drip and sprinkler irrigation systems to save water.',
    'Farmers with irrigation projects; small & marginal farmers get higher subsidy.',
    'Energy & Water',
    'Saves 30-60% water · 55% subsidy · Higher yields & crop diversification',
    'State budget dependent · Needs matching contribution · Drip install cost still notable',
    0.2,
    'https://pmksy.gov.in'
  ),
  (
    'PM-KMY Pension',
    'Pension of ₹3,000/month for eligible small & marginal farmers after age 60.',
    'Small & marginal farmers (up to 2 ha) aged 18-40.',
    'Income Support',
    '₹3,000/month pension · Small monthly contribution (₹55-200) · Lifelong after 60',
    'Only up to 2 ha · Must contribute monthly · Payout is modest',
    0.1,
    'https://maandhan.in'
  )
ON CONFLICT DO NOTHING;
