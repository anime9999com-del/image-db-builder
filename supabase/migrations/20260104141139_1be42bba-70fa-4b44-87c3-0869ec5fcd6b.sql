-- Add currency field to listeners table
ALTER TABLE public.listeners 
ADD COLUMN currency text NOT NULL DEFAULT 'USD';

-- Add meet_link field to bookings table
ALTER TABLE public.bookings 
ADD COLUMN meet_link text;