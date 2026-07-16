// src/components/AdminPanel.tsx — Painel administrativo (lazy-loaded pela rota /admin).
// Extraído do admin.tsx para ficar fora do bundle inicial da página de vendas.

import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAccess } from "@/hooks/useAccess";
import { getAdminStats, type AdminUserRow } from "@/lib/admin.functions";
import {
  listSuggestions,
  updateSuggestionStatus,
  type Suggestion,
} from "@/lib/suggestions.functions";
import { supabase } from "@/integrations/supabase/client";
import {
  Users,
  UserCheck,
  Crown,
  Activity,
  TrendingUp,
  LogOut,
  ArrowLeft,
  Sparkles,
  Shield,
  Lightbulb,
  Archive,
  CheckCircle2,
  Eye,
} from "lucide-react";

const queryClient = new QueryClient();

export default function AdminPanel() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminGate />
    </QueryClientProvider>
  );
}

function AdminGate() {
  const { loading, signedIn, info } = useAccess();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0a0c10" }}
      >
        <div className="text-gray-500 text-sm">Carregando…</div>
      </div>
    );
  }
  if (!signedIn) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0a0c10" }}
      >
        <div className="text-gray-400 text-sm">
          Faça{" "}
          <Link to="/curso" className="text-[#00C896] font-bold">
            login
          </Link>{" "}
          primeiro.
        </div>
      </div>
    );
  }
  if (!info?.isAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: "#0a0c10" }}
      >
        <div className="text-center max-w-sm">
          <Shield size={40} className="mx-auto text-gray-600 mb-3" />
          <div className="text-white font-bold mb-1">Acesso restrito</div>
          <div className="text-gray-500 text-sm mb-4">
            Apenas administradores podem ver esta página.
          </div>
          <Link to="/curso" className="text-[#00C896] font-bold text-sm">
            ← Voltar para o curso
          </Link>
        </div>
      </div>
    );
  }
  return <AdminDashboard />;
}

function AdminDashboard() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => getAdminStats(),
    refetchInterval: 30_000,
  });

  const handleSignOut = async () => {
    localStorage.removeItem("offline_session");
    localStorage.removeItem("offline_email");
    localStorage.removeItem("offline_name");
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.debug("Sign out error ignored", e);
    }
    window.location.reload();
  };

  return (
    <div
      className="min-h-screen text-gray-100"
      style={{
        background:
          "radial-gradient(1200px 600px at 20% -10%, rgba(250,204,21,0.06), transparent 60%), radial-gradient(900px 500px at 90% 100%, rgba(0,200,150,0.06), transparent 60%), #0a0c10",
      }}
    >
      {/* Header */}
      <header
        className="px-6 h-14 flex items-center justify-between sticky top-0 z-40"
        style={{
          background: "#0a0c10cc",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #1a1d25",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "#facc1522", border: "1px solid #facc1555" }}
          >
            <Crown size={14} style={{ color: "#facc15" }} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-bold text-white">Painel Admin</span>
            <span className="text-[11px] text-gray-500">
              OrcaSlicer Pro · Estatísticas do curso
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/curso"
            className="flex items-center gap-1.5 px-3 h-8 rounded-full text-[11px] font-semibold text-gray-400 hover:text-white transition-colors"
            style={{ background: "#12151c", border: "1px solid #1f2430" }}
          >
            <ArrowLeft size={12} /> Ir para o curso
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 h-8 rounded-full text-[11px] font-semibold text-gray-400 hover:text-white transition-colors"
            style={{ background: "#12151c", border: "1px solid #1f2430" }}
          >
            <LogOut size={12} /> Sair
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {isLoading && <div className="text-gray-500 text-sm">Carregando estatísticas…</div>}
        {error && (
          <div
            className="p-4 rounded-lg text-sm"
            style={{ background: "#7f1d1d33", border: "1px solid #7f1d1d66", color: "#fca5a5" }}
          >
            Erro ao carregar: {(error as Error).message}
          </div>
        )}

        {data && (
          <>
            {/* Cards de KPI */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <Kpi
                icon={<Users size={16} />}
                label="Alunos totais"
                value={data.totalUsers}
                accent="#00C896"
              />
              <Kpi
                icon={<Activity size={16} />}
                label="Ativos (24h)"
                value={data.activeLast24h}
                accent="#60a5fa"
              />
              <Kpi
                icon={<UserCheck size={16} />}
                label="Ativos (7d)"
                value={data.activeLast7d}
                accent="#a78bfa"
              />
              <Kpi
                icon={<TrendingUp size={16} />}
                label="Novos (7d)"
                value={data.signupsLast7d}
                accent="#facc15"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <MiniStat label="Alunos" value={data.totalStudents} />
              <MiniStat label="Admins" value={data.totalAdmins} />
              <MiniStat label="Ativos 30d" value={data.activeLast30d} />
              <MiniStat label="Novos 30d" value={data.signupsLast30d} />
            </div>

            {/* Tabela */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #14181f 0%, #10131a 100%)",
                border: "1px solid #1f2430",
              }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} style={{ color: "#00C896" }} />
                  <h2 className="text-sm font-bold text-white">Alunos cadastrados</h2>
                  <span className="text-[11px] text-gray-500">
                    {data.users.length} · ordenados por último acesso
                  </span>
                </div>
                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="text-[11px] font-semibold text-gray-400 hover:text-white disabled:opacity-40"
                >
                  {isFetching ? "Atualizando…" : "Atualizar"}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10px] uppercase tracking-widest text-gray-500 border-b border-white/5">
                      <th className="px-5 py-3 font-bold">Aluno</th>
                      <th className="px-5 py-3 font-bold">Papel</th>
                      <th className="px-5 py-3 font-bold">Último acesso</th>
                      <th className="px-5 py-3 font-bold">Cadastro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map((u) => (
                      <UserRow key={u.id} user={u} />
                    ))}
                    {data.users.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-5 py-8 text-center text-gray-500 text-sm">
                          Nenhum aluno cadastrado ainda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8">
              <SuggestionsPanel />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function SuggestionsPanel() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["admin-suggestions"],
    queryFn: () => listSuggestions(),
    refetchInterval: 30_000,
  });

  const setStatus = async (id: string, status: "new" | "read" | "done" | "archived") => {
    try {
      await updateSuggestionStatus({ data: { id, status } });
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  const list = data ?? [];
  const pending = list.filter((s) => s.status === "new").length;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #14181f 0%, #10131a 100%)",
        border: "1px solid #1f2430",
      }}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Lightbulb size={14} style={{ color: "#facc15" }} />
          <h2 className="text-sm font-bold text-white">Sugestões dos alunos</h2>
          <span className="text-[11px] text-gray-500">
            {list.length} total{pending > 0 ? ` · ${pending} novas` : ""}
          </span>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="text-[11px] font-semibold text-gray-400 hover:text-white disabled:opacity-40"
        >
          {isFetching ? "Atualizando…" : "Atualizar"}
        </button>
      </div>

      <div className="p-5 space-y-3">
        {isLoading && <div className="text-gray-500 text-sm">Carregando sugestões…</div>}
        {error && <div className="text-sm text-red-300">Erro: {(error as Error).message}</div>}
        {!isLoading && list.length === 0 && (
          <div className="text-gray-500 text-sm py-8 text-center">
            Nenhuma sugestão recebida ainda.
          </div>
        )}
        {list.map((s) => (
          <SuggestionRow key={s.id} s={s} onStatus={setStatus} />
        ))}
      </div>
    </div>
  );
}

function SuggestionRow({
  s,
  onStatus,
}: {
  s: Suggestion;
  onStatus: (id: string, status: "new" | "read" | "done" | "archived") => void;
}) {
  const badge =
    s.status === "new"
      ? { text: "Nova", bg: "#facc1522", color: "#facc15", border: "#facc1555" }
      : s.status === "read"
        ? { text: "Lida", bg: "#60a5fa22", color: "#60a5fa", border: "#60a5fa55" }
        : s.status === "done"
          ? { text: "Resolvida", bg: "#00C89622", color: "#00C896", border: "#00C89655" }
          : { text: "Arquivada", bg: "#4b556322", color: "#9ca3af", border: "#4b556355" };

  return (
    <div className="rounded-xl p-4" style={{ background: "#10131a", border: "1px solid #1f2430" }}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex flex-col min-w-0">
          <span className="text-white text-sm font-semibold truncate">
            {s.displayName || s.email || s.userId.slice(0, 8)}
          </span>
          <span className="text-[11px] text-gray-500 truncate">
            {s.email || "—"} · {new Date(s.createdAt).toLocaleString("pt-BR")}
            {s.category && (
              <>
                {" "}
                · <span style={{ color: "#facc15" }}>{s.category}</span>
              </>
            )}
          </span>
        </div>
        <span
          className="inline-flex items-center px-2 h-6 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
          style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}
        >
          {badge.text}
        </span>
      </div>
      <p className="text-[13.5px] text-gray-200 whitespace-pre-wrap leading-relaxed">{s.message}</p>
      <div className="flex items-center gap-2 mt-3">
        {s.status !== "read" && (
          <button
            onClick={() => onStatus(s.id, "read")}
            className="flex items-center gap-1 px-2.5 h-7 rounded-md text-[11px] font-semibold text-gray-300 hover:text-white"
            style={{ background: "#12151c", border: "1px solid #1f2430" }}
          >
            <Eye size={11} /> Marcar como lida
          </button>
        )}
        {s.status !== "done" && (
          <button
            onClick={() => onStatus(s.id, "done")}
            className="flex items-center gap-1 px-2.5 h-7 rounded-md text-[11px] font-semibold"
            style={{ background: "#00C89622", color: "#00C896", border: "1px solid #00C89655" }}
          >
            <CheckCircle2 size={11} /> Resolvida
          </button>
        )}
        {s.status !== "archived" && (
          <button
            onClick={() => onStatus(s.id, "archived")}
            className="flex items-center gap-1 px-2.5 h-7 rounded-md text-[11px] font-semibold text-gray-400 hover:text-white"
            style={{ background: "#12151c", border: "1px solid #1f2430" }}
          >
            <Archive size={11} /> Arquivar
          </button>
        )}
      </div>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "linear-gradient(180deg, #14181f 0%, #10131a 100%)",
        border: "1px solid #1f2430",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}55` }}
        >
          {icon}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          {label}
        </span>
      </div>
      <div className="text-3xl font-black text-white tracking-tight">{value}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="rounded-xl px-4 py-3 flex items-center justify-between"
      style={{ background: "#10131a", border: "1px solid #1f2430" }}
    >
      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">{label}</span>
      <span className="text-lg font-black text-white">{value}</span>
    </div>
  );
}

function UserRow({ user }: { user: AdminUserRow }) {
  const initial = (user.displayName || user.email || "?")[0]?.toUpperCase();
  const isAdmin = user.role === "admin";
  const now = Date.now();
  const last = user.lastSignInAt ? new Date(user.lastSignInAt).getTime() : null;
  const online = last !== null && now - last < 5 * 60 * 1000;

  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.02]">
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[12px] relative"
            style={{
              background: isAdmin ? "#facc1522" : "#00C89622",
              color: isAdmin ? "#facc15" : "#00C896",
              border: `1px solid ${isAdmin ? "#facc1555" : "#00C89655"}`,
            }}
          >
            {initial}
            {online && (
              <span
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                style={{ background: "#22c55e", border: "2px solid #10131a" }}
                title="Online agora"
              />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white font-semibold truncate">{user.displayName || "—"}</span>
            <span className="text-gray-500 text-[12px] truncate">{user.email}</span>
          </div>
        </div>
      </td>
      <td className="px-5 py-3">
        {isAdmin ? (
          <span
            className="inline-flex items-center gap-1 px-2 h-6 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{ background: "#facc1522", color: "#facc15", border: "1px solid #facc1555" }}
          >
            <Crown size={10} /> Admin
          </span>
        ) : (
          <span
            className="inline-flex items-center gap-1 px-2 h-6 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{ background: "#00C89622", color: "#00C896", border: "1px solid #00C89655" }}
          >
            Aluno
          </span>
        )}
      </td>
      <td className="px-5 py-3 text-gray-300">
        {user.lastSignInAt ? (
          <div className="flex flex-col">
            <span>{formatRelative(user.lastSignInAt)}</span>
            <span className="text-[11px] text-gray-500">{formatDateTime(user.lastSignInAt)}</span>
          </div>
        ) : (
          <span className="text-gray-600 text-[12px]">Nunca acessou</span>
        )}
      </td>
      <td className="px-5 py-3 text-gray-400 text-[12px]">{formatDate(user.createdAt)}</td>
    </tr>
  );
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "agora mesmo";
  const min = Math.floor(sec / 60);
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `há ${d}d`;
  const mo = Math.floor(d / 30);
  return `há ${mo} mês${mo > 1 ? "es" : ""}`;
}
function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR");
}
