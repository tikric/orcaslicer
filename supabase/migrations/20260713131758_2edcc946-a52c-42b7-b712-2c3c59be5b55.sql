CREATE TABLE public.suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.suggestions TO authenticated;
GRANT ALL ON public.suggestions TO service_role;

ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert own suggestions"
  ON public.suggestions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read own suggestions"
  ON public.suggestions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins read all suggestions"
  ON public.suggestions FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update suggestions"
  ON public.suggestions FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete suggestions"
  ON public.suggestions FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_suggestions_updated_at
  BEFORE UPDATE ON public.suggestions
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE INDEX idx_suggestions_created_at ON public.suggestions (created_at DESC);
CREATE INDEX idx_suggestions_user_id ON public.suggestions (user_id);