-- 1. Schema privado para funções auxiliares (não exposto pela Data API)
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

-- 2. Recria has_role em `private` (SECURITY DEFINER continua necessário p/ RLS não-recursivo)
CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- 3. Recria is_trial_active em `private`
CREATE OR REPLACE FUNCTION private.is_trial_active(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT trial_started_at + INTERVAL '7 days' > now() FROM public.profiles WHERE id = _user_id),
    false
  );
$$;

REVOKE ALL ON FUNCTION private.is_trial_active(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_trial_active(uuid) TO authenticated, service_role;

-- 4. Recria políticas para apontar para private.has_role antes de dropar a versão public
DROP POLICY IF EXISTS "Admins read all roles" ON public.user_roles;
CREATE POLICY "Admins read all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins read all profiles" ON public.profiles;
CREATE POLICY "Admins read all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- 5. Remove as versões antigas expostas em `public`
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP FUNCTION IF EXISTS public.is_trial_active(uuid);

-- 6. Bloqueia acesso RPC ao trigger handle_new_user (executado apenas via trigger)
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- 7. Política INSERT em public.profiles — cada usuário só pode criar o próprio perfil.
--    A criação normal acontece via trigger SECURITY DEFINER, mas a política explícita
--    documenta a intenção e evita brechas caso o trigger seja removido no futuro.
CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 8. Políticas INSERT/UPDATE/DELETE em public.user_roles — apenas admins podem gerenciar papéis.
CREATE POLICY "Admins insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));