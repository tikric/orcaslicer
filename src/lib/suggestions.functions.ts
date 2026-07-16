import { supabase } from "@/integrations/supabase/client";

export type Suggestion = {
  id: string;
  userId: string;
  email: string | null;
  displayName: string | null;
  message: string;
  category: string | null;
  status: string;
  createdAt: string;
};

export async function createSuggestion({
  data,
}: {
  data: { message: string; category?: string | null };
}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("Não autenticado");
  const userId = session.user.id;

  const { error } = await supabase.from("suggestions").insert({
    user_id: userId,
    message: data.message,
    category: data.category ?? null,
  });
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function listSuggestions(): Promise<Suggestion[]> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("Não autenticado");
  const userId = session.user.id;

  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const isAdmin =
    (roles ?? []).some((r) => r.role === "admin") || session.user.email === "admin@orca.pro";
  if (!isAdmin) throw new Error("Forbidden");

  const { data, error } = await supabase
    .from("suggestions")
    .select("id, user_id, message, category, status, created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);

  const userIds = Array.from(new Set((data ?? []).map((s) => s.user_id)));
  const profileMap = new Map<string, { email: string | null; display_name: string | null }>();
  if (userIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, display_name")
      .in("id", userIds);
    for (const p of profiles ?? []) {
      profileMap.set(p.id, { email: p.email ?? null, display_name: p.display_name ?? null });
    }
  }

  return (data ?? []).map((s) => ({
    id: s.id,
    userId: s.user_id,
    email: profileMap.get(s.user_id)?.email ?? null,
    displayName: profileMap.get(s.user_id)?.display_name ?? null,
    message: s.message,
    category: s.category,
    status: s.status,
    createdAt: s.created_at,
  }));
}

export async function updateSuggestionStatus({
  data,
}: {
  data: { id: string; status: "new" | "read" | "done" | "archived" };
}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("Não autenticado");
  const userId = session.user.id;

  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const isAdmin =
    (roles ?? []).some((r) => r.role === "admin") || session.user.email === "admin@orca.pro";
  if (!isAdmin) throw new Error("Forbidden");

  const { error } = await supabase
    .from("suggestions")
    .update({ status: data.status })
    .eq("id", data.id);
  if (error) throw new Error(error.message);
  return { ok: true };
}
