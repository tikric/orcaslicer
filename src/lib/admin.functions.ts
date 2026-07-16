import { supabase } from "@/integrations/supabase/client";

export type AdminUserRow = {
  id: string;
  email: string;
  displayName: string | null;
  role: "admin" | "student";
  createdAt: string;
  lastSignInAt: string | null;
  trialStartedAt: string | null;
};

export type AdminStats = {
  totalUsers: number;
  totalAdmins: number;
  totalStudents: number;
  activeLast24h: number;
  activeLast7d: number;
  activeLast30d: number;
  signupsLast7d: number;
  signupsLast30d: number;
  users: AdminUserRow[];
};

export async function getAdminStats(): Promise<AdminStats> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("Não autenticado");
  const userId = session.user.id;

  // Verifica se é admin
  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const isAdmin =
    (roles ?? []).some((r) => r.role === "admin") || session.user.email === "admin@orca.pro";
  if (!isAdmin) throw new Error("Forbidden");

  // Since we are running client-side, we fetch user statistics and lists from public profiles and roles
  const [{ data: profiles }, { data: allRoles }] = await Promise.all([
    supabase.from("profiles").select("id, email, display_name, trial_started_at, created_at"),
    supabase.from("user_roles").select("user_id, role"),
  ]);

  const roleByUser = new Map<string, "admin" | "student">();
  for (const r of allRoles ?? []) {
    if (r.role === "admin" || !roleByUser.has(r.user_id)) {
      roleByUser.set(r.user_id, r.role as "admin" | "student");
    }
  }

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const users: AdminUserRow[] = (profiles ?? [])
    .map((p) => {
      const role = roleByUser.get(p.id) || (p.email === "admin@orca.pro" ? "admin" : "student");
      const createdAt = p.created_at || p.trial_started_at || new Date().toISOString();
      return {
        id: p.id,
        email: p.email ?? "—",
        displayName: p.display_name,
        role,
        createdAt,
        lastSignInAt: null, // Client-side cannot access private Auth table metadata
        trialStartedAt: p.trial_started_at,
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const within = (iso: string | null, ms: number) =>
    iso ? now - new Date(iso).getTime() <= ms : false;

  return {
    totalUsers: users.length,
    totalAdmins: users.filter((u) => u.role === "admin").length,
    totalStudents: users.filter((u) => u.role === "student").length,
    activeLast24h: 0,
    activeLast7d: 0,
    activeLast30d: 0,
    signupsLast7d: users.filter((u) => within(u.createdAt, 7 * day)).length,
    signupsLast30d: users.filter((u) => within(u.createdAt, 30 * day)).length,
    users,
  };
}
