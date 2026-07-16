import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { courseTabs, type CourseItem } from "@/data/courseData";

/** Retorna o valor "canônico" para o item: o selecionado pelo aluno, ou o default. */
function resolveValue(item: CourseItem, selections: Record<string, string>): string {
  const chosen = selections[item.id];
  if (chosen) return chosen;
  // Se houver uma option marcada como PADRÃO, usa ela.
  const padrao = item.content.options?.find((o) => /padr[aã]o/i.test(o.value));
  return padrao?.value ?? item.value;
}

const BRAND = { r: 0, g: 200, b: 150 }; // #00C896
const BRAND2 = { r: 96, g: 165, b: 250 }; // #60a5fa
const BG = { r: 10, g: 12, b: 16 }; // #0a0c10
const CARD = { r: 20, g: 24, b: 31 }; // #14181f
const TEXT = { r: 235, g: 238, b: 245 };
const MUTED = { r: 155, g: 165, b: 180 };
const BORDER = { r: 40, g: 48, b: 60 };

export function exportCourseAsPdf(selections: Record<string, string>) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // === Capa ===
  doc.setFillColor(BG.r, BG.g, BG.b);
  doc.rect(0, 0, pageW, pageH, "F");

  // Faixa de gradiente simulada (retângulos horizontais)
  const bandH = 220;
  for (let i = 0; i < bandH; i++) {
    const t = i / bandH;
    const r = Math.round(BRAND.r * (1 - t) + BRAND2.r * t);
    const g = Math.round(BRAND.g * (1 - t) + BRAND2.g * t);
    const b = Math.round(BRAND.b * (1 - t) + BRAND2.b * t);
    doc.setFillColor(r, g, b);
    doc.rect(0, i, pageW, 1, "F");
  }
  // Overlay escuro
  doc.setFillColor(BG.r, BG.g, BG.b);
  doc.setGState(new (doc as any).GState({ opacity: 0.55 }));
  doc.rect(0, 0, pageW, bandH, "F");
  doc.setGState(new (doc as any).GState({ opacity: 1 }));

  doc.setTextColor(TEXT.r, TEXT.g, TEXT.b);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.text("Guia OrcaSlicer", 40, 100);
  doc.setFontSize(16);
  doc.setTextColor(BRAND.r, BRAND.g, BRAND.b);
  doc.text("Parâmetros recomendados · Referência rápida", 40, 128);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.text(
    "Cada seção lista os parâmetros do módulo com o valor recomendado e a\nregra de ouro para você aplicar diretamente no OrcaSlicer.",
    40,
    160,
  );

  const now = new Date().toLocaleDateString("pt-BR");
  doc.setFontSize(9);
  doc.text(`Gerado em ${now}`, 40, pageH - 40);

  // === Sumário ===
  doc.setTextColor(TEXT.r, TEXT.g, TEXT.b);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Módulos", 40, 260);

  let y = 285;
  doc.setFontSize(11);
  courseTabs.forEach((tab, i) => {
    const count = tab.groups.reduce((sum, g) => sum + g.items.length, 0);
    doc.setTextColor(BRAND.r, BRAND.g, BRAND.b);
    doc.setFont("helvetica", "bold");
    doc.text(`${String(i + 1).padStart(2, "0")}`, 40, y);
    doc.setTextColor(TEXT.r, TEXT.g, TEXT.b);
    doc.setFont("helvetica", "normal");
    doc.text(tab.label, 70, y);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text(`${count} parâmetros`, pageW - 40, y, { align: "right" });
    y += 20;
  });

  // === Uma página por tab ===
  courseTabs.forEach((tab, tabIndex) => {
    doc.addPage();
    // Fundo escuro
    doc.setFillColor(BG.r, BG.g, BG.b);
    doc.rect(0, 0, pageW, pageH, "F");

    // Header do módulo
    doc.setFillColor(CARD.r, CARD.g, CARD.b);
    doc.rect(0, 0, pageW, 80, "F");
    doc.setDrawColor(BRAND.r, BRAND.g, BRAND.b);
    doc.setLineWidth(3);
    doc.line(0, 80, pageW, 80);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(BRAND.r, BRAND.g, BRAND.b);
    doc.text(`MÓDULO ${String(tabIndex + 1).padStart(2, "0")}`, 40, 35);
    doc.setFontSize(22);
    doc.setTextColor(TEXT.r, TEXT.g, TEXT.b);
    doc.text(tab.label, 40, 62);

    let cursorY = 110;

    tab.groups.forEach((group) => {
      const rows = group.items.map((item) => [
        item.label,
        resolveValue(item, selections),
        item.content.regraDeOuro || "—",
      ]);

      // Título do grupo
      if (cursorY > pageH - 120) {
        doc.addPage();
        doc.setFillColor(BG.r, BG.g, BG.b);
        doc.rect(0, 0, pageW, pageH, "F");
        cursorY = 60;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(TEXT.r, TEXT.g, TEXT.b);
      doc.text(group.label, 40, cursorY);
      // Linha decorativa
      doc.setDrawColor(BRAND.r, BRAND.g, BRAND.b);
      doc.setLineWidth(2);
      doc.line(40, cursorY + 4, 40 + 30, cursorY + 4);
      cursorY += 14;

      autoTable(doc, {
        startY: cursorY,
        head: [["Parâmetro", "Valor recomendado", "Regra de ouro"]],
        body: rows,
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 9,
          cellPadding: 6,
          textColor: [TEXT.r, TEXT.g, TEXT.b],
          fillColor: [CARD.r, CARD.g, CARD.b],
          lineColor: [BORDER.r, BORDER.g, BORDER.b],
          lineWidth: 0.5,
          valign: "middle",
        },
        headStyles: {
          fillColor: [BRAND.r, BRAND.g, BRAND.b],
          textColor: [10, 12, 16],
          fontStyle: "bold",
          fontSize: 9,
        },
        alternateRowStyles: {
          fillColor: [16, 19, 26],
        },
        columnStyles: {
          0: { cellWidth: 150, fontStyle: "bold" },
          1: {
            cellWidth: 110,
            textColor: [BRAND.r, BRAND.g, BRAND.b],
            fontStyle: "bold",
          },
          2: { cellWidth: "auto", textColor: [MUTED.r, MUTED.g, MUTED.b] },
        },
        margin: { left: 40, right: 40, top: 40, bottom: 40 },
        willDrawPage: (data: { pageNumber: number }) => {
          // Preenche o fundo escuro APENAS em páginas novas criadas pelo
          // autotable (a 1ª página já foi preparada por nós, com o header do
          // módulo). didDrawPage não serve: pinta POR CIMA e apaga o conteúdo.
          if (data.pageNumber > 1) {
            doc.setFillColor(BG.r, BG.g, BG.b);
            doc.rect(0, 0, pageW, pageH, "F");
          }
        },
      });

      cursorY = (doc as any).lastAutoTable.finalY + 22;
    });

    // Rodapé com paginação
    const total = doc.getNumberOfPages();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text(`Guia OrcaSlicer · ${tab.label}`, 40, pageH - 20);
    doc.text(`Página ${total}`, pageW - 40, pageH - 20, { align: "right" });
  });

  doc.save(`guia-orcaslicer-${new Date().toISOString().slice(0, 10)}.pdf`);
}
