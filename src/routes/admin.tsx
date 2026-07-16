import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

// Painel admin carregado sob demanda — fora do bundle inicial.
const AdminPanel = lazy(() => import("@/components/AdminPanel"));

function AdminFallback() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#0a0c10" }}
    >
      <div className="text-gray-500 text-sm">Carregando…</div>
    </div>
  );
}

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin · OrcaSlicer Pro" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <Suspense fallback={<AdminFallback />}>
      <AdminPanel />
    </Suspense>
  ),
});
