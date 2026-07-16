import { jsPDF } from "jspdf";

interface GenerateConfigPDFParams {
  printerPreset: string;
  nozzleSize: string;
  partType: string;
  plateType: string;
  filament: string;
  exposure: string;
  calibFlowRate: number | string;
  calibPA: number | string;
  calibMaxVol: number | string;
  parameterValues: Record<string, string>;
  selectedUsages: Record<string, string>;
  getCalculatedBoxValue: any;
  getRecommendedValueForParameter: any;
}

export function generateConfigPDF(params: GenerateConfigPDFParams): void {
  const doc = new jsPDF();

  // Color scheme - Deep Navy Blue & Dark Slate
  const primaryColor = [33, 43, 54] as const; // RGB
  const accentColor = [234, 179, 8] as const;  // RGB (OrcaSlicer Gold)
  
  // Page header background accent
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 40, "F");

  // Title on Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("OrcaSlicer Pro", 14, 20);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text("RELATÓRIO DE CALIBRAÇÃO E CONFIGURAÇÃO", 14, 30);

  // Date and Time on top right
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, 150, 20);

  let y = 55;

  // Section 1: Configuração Principal
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("1. Perfil da Impressora e Material", 14, y);
  
  // Underline
  doc.setDrawColor(220, 225, 230);
  doc.line(14, y + 2, 196, y + 2);
  
  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 66, 82);

  // Column Layout
  const col1 = 14;
  const col2 = 110;

  doc.setFont("helvetica", "bold");
  doc.text("Impressora:", col1, y);
  doc.setFont("helvetica", "normal");
  doc.text(params.printerPreset || "Não especificado", col1 + 25, y);

  doc.setFont("helvetica", "bold");
  doc.text("Filamento:", col2, y);
  doc.setFont("helvetica", "normal");
  doc.text(params.filament ? params.filament.toUpperCase() : "Não especificado", col2 + 25, y);

  y += 8;
  doc.setFont("helvetica", "bold");
  doc.text("Bico (Nozzle):", col1, y);
  doc.setFont("helvetica", "normal");
  doc.text(params.nozzleSize || "0.4 mm", col1 + 25, y);

  doc.setFont("helvetica", "bold");
  doc.text("Exposição:", col2, y);
  doc.setFont("helvetica", "normal");
  doc.text(params.exposure || "Não especificado", col2 + 25, y);

  y += 8;
  doc.setFont("helvetica", "bold");
  doc.text("Tipo de Peça:", col1, y);
  doc.setFont("helvetica", "normal");
  doc.text(params.partType || "Uso Geral", col1 + 25, y);

  doc.setFont("helvetica", "bold");
  doc.text("Tipo de Mesa:", col2, y);
  doc.setFont("helvetica", "normal");
  doc.text(params.plateType || "Não especificado", col2 + 25, y);

  // Section 2: Resultados de Calibração Ativos
  y += 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("2. Parâmetros de Calibração do Filamento", 14, y);
  doc.line(14, y + 2, 196, y + 2);

  y += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const drawCalibrationBox = (title: string, val: number | string, currentY: number) => {
    doc.setFillColor(245, 247, 250);
    doc.rect(14, currentY, 182, 12, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(title, 18, currentY + 8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    const valStr = val !== undefined && val !== null && val !== "" ? val.toString() : "Padrão";
    doc.text(valStr, 150, currentY + 8);
  };

  drawCalibrationBox("Multiplicador de Fluxo (Flow Rate)", params.calibFlowRate, y);
  y += 15;
  drawCalibrationBox("Pressure Advance (PA)", params.calibPA, y);
  y += 15;
  drawCalibrationBox("Velocidade Volumétrica Máxima (Max Volumetric)", params.calibMaxVol, y);

  // Section 3: Recomendações e Dicas de Ajuste
  y += 25;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("3. Recomendações Extras de Fatiamento", 14, y);
  doc.line(14, y + 2, 196, y + 2);

  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 66, 82);

  const tips = [
    "• Utilize sempre a ordem de paredes 'Interna-Externa' para garantir a precisão do Precise Wall.",
    "• Se utilizar pontes (bridges), reduza o Fluxo de Ponte para ~0.95 para evitar quedas.",
    "• Compensação de pé de elefante recomendada: 0.15 mm para todas as peças de encaixe.",
    "• Use suporte em árvore (Tree) para peças detalhadas para remoção fácil sem deixar marcas.",
    "• Para materiais sensíveis a warping (ABS/ASA), use Brim (borda) de no mínimo 5 mm na base."
  ];

  tips.forEach((tip) => {
    doc.text(tip, 14, y);
    y += 8;
  });

  // Footer on all pages
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(160, 165, 175);
  doc.text("Curso OrcaSlicer Pro - Escola de Impressão 3D de Alta Performance", 14, pageHeight - 15);
  doc.text("© Todos os direitos reservados", 160, pageHeight - 15);

  // Save the PDF
  doc.save("Relatorio-Calibracao-OrcaSlicerPro.pdf");
}
