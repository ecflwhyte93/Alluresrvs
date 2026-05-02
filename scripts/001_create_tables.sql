-- Profiles table for user accounts
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  display_name TEXT,
  bio TEXT,
  age INTEGER,
  location TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  subscription_tier TEXT DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;

CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = user_id);

-- Listings table for user posts
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  location TEXT,
  category TEXT,
  age INTEGER,
  is_featured BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "listings_select_active" ON public.listings;
DROP POLICY IF EXISTS "listings_insert_any" ON public.listings;
DROP POLICY IF EXISTS "listings_update_own" ON public.listings;
DROP POLICY IF EXISTS "listings_delete_own" ON public.listings;

CREATE POLICY "listings_select_active" ON public.listings FOR SELECT USING (is_active = true);
CREATE POLICY "listings_insert_any" ON public.listings FOR INSERT WITH CHECK (true);
CREATE POLICY "listings_update_own" ON public.listings FOR UPDATE USING (true);
CREATE POLICY "listings_delete_own" ON public.listings FOR DELETE USING (true);

-- Subscriptions table for payment tracking
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_type TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subscriptions_select_own" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_insert_any" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_update_any" ON public.subscriptions;

CREATE POLICY "subscriptions_select_own" ON public.subscriptions FOR SELECT USING (true);
CREATE POLICY "subscriptions_insert_any" ON public.subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "subscriptions_update_any" ON public.subscriptions FOR UPDATE USING (true);

-- Favorites table for saved listings
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "favorites_select_own" ON public.favorites;
DROP POLICY IF EXISTS "favorites_insert_any" ON public.favorites;
DROP POLICY IF EXISTS "favorites_delete_any" ON public.favorites;

CREATE POLICY "favorites_select_own" ON public.favorites FOR SELECT USING (true);
CREATE POLICY "favorites_insert_any" ON public.favorites FOR INSERT WITH CHECK (true);
CREATE POLICY "favorites_delete_any" ON public.favorites FOR DELETE USING (true);
