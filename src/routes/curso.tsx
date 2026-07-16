import { createFileRoute } from "@tanstack/react-router";
import { InfographicView } from "../components/InfographicView";

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
  component: InfographicView,
});
