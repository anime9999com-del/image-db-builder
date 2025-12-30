-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  country TEXT DEFAULT 'United States (USD $)',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_roles table for admin management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE(user_id, role)
);

-- Create site_content table for editable content
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create listeners table
CREATE TABLE public.listeners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initials TEXT NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  rating DECIMAL(2,1) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  categories TEXT[] DEFAULT '{}',
  bio TEXT,
  voice_price INTEGER NOT NULL DEFAULT 15,
  video_price INTEGER NOT NULL DEFAULT 20,
  avatar_color TEXT DEFAULT '#38bdf8',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bookings table for future use
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listener_id UUID NOT NULL REFERENCES public.listeners(id) ON DELETE CASCADE,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('voice', 'video')),
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_id TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listeners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies (only admins can manage)
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Site content policies
CREATE POLICY "Anyone can view site content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admins can manage site content" ON public.site_content FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Listeners policies
CREATE POLICY "Anyone can view active listeners" ON public.listeners FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage listeners" ON public.listeners FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Bookings policies
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage bookings" ON public.bookings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, country)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'country', 'United States (USD $)')
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default site content
INSERT INTO public.site_content (key, content) VALUES 
('hero', '{"badge": "You are not alone", "title": "Sometimes, you just need", "highlight": "someone to listen.", "description": "Feeling down, lonely, or just want to share some good news? Connect with empathetic listeners via Voice or Video call.", "trustedCount": "10,000+"}'),
('footer', '{"tagline": "Making the world a little less lonely, one conversation at a time. We are here for you."}');

-- Insert sample listeners
INSERT INTO public.listeners (initials, name, tagline, rating, review_count, categories, bio, voice_price, video_price, avatar_color) VALUES
('SJ', 'Sarah J.', 'The Optimist', 5.0, 48, ARRAY['Career', 'Relationships'], 'I love helping people find the silver lining.', 15, 20, '#facc15'),
('MR', 'Mike R.', 'Calm Presence', 4.9, 120, ARRAY['Stress', 'Gaming'], 'Here to listen quietly without judgment.', 12, 18, '#ef4444'),
('EG', 'Elena G.', 'Life Cheerleader', 5.0, 85, ARRAY['Motivation', 'Family'], 'Let''s turn that frown upside down!', 18, 25, '#fcd9b6'),
('DK', 'David K.', 'Career Mentor', 4.8, 32, ARRAY['Job Loss', 'Burnout'], 'I understand the pressures of modern work life.', 20, 28, '#facc15'),
('PM', 'Priya M.', 'Anxiety Aide', 5.0, 60, ARRAY['Anxiety', 'Panic'], 'Breathing through tough times, together.', 15, 22, '#a855f7');