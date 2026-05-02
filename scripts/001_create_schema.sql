-- Profiles table for user accounts
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Anyone can view profiles
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Listings table for user posts
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  location TEXT,
  category TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Anyone can view active listings
CREATE POLICY "listings_select_active" ON public.listings FOR SELECT USING (is_active = true);
CREATE POLICY "listings_insert_own" ON public.listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "listings_update_own" ON public.listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "listings_delete_own" ON public.listings FOR DELETE USING (auth.uid() = user_id);

-- Subscriptions table for payment tracking
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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

CREATE POLICY "subscriptions_select_own" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "subscriptions_insert_own" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "subscriptions_update_own" ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Favorites table for saved listings
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "favorites_select_own" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert_own" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete_own" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Seed some sample listings for demo
INSERT INTO public.profiles (id, display_name, bio, age, location, avatar_url, is_verified, subscription_tier)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Sophia', 'Love traveling and meeting new people', 25, 'New York, NY', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', true, 'monthly'),
  ('00000000-0000-0000-0000-000000000002', 'Emma', 'Coffee enthusiast and book lover', 23, 'Los Angeles, CA', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop', true, 'weekly'),
  ('00000000-0000-0000-0000-000000000003', 'Olivia', 'Fitness instructor and wellness advocate', 27, 'Miami, FL', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop', false, 'free'),
  ('00000000-0000-0000-0000-000000000004', 'Ava', 'Digital nomad exploring the world', 24, 'Austin, TX', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop', true, 'monthly'),
  ('00000000-0000-0000-0000-000000000005', 'Isabella', 'Artist and creative soul', 26, 'Chicago, IL', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop', false, 'single'),
  ('00000000-0000-0000-0000-000000000006', 'Mia', 'Music lover and concert goer', 22, 'Seattle, WA', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop', true, 'weekly')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.listings (id, user_id, title, description, images, location, is_featured, is_active, views)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Sophia', 'Looking to connect with interesting people in the city. Love good conversations over coffee.', ARRAY['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'], 'New York, NY', true, true, 342),
  ('11111111-1111-1111-1111-111111111112', '00000000-0000-0000-0000-000000000002', 'Emma', 'Bookworm seeking fellow readers and coffee lovers. Lets chat about our favorite novels!', ARRAY['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop'], 'Los Angeles, CA', false, true, 189),
  ('11111111-1111-1111-1111-111111111113', '00000000-0000-0000-0000-000000000003', 'Olivia', 'Fitness enthusiast looking for workout buddies and health-conscious friends.', ARRAY['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop'], 'Miami, FL', false, true, 256),
  ('11111111-1111-1111-1111-111111111114', '00000000-0000-0000-0000-000000000004', 'Ava', 'Currently exploring new cities. Would love to meet locals and fellow travelers!', ARRAY['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop'], 'Austin, TX', true, true, 421),
  ('11111111-1111-1111-1111-111111111115', '00000000-0000-0000-0000-000000000005', 'Isabella', 'Creative soul looking for inspiration. Love art galleries and deep conversations.', ARRAY['https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop'], 'Chicago, IL', false, true, 178),
  ('11111111-1111-1111-1111-111111111116', '00000000-0000-0000-0000-000000000006', 'Mia', 'Concert lover and music enthusiast. Looking for friends to enjoy live shows with!', ARRAY['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop'], 'Seattle, WA', true, true, 298)
ON CONFLICT (id) DO NOTHING;
