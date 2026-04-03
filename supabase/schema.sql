-- =============================================
-- Aqar SaaS - Database Schema for Supabase
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. Agencies Table
-- =============================================
CREATE TABLE IF NOT EXISTS agencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  city TEXT DEFAULT '',
  address TEXT DEFAULT '',
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. Properties Table
-- =============================================
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  type TEXT NOT NULL CHECK (type IN ('sale', 'rent')),
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'house', 'villa', 'land', 'commercial', 'other')),
  price NUMERIC NOT NULL DEFAULT 0,
  city TEXT NOT NULL DEFAULT '',
  address TEXT DEFAULT '',
  area NUMERIC DEFAULT 0,
  rooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'rented', 'draft')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. Subscriptions Table
-- =============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 4. Indexes
-- =============================================
CREATE INDEX IF NOT EXISTS idx_properties_agency_id ON properties(agency_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_agencies_owner_id ON agencies(owner_id);
CREATE INDEX IF NOT EXISTS idx_agencies_slug ON agencies(slug);
CREATE INDEX IF NOT EXISTS idx_subscriptions_agency_id ON subscriptions(agency_id);

-- =============================================
-- 5. Row Level Security (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Agencies: public can view basic agency info (name, phone, email) for property contact
CREATE POLICY "Anyone can view agency public info"
  ON agencies FOR SELECT
  USING (true);

-- Agencies: owners can manage their own agency
CREATE POLICY "Users can view own agency"
  ON agencies FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Users can create agency"
  ON agencies FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update own agency"
  ON agencies FOR UPDATE
  USING (owner_id = auth.uid());

-- Properties: agency owners can manage their properties, public can view active ones
CREATE POLICY "Anyone can view active properties"
  ON properties FOR SELECT
  USING (status = 'active');

CREATE POLICY "Agency owners can view all own properties"
  ON properties FOR SELECT
  USING (
    agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid())
  );

CREATE POLICY "Agency owners can insert properties"
  ON properties FOR INSERT
  WITH CHECK (
    agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid())
  );

CREATE POLICY "Agency owners can update own properties"
  ON properties FOR UPDATE
  USING (
    agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid())
  );

CREATE POLICY "Agency owners can delete own properties"
  ON properties FOR DELETE
  USING (
    agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid())
  );

-- Subscriptions: agency owners can view their own
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (
    agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid())
  );

-- =============================================
-- 6. Auto-create agency on user signup (trigger)
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_agency_id UUID;
  agency_slug TEXT;
BEGIN
  agency_slug := LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'agency_name', 'agency-' || NEW.id::TEXT), ' ', '-'));
  
  INSERT INTO public.agencies (owner_id, name, slug, phone, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'agency_name', 'وكالتي'),
    agency_slug,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.email, '')
  )
  RETURNING id INTO new_agency_id;

  -- Create free subscription
  INSERT INTO public.subscriptions (agency_id, plan, status)
  VALUES (new_agency_id, 'free', 'active');

  -- Update user metadata with agency_id
  UPDATE auth.users
  SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('agency_id', new_agency_id::TEXT)
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: auto-create agency when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 7. Storage bucket for property images
-- =============================================
-- IMPORTANT: Run these commands in the Supabase SQL Editor to enable image uploads.
-- They cannot be run in the initial schema migration because storage tables
-- may not be available yet.

INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view property images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'property-images' AND auth.uid()::TEXT = (storage.foldername(name))[1]);
