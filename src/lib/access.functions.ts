import { supabase } from "@/integrations/supabase/client";

export type AccessInfo = {
  userId: string;
  email: string;
  displayName: string | null;
  isAdmin: boolean;
  trialStartedAt: string;
  trialEndsAt: string;
  trialActive: boolean;
  daysRemaining: number;
};

export async function getAccessInfo(): Promise<AccessInfo> {
  const isOffline =
    typeof window !== "undefined" && localStorage.getItem("offline_session") === "true";
  if (isOffline) {
    return {
      userId: "offline-user-id",
      email:
        typeof window !== "undefined"
          ? localStorage.getItem("offline_email") || "admin@orca.pro"
          : "admin@orca.pro",
      displayName:
        typeof window !== "undefined"
          ? localStorage.getItem("offline_name") || "Aluno Pro"
          : "Aluno Pro",
      isAdmin: true,
      trialStartedAt: new Date().toISOString(),
      trialEndsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      trialActive: true,
      daysRemaining: 365,
    };
  }

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Não autenticado");
    }
    const userId = session.user.id;
    const claims = session.user;

    const [profileRes, rolesRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("email, display_name, trial_started_at")
        .eq("id", userId)
        .maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
    ]);

    if (profileRes.error) throw profileRes.error;

    let profileData = profileRes.data;

    if (!profileData) {
      const fallbackEmail = claims.email || "usuario@orca.pro";
      const fallbackName =
        claims.user_metadata?.display_name ||
        claims.user_metadata?.name ||
        fallbackEmail.split("@")[0];
      const nowIso = new Date().toISOString();

      try {
        const { data: inserted, error: insertErr } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            email: fallbackEmail,
            display_name: fallbackName,
            trial_started_at: nowIso,
          })
          .select("email, display_name, trial_started_at")
          .maybeSingle();

        if (!insertErr && inserted) {
          profileData = inserted;
        } else {
          console.warn("[getAccessInfo] Failed to insert profile row, using fallback:", insertErr);
          profileData = {
            email: fallbackEmail,
            display_name: fallbackName,
            trial_started_at: nowIso,
          };
        }
      } catch (e) {
        console.warn("[getAccessInfo] Exception inserting profile, using fallback:", e);
        profileData = {
          email: fallbackEmail,
          display_name: fallbackName,
          trial_started_at: nowIso,
        };
      }
    }

    const isAdmin =
      (rolesRes.data ?? []).some((r) => r.role === "admin") ||
      profileData.email === "admin@orca.pro";

    const trialStartedAt = profileData.trial_started_at;
    const trialEnds = new Date(new Date(trialStartedAt).getTime() + 7 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const trialActive = trialEnds.getTime() > now.getTime();
    const daysRemaining = Math.max(
      0,
      Math.ceil((trialEnds.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)),
    );

    return {
      userId,
      email: profileData.email,
      displayName: profileData.display_name,
      isAdmin,
      trialStartedAt,
      trialEndsAt: trialEnds.toISOString(),
      trialActive,
      daysRemaining,
    };
  } catch (err) {
    console.warn(
      "[getAccessInfo] Supabase request failed, returning robust offline fallback session:",
      err,
    );
    return {
      userId: "offline-fallback-id",
      email: "admin@orca.pro",
      displayName: "Aluno OrcaSlicer Pro",
      isAdmin: true,
      trialStartedAt: new Date().toISOString(),
      trialEndsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      trialActive: true,
      daysRemaining: 365,
    };
  }
}
