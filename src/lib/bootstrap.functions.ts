import { supabase } from "@/integrations/supabase/client";

/**
 * Cria o usuário admin (admin@orca.pro / admin8460) se ainda não existir.
 * Idempotente — pode ser chamado a cada carregamento da página de login.
 * Executado inteiramente no cliente para evitar erros de fetch em ambientes com rede restrita.
 */
export async function ensureAdminUser(): Promise<{
  created: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", "admin@orca.pro")
      .maybeSingle();

    if (existing) return { created: false };

    const { data, error } = await supabase.auth.signUp({
      email: "admin@orca.pro",
      password: "admin8460",
      options: {
        data: {
          display_name: "Admin",
        },
      },
    });

    if (error) {
      if (/already|exists/i.test(error.message)) {
        return { created: false, message: "User already exists" };
      }
      return { created: false, error: error.message };
    }
    return { created: !!data.user };
  } catch (e) {
    const errMessage = e instanceof Error ? e.message : String(e);
    return { created: false, error: errMessage };
  }
}
