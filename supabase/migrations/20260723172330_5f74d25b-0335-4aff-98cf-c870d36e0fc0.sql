ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS confirmation_token uuid NOT NULL DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX IF NOT EXISTS bookings_confirmation_token_key ON public.bookings(confirmation_token);
GRANT ALL ON public.bookings TO service_role;