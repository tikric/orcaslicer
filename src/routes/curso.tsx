import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

// Área do aluno carregada sob demanda — Supabase, jsPDF e o conteúdo
// completo do curso ficam fora do bundle inicial da página de vendas.
const InfographicView = lazy(() =>
  import("../components/InfographicView").then((m) => ({ default: m.InfographicView })),
);

function CursoFallback() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-3"
      style={{ background: "#0a0c10" }}
    >
      <div
        className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: "#00C89633", borderTopColor: "#00C896" }}
      />
      <div className="text-gray-500 text-sm">Carregando área do aluno…</div>
    </div>
  );
}

export const Route = createFileRoute("/curso")({
  head: () => ({
    meta: [
      { title: "Curso OrcaSlicer Pro — Área do aluno" },
      {
        name: "description",
        content:
          "O único curso completo de OrcaSlicer em português. Todas as configurações, otimizações e correções de erros para imprimir peças perfeitas. Garantia de 7 dias para devolução.",
      },
      { property: "og:title", content: "Curso OrcaSlicer Pro" },
      {
        property: "og:description",
        content: "Domine cada parâmetro do OrcaSlicer. Apenas R$ 39,90 com garantia de 7 dias.",
      },
      { property: "og:type", content: "product" },
    ],
  }),
  component: () => (
    <Suspense fallback={<CursoFallback />}>
      <InfographicView />
    </Suspense>
  ),
});
