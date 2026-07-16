import { useState, useEffect, Fragment } from "react";
import { courseTabs, type CourseItem, type CourseTab } from "@/data/courseData";
import { CoursePanel } from "@/components/CoursePanel";
import { getGuideImageForItem } from "@/data/guideImages";
import { CalibrationSuite } from "@/components/CalibrationSuite";
import { InfographicView } from "@/components/InfographicView";
import { generateConfigPDF } from "../utils/pdfGenerator";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Layers,
  Printer,
  Settings,
  Cpu,
  Package,
  Sliders,
  Play,
  Check,
  Sparkles,
  Trophy,
  AlertTriangle,
  AlertCircle,
  Thermometer,
  Sun,
  CloudSnow,
  Droplets,
  Zap,
  Shield,
  Clock,
  Info as InfoIcon,
  Search,
  Gauge,
  Lock,
} from "lucide-react";

interface SlicingRecommendation {
  layerHeight: string;
  wallCount: string;
  infillDensity: string;
  infillPattern: string;
  seamPosition: string;
  tempNozzle: string;
  tempBed: string;
  coolingFan: string;
  brimType: string;
  description: string;
  filamentAlert?: {
    type: "success" | "warning" | "danger";
    text: string;
  };
}

const getDetailedRecommendation = (
  type: "estrutural" | "decorativa" | "prototipo" | "flexivel",
  size: "pequena" | "media" | "grande",
  exposure: "interno" | "uv" | "calor" | "frio" | "quimico",
  filament: "pla" | "petg" | "abs" | "asa" | "tpu" | "nylon",
): SlicingRecommendation => {
  // 1. Determine filament compatibility with exposure
  let alertType: "success" | "warning" | "danger" = "success";
  let alertText = "";

  switch (filament) {
    case "pla":
      if (exposure === "uv") {
        alertType = "danger";
        alertText =
          "⚠️ CRÍTICO: O PLA não possui resistência UV. Ele se tornará quebradiço, perderá a cor e degradará rapidamente sob o sol. Prefira ASA!";
      } else if (exposure === "calor") {
        alertType = "danger";
        alertText =
          "⚠️ CRÍTICO: O PLA amolece e deforma a apenas 50°C-55°C. Inadequado para calor! Use ABS, ASA ou Nylon.";
      } else if (exposure === "frio") {
        alertType = "warning";
        alertText =
          "⚠️ ATENÇÃO: O PLA torna-se extremamente frágil e quebra sob impactos leves sob frio severo. Use TPU ou PETG.";
      } else if (exposure === "quimico") {
        alertType = "warning";
        alertText =
          "⚠️ ATENÇÃO: PLA absorve água e sofre hidrólise (degradação lenta) se exposto a umidade constante.";
      } else {
        alertType = "success";
        alertText =
          "✅ COMPATÍVEL: PLA é excelente para uso interno geral. Rígido, muito fácil de imprimir, com excelente visual.";
      }
      break;

    case "petg":
      if (exposure === "uv") {
        alertType = "warning";
        alertText =
          "⚠️ ATENÇÃO: O PETG tem resistência moderada ao sol, mas pode descolorir em longo prazo. Para sol forte, prefira ASA.";
      } else if (exposure === "calor") {
        alertType = "warning";
        alertText =
          "⚠️ ATENÇÃO: PETG suporta até ~75°C. Excelente para calor moderado, mas deforma sob temperaturas mais altas.";
      } else if (exposure === "frio") {
        alertType = "success";
        alertText =
          "✅ COMPATÍVEL: PETG mantém boa tenacidade e resistência ao impacto em temperaturas baixas.";
      } else if (exposure === "quimico") {
        alertType = "success";
        alertText =
          "✅ COMPATÍVEL: PETG possui excelente resistência a ácidos diluídos, sais e água constante.";
      } else {
        alertType = "success";
        alertText =
          "✅ COMPATÍVEL: PETG é resistente, com boa flexibilidade e excelente adesão de camadas.";
      }
      break;

    case "abs":
      if (exposure === "uv") {
        alertType = "danger";
        alertText =
          "⚠️ CRÍTICO: ABS sofre degradação UV rápida (amarela e trinca sob sol constante). Para sol, use ASA!";
      } else if (exposure === "calor") {
        alertType = "success";
        alertText =
          "✅ COMPATÍVEL: ABS suporta até ~100°C sem deformação térmica. Ideal para peças técnicas quentes.";
      } else if (exposure === "frio") {
        alertType = "warning";
        alertText =
          "⚠️ ATENÇÃO: ABS pode sofrer trincas de encolhimento sob frio extremo sob carga pesada.";
      } else if (exposure === "quimico") {
        alertType = "warning";
        alertText =
          "⚠️ ATENÇÃO: ABS é solúvel em acetona e outros solventes orgânicos. Evite contato químico pesado.";
      } else {
        alertType = "success";
        alertText =
          "✅ COMPATÍVEL: ABS é robusto e resistente a impactos, porém exige cabine fechada para imprimir.";
      }
      break;

    case "asa":
      if (exposure === "uv") {
        alertType = "success";
        alertText =
          "✅ COMPATÍVEL: ASA possui aditivos anti-UV de alta performance. O melhor filamento para uso ao ar livre!";
      } else if (exposure === "calor") {
        alertType = "success";
        alertText =
          "✅ COMPATÍVEL: ASA resiste até ~95°C. Excelente resistência térmica e mecânica externa.";
      } else if (exposure === "frio") {
        alertType = "success";
        alertText =
          "✅ COMPATÍVEL: ASA resiste muito bem ao clima frio e intempéries sem perder integridade.";
      } else if (exposure === "quimico") {
        alertType = "warning";
        alertText =
          "⚠️ ATENÇÃO: ASA resiste a umidade, mas é vulnerável a solventes industriais e acetona.";
      } else {
        alertType = "success";
        alertText =
          "✅ COMPATÍVEL: Excelente resistência climática e UV, ideal para peças automotivas e de jardim.";
      }
      break;

    case "tpu":
      if (exposure === "uv") {
        alertType = "warning";
        alertText =
          "⚠️ ATENÇÃO: TPU pode descolorir levemente sob radiação solar de longo prazo, mas mantém flexibilidade.";
      } else if (exposure === "calor") {
        alertType = "warning";
        alertText =
          "⚠️ ATENÇÃO: TPU amolece perto de 60°C-70°C. Evite uso estrutural sob calor extremo.";
      } else if (exposure === "frio") {
        alertType = "success";
        alertText =
          "✅ COMPATÍVEL: TPU permanece flexível e inquebrável mesmo em temperaturas abaixo de zero.";
      } else if (exposure === "quimico") {
        alertType = "success";
        alertText =
          "✅ COMPATÍVEL: Excelente resistência a óleos, graxas e hidrocarbonetos. Perfeito para vedações e juntas.";
      } else {
        alertType = "success";
        alertText =
          "✅ COMPATÍVEL: TPU é elástico, extremamente tenaz, resistente à abrasão e quase indestrutível.";
      }
      break;

    case "nylon":
      if (exposure === "uv") {
        alertType = "warning";
        alertText =
          "⚠️ ATENÇÃO: Nylon perde propriedades sob exposição UV direta e prolongada se não tiver aditivos de carbono.";
      } else if (exposure === "calor") {
        alertType = "success";
        alertText =
          "✅ COMPATÍVEL: Nylon suporta até ~120°C sob baixa carga. Altíssima durabilidade térmica.";
      } else if (exposure === "frio") {
        alertType = "success";
        alertText =
          "✅ COMPATÍVEL: Nylon retém excelente resistência ao impacto e flexibilidade em frio extremo.";
      } else if (exposure === "quimico") {
        alertType = "success";
        alertText =
          "✅ COMPATÍVEL: Excelente resistência química geral a óleos, combustíveis e solventes comuns.";
      } else {
        alertType = "success";
        alertText =
          "✅ COMPATÍVEL: Perfeito para engrenagens e buchas de alto desgaste. Extremamente tenaz, mas absorve muita umidade (secar antes de imprimir!).";
      }
      break;
  }

  // 2. Base parameters logic
  let layerHeight = "0,20 mm";
  let wallCount = "3";
  let infillDensity = "15%";
  let infillPattern = "Giroide (Gyroid)";
  let seamPosition = "Aligned (Alinhada)";
  let tempNozzle = "210 °C";
  let tempBed = "60 °C";
  let coolingFan = "100%";
  let brimType = "Desativado";

  // Adjust parameters based on part application type
  if (type === "estrutural") {
    wallCount = "4";
    infillDensity = "30%";
    infillPattern = "Giroide (Gyroid)";
    seamPosition = "Aligned (Alinhada)";
  } else if (type === "decorativa") {
    wallCount = "2";
    infillDensity = "10%";
    infillPattern = "Relâmpago (Lightning)";
    seamPosition = "Rear (Traseira)";
    if (size === "grande") {
      layerHeight = "0,16 mm";
    } else {
      layerHeight = "0,12 mm";
    }
  } else if (type === "prototipo") {
    wallCount = "2";
    infillDensity = "10%";
    infillPattern = "Grade (Grid)";
    seamPosition = "Nearest (Mais próxima)";
    layerHeight = "0,28 mm";
  } else if (type === "flexivel") {
    wallCount = "3";
    infillDensity = "20%";
    infillPattern = "Concéntrico (Concentric)";
    seamPosition = "Aligned (Alinhada)";
  }

  // Override by part size
  if (size === "pequena" && type !== "decorativa") {
    layerHeight = "0,12 mm";
  } else if (size === "grande" && type !== "decorativa") {
    layerHeight = "0,24 mm";
    if (type === "estrutural") {
      wallCount = "5";
      infillDensity = "40%";
    }
  }

  // Overwrite temperatures & cooling by filament
  switch (filament) {
    case "pla":
      tempNozzle = "210 °C";
      tempBed = "60 °C";
      coolingFan = "100%";
      brimType = "Desativado";
      break;
    case "petg":
      tempNozzle = "240 °C";
      tempBed = "80 °C";
      coolingFan = "40%";
      brimType = size === "grande" ? "Brim Automático" : "Desativado";
      break;
    case "abs":
      tempNozzle = "260 °C";
      tempBed = "100 °C";
      coolingFan = "15% (Requer Cabine)";
      brimType = "Brim Automático (Alto Warping)";
      break;
    case "asa":
      tempNozzle = "260 °C";
      tempBed = "100 °C";
      coolingFan = "20% (Requer Cabine)";
      brimType = "Brim Automático (Alto Warping)";
      break;
    case "tpu":
      tempNozzle = "230 °C";
      tempBed = "50 °C";
      coolingFan = "80% (Velocidade < 30mm/s)";
      brimType = "Desativado";
      break;
    case "nylon":
      tempNozzle = "280 °C";
      tempBed = "100 °C";
      coolingFan = "10% (Altamente Higroscópico)";
      brimType = "Brim Manual (Warping Extremo)";
      break;
  }

  return {
    layerHeight,
    wallCount,
    infillDensity,
    infillPattern,
    seamPosition,
    tempNozzle,
    tempBed,
    coolingFan,
    brimType,
    description: `Ajuste focado em peça ${type} de tamanho ${size} impressa em ${filament.toUpperCase()} exposta a clima ${exposure}.`,
    filamentAlert: {
      type: alertType,
      text: alertText,
    },
  };
};

const tabIcons: Record<string, React.ReactNode> = {
  qualidade: <Layers size={13} />,
  resistencia: <Package size={13} />,
  velocidade: <Cpu size={13} />,
  suporte: <Sliders size={13} />,
  multimaterial: <Settings size={13} />,
  outros: <Sliders size={13} />,
};

const tabLabels: Record<string, string> = {
  qualidade: "Qualidade",
  resistencia: "Resistência",
  velocidade: "Velocidade",
  suporte: "Suporte",
  multimaterial: "Multimaterial",
  outros: "Outros",
};

const getOptimalUsageForConfig = (
  item: CourseItem,
  filament: string,
  partType: string,
  nozzleSize: string,
  optimizationGoal: "balanced" | "speed" | "economy" | "quality",
): string => {
  const options = item.content.options || [];
  if (options.length === 0) {
    if (item.type === "checkbox") {
      if (item.id === "ironing" || item.id?.includes("alisamento")) {
        if (partType === "decorativa" || optimizationGoal === "quality") {
          return "Habilitar recurso";
        }
        return "Desabilitar recurso";
      }
      if (item.id?.includes("suporte") || item.id?.includes("support")) {
        return "Desabilitar recurso";
      }
      return "Desabilitar recurso";
    }
    return "Padrão";
  }

  let bestOption = options[0];
  let highestScore = -999;

  for (const opt of options) {
    let score = 0;
    const usoLower = opt.uso.toLowerCase();
    const resLower = opt.resultado.toLowerCase();
    const valLower = opt.value.toLowerCase();
    const combinedText = `${usoLower} ${resLower} ${valLower}`;

    // --- BASE CORRESPONDENCE WITH OPTIMIZATION GOAL ---
    if (optimizationGoal === "speed") {
      if (
        combinedText.includes("rápido") ||
        combinedText.includes("rascunho") ||
        combinedText.includes("draft") ||
        combinedText.includes("acelera") ||
        combinedText.includes("menos passadas") ||
        combinedText.includes("velocidade")
      ) {
        score += 15;
      }
      if (
        combinedText.includes("lento") ||
        combinedText.includes("qualidade máxima") ||
        combinedText.includes("precisão máxima")
      ) {
        score -= 10;
      }
    } else if (optimizationGoal === "economy") {
      if (
        combinedText.includes("economia") ||
        combinedText.includes("economizar") ||
        combinedText.includes("menos material") ||
        combinedText.includes("menor consumo") ||
        combinedText.includes("fácil remover") ||
        combinedText.includes("baixo consumo")
      ) {
        score += 15;
      }
      if (
        combinedText.includes("sólido") ||
        combinedText.includes("reforço") ||
        combinedText.includes("máxima resistência") ||
        combinedText.includes("100%")
      ) {
        score -= 10;
      }
    } else if (optimizationGoal === "quality") {
      if (
        combinedText.includes("qualidade") ||
        combinedText.includes("estética") ||
        combinedText.includes("liso") ||
        combinedText.includes("visual") ||
        combinedText.includes("detalhe") ||
        combinedText.includes("espelhado") ||
        combinedText.includes("precisão")
      ) {
        score += 15;
      }
      if (
        combinedText.includes("rascunho") ||
        combinedText.includes("draft") ||
        combinedText.includes("baixa qualidade") ||
        combinedText.includes("rústico")
      ) {
        score -= 15;
      }
    }

    // --- BASE CORRESPONDENCE WITH PART TYPE ---
    if (partType === "decorativa") {
      if (
        combinedText.includes("visual") ||
        combinedText.includes("estética") ||
        combinedText.includes("liso") ||
        combinedText.includes("detalhe") ||
        combinedText.includes("textura")
      ) {
        score += 12;
      }
      if (
        combinedText.includes("rascunho") ||
        combinedText.includes("estrutural") ||
        combinedText.includes("máxima resistência")
      ) {
        score -= 5;
      }
    } else if (partType === "estrutural") {
      if (
        combinedText.includes("estrutural") ||
        combinedText.includes("resistência") ||
        combinedText.includes("força") ||
        combinedText.includes("reforço") ||
        combinedText.includes("robusto") ||
        combinedText.includes("sólido")
      ) {
        score += 12;
      }
      if (
        combinedText.includes("detalhe") ||
        combinedText.includes("estética") ||
        combinedText.includes("frágil")
      ) {
        score -= 5;
      }
    } else if (partType === "prototipo") {
      if (
        combinedText.includes("rápido") ||
        combinedText.includes("rascunho") ||
        combinedText.includes("rascunhos") ||
        combinedText.includes("draft") ||
        combinedText.includes("velocidade")
      ) {
        score += 15;
      }
      if (
        combinedText.includes("lento") ||
        combinedText.includes("máxima qualidade") ||
        combinedText.includes("ironing") ||
        combinedText.includes("detalhado")
      ) {
        score -= 10;
      }
    } else if (partType === "flexivel") {
      if (
        combinedText.includes("flexível") ||
        combinedText.includes("tpu") ||
        combinedText.includes("tenacidade")
      ) {
        score += 15;
      }
    }

    // --- FILAMENT-SPECIFIC RULES ---
    if (filament === "tpu") {
      if (
        combinedText.includes("tpu") ||
        combinedText.includes("flexível") ||
        combinedText.includes("sem retração")
      ) {
        score += 10;
      }
      if (item.id === "first-layer-height" && combinedText.includes("niveladas")) {
        score += 12;
      }
    } else if (filament === "abs" || filament === "asa" || filament === "nylon") {
      if (
        combinedText.includes("warping") ||
        combinedText.includes("adesão máxima") ||
        combinedText.includes("brim manual") ||
        combinedText.includes("cabine")
      ) {
        score += 10;
      }
      if (
        item.id === "first-layer-height" &&
        (combinedText.includes("regulares") ||
          combinedText.includes("irregulares") ||
          combinedText.includes("máxima"))
      ) {
        score += 8;
      }
    }

    // --- NOZZLE SIZE RULES ---
    const nozzleNum = parseFloat(nozzleSize);
    if (nozzleNum <= 0.3) {
      if (
        combinedText.includes("detalhe") ||
        combinedText.includes("miniaturas") ||
        combinedText.includes("pequenos") ||
        combinedText.includes("joias") ||
        combinedText.includes("fino")
      ) {
        score += 10;
      }
    } else if (nozzleNum >= 0.6) {
      if (
        combinedText.includes("estrutural") ||
        combinedText.includes("grosso") ||
        combinedText.includes("rápido") ||
        combinedText.includes("grandes")
      ) {
        score += 10;
      }
    }

    // --- DEFAULT/PADRÃO TIE BREAKER ---
    if (combinedText.includes("padrão") || combinedText.includes("padrao")) {
      score += 2;
    }

    if (score > highestScore) {
      highestScore = score;
      bestOption = opt;
    }
  }

  return bestOption.uso;
};

const getMelhoraResumo = (id: string, label: string, porQueAjustar: string): string => {
  const lowerId = id.toLowerCase();

  // High fidelity explicit mappings for OrcaSlicer/Bambu Studio course parameters
  if (lowerId === "layer-height") return "Resolução e acabamento Z";
  if (lowerId === "first-layer-height") return "Adesão inicial na mesa";
  if (lowerId === "line-width-default") return "Resistência estrutural geral";
  if (lowerId === "line-width-first-layer") return "Adesão física da base";
  if (lowerId === "line-width-outer-wall") return "Estética da parede externa";
  if (lowerId === "line-width-inner-wall") return "Resistência interna paredes";
  if (lowerId === "line-width-top") return "Fechamento suave do topo";
  if (lowerId === "line-width-sparse-infill") return "Velocidade de preenchimento";
  if (lowerId === "line-width-solid-infill") return "Robustez de camadas cheias";
  if (lowerId === "wall-count" || lowerId === "wall-loops") return "Resistência ao impacto";
  if (lowerId === "infill-density") return "Rigidez contra compressão";
  if (lowerId === "infill-pattern" || lowerId.includes("sparse-infill-pattern"))
    return "Resistência isotrópica 3D";

  if (lowerId.includes("brim-type")) return "Prevenção contra empenamento";
  if (lowerId.includes("brim-width")) return "Fixação anti-descolamento";
  if (lowerId.includes("draft-shield")) return "Controle de calor na cabine";
  if (lowerId.includes("seam-position")) return "Disfarce visual de cicatriz";
  if (lowerId.includes("wipe-speed")) return "Eliminação de fiapos";
  if (lowerId === "xy-hole-compensation") return "Precisão de furos e eixos";
  if (lowerId === "xy-contour-compensation") return "Ajuste dimensional externo";
  if (lowerId === "elephant-foot-compensation") return "Encaixe livre na base";
  if (lowerId === "arc-fitting") return "Suavidade de curvas";
  if (lowerId.includes("ironing-type") || lowerId.includes("ironing"))
    return "Acabamento espelhado superior";
  if (lowerId.includes("wall-generator")) return "Impressão de detalhes finos";
  if (lowerId.includes("wall-order")) return "Estética externa perfeita";
  if (lowerId.includes("bridge-flow")) return "Pontes retas e sem queda";
  if (lowerId.includes("detect-overhangs")) return "Saliências bem resfriadas";
  if (lowerId.includes("top-layers") || lowerId.includes("top-shell-thickness"))
    return "Fechamento de teto sem pillowing";
  if (lowerId.includes("bottom-layers")) return "Base forte impermeável";
  if (lowerId.includes("bed-temp") || lowerId.includes("bed-temperature"))
    return "Adesão térmica da resina";

  if (lowerId.includes("speed") || lowerId.includes("velocidade")) {
    if (lowerId.includes("first") || lowerId.includes("primeira"))
      return "Ancoragem segura da base";
    if (lowerId.includes("outer") || lowerId.includes("externa"))
      return "Acabamento visual premium";
    if (lowerId.includes("inner") || lowerId.includes("interna"))
      return "Produtividade de impressão";
    return "Redução do tempo de fatiamento";
  }
  if (lowerId.includes("support") || lowerId.includes("suporte")) {
    if (lowerId.includes("interface") || lowerId.includes("contato"))
      return "Fácil remoção sem marcas";
    return "Suporte robusto estável";
  }

  // General heuristic from porQueAjustar
  const text = porQueAjustar.toLowerCase();
  if (text.includes("adesão") || text.includes("descola") || text.includes("aderir"))
    return "Adesão base";
  if (
    text.includes("estética") ||
    text.includes("aparência") ||
    text.includes("visual") ||
    text.includes("acabamento")
  )
    return "Estética visual";
  if (
    text.includes("resistência") ||
    text.includes("resistente") ||
    text.includes("forte") ||
    text.includes("robusto")
  )
    return "Resistência mecânica";
  if (text.includes("tempo") || text.includes("rápido") || text.includes("velocidade"))
    return "Tempo impressão";
  if (text.includes("precisão") || text.includes("detalhe")) return "Detalhes finos";

  return "Otimização da peça";
};

const getPioraResumo = (
  id: string,
  label: string,
  oQueInfluencia: string,
  porQueAjustar: string,
): string => {
  const lowerId = id.toLowerCase();

  if (lowerId === "layer-height") return "Tempo total de impressão";
  if (lowerId === "first-layer-height") return "Surgimento de rebarbas";
  if (lowerId === "line-width-default") return "Resolução em cantos finos";
  if (lowerId === "line-width-first-layer") return "Pé de elefante na base";
  if (lowerId === "line-width-outer-wall") return "Adesão entre perímetros";
  if (lowerId === "line-width-inner-wall") return "Uso excessivo de filamento";
  if (lowerId === "line-width-top") return "Tempo total de topo";
  if (lowerId === "line-width-sparse-infill") return "Fragilidade interna do infill";
  if (lowerId === "line-width-solid-infill") return "Gasto de material e tempo";
  if (lowerId === "wall-count" || lowerId === "wall-loops") return "Tempo total e peso da peça";
  if (lowerId === "infill-density") return "Gasto de filamento e tempo";
  if (lowerId === "infill-pattern" || lowerId.includes("sparse-infill-pattern"))
    return "Vibração mecânica do cabeçote";

  if (lowerId.includes("brim-type")) return "Tempo extra de acabamento pós";
  if (lowerId.includes("brim-width")) return "Remoção manual de rebarbas";
  if (lowerId.includes("draft-shield")) return "Tempo e filamento desperdiçados";
  if (lowerId.includes("seam-position")) return "Tempo de tráfego de bico";
  if (lowerId.includes("wipe-speed")) return "Risco de desgaste de bico";
  if (lowerId === "xy-hole-compensation") return "Ajuste de tolerância externa";
  if (lowerId === "xy-contour-compensation") return "Tolerância de furos internos";
  if (lowerId === "elephant-foot-compensation") return "Linhas fracas na primeira camada";
  if (lowerId === "arc-fitting") return "Compatibilidade com G-code antigo";
  if (lowerId.includes("ironing-type") || lowerId.includes("ironing"))
    return "Aumento do tempo de impressão";
  if (lowerId.includes("wall-generator")) return "Variação de fluxo volumétrico";
  if (lowerId.includes("wall-order")) return "Risco de overhang caótico";
  if (lowerId.includes("bridge-flow")) return "Adesão na quina inicial";
  if (lowerId.includes("detect-overhangs")) return "Pequeno acréscimo de tempo";
  if (lowerId.includes("top-layers") || lowerId.includes("top-shell-thickness"))
    return "Tempo extra e consumo de material";
  if (lowerId.includes("bottom-layers")) return "Gasto de plástico desnecessário";
  if (lowerId.includes("bed-temp") || lowerId.includes("bed-temperature"))
    return "Aumento do consumo elétrico";

  if (lowerId.includes("speed") || lowerId.includes("velocidade")) {
    if (lowerId.includes("first") || lowerId.includes("primeira")) return "Aumento do tempo total";
    if (lowerId.includes("outer") || lowerId.includes("externa")) return "Tempo de impressão maior";
    if (lowerId.includes("inner") || lowerId.includes("interna"))
      return "Risco de delaminação de camada";
    return "Ondulações superficiais (Ghosting)";
  }
  if (lowerId.includes("support") || lowerId.includes("suporte")) {
    if (lowerId.includes("interface") || lowerId.includes("contato"))
      return "Tempo extra para trocar ferramenta";
    return "Tempo extra de suporte e plástico";
  }

  // General heuristic
  const text = (oQueInfluencia + " " + porQueAjustar).toLowerCase();
  if (text.includes("pé de elefante") || text.includes("elefante")) return "Pé de elefante";
  if (text.includes("tempo") || text.includes("lento")) return "Tempo de impressão";
  if (
    text.includes("custo") ||
    text.includes("filamento") ||
    text.includes("material") ||
    text.includes("gasta")
  )
    return "Consumo filamento";
  if (
    text.includes("estética") ||
    text.includes("aparência") ||
    text.includes("visual") ||
    text.includes("feio")
  )
    return "Qualidade visual";
  if (text.includes("resistência") || text.includes("frágil") || text.includes("quebra"))
    return "Resistência impacto";
  if (text.includes("detalhe") || text.includes("resolução")) return "Resolução fina";

  return "Acréscimo de tempo";
};

const getErroResumo = (id: string, label: string, oQueGera: string): string => {
  const lowerId = id.toLowerCase();

  // Comprehensive, explicit error/defect mappings when a parameter is incorrect
  if (lowerId === "layer-height") return "Efeito escada / Baixa solda Z";
  if (lowerId === "first-layer-height") return "Não adesão / Pé de elefante";
  if (lowerId === "line-width-default") return "Fragilidade geral / Subextrusão";
  if (lowerId === "line-width-first-layer") return "Pé de elefante / Descolamento";
  if (lowerId === "line-width-outer-wall") return "Superfície rugosa / Voids";
  if (lowerId === "line-width-inner-wall") return "Fragilidade nas paredes";
  if (lowerId === "line-width-top") return "Frestas no topo / Pillowing";
  if (lowerId === "line-width-sparse-infill") return "Preenchimento quebrado";
  if (lowerId === "line-width-solid-infill") return "Excesso material / Bolhas";
  if (lowerId === "wall-count") return "Peça frágil / Quebra fácil";
  if (lowerId === "infill-density") return "Infill fraco / Pillowing";
  if (lowerId === "infill-pattern" || lowerId.includes("sparse-infill-pattern"))
    return "Vibração mecânica / Fragilidade";
  if (lowerId.includes("brim-type")) return "Descolamento total / Warping";
  if (lowerId.includes("brim-width")) return "Empenamento base / Warping";
  if (lowerId.includes("draft-shield")) return "Warping térmico / Trinca ABS";
  if (lowerId.includes("seam-position")) return "Costura visível / Cicatriz";
  if (lowerId.includes("wipe-speed")) return "Fiapos e Babas (Stringing)";
  if (lowerId === "xy-hole-compensation") return "Furo menor que o CAD";
  if (lowerId === "xy-contour-compensation") return "Encaixe impreciso dimensional";
  if (lowerId === "elephant-foot-compensation") return "Pé de elefante na base";
  if (lowerId === "arc-fitting") return "Curvas engasgadas (Facetadas)";
  if (lowerId.includes("ironing-type") || lowerId.includes("ironing"))
    return "Topo áspero e com sulcos";
  if (lowerId.includes("wall-generator")) return "Lacunas em detalhes finos";
  if (lowerId.includes("wall-order")) return "Estética ruim / Overhangs caídos";
  if (lowerId.includes("bridge-flow")) return "Ponte caída / Flacidez";
  if (lowerId.includes("detect-overhangs")) return "Overhang deformado / Caído";
  if (lowerId.includes("top-layers") || lowerId.includes("top-shell-thickness"))
    return "Pillowing (Bolhas no topo)";
  if (lowerId.includes("bottom-layers")) return "Base fraca / Voids internos";
  if (lowerId.includes("bed-temp") || lowerId.includes("bed-temperature"))
    return "Descolamento de mesa / Warping";

  if (lowerId.includes("speed") || lowerId.includes("velocidade")) {
    if (lowerId.includes("first") || lowerId.includes("primeira")) return "Peça descolando da mesa";
    if (lowerId.includes("outer") || lowerId.includes("externa"))
      return "Vibração (Ghosting) / Ondulações";
    if (lowerId.includes("inner") || lowerId.includes("interna")) return "Delaminação / Bolhas";
    return "Subextrusão / Falhas";
  }
  if (lowerId.includes("support") || lowerId.includes("suporte")) {
    if (lowerId.includes("interface") || lowerId.includes("contato"))
      return "Suporte grudado / Marcas";
    return "Queda do suporte / Impressão no ar";
  }

  // Heuristic fallbacks
  if (!oQueGera) return "Valor inadequado";
  const lowerGera = oQueGera.toLowerCase();
  if (lowerGera.includes("pé de elefante") || lowerGera.includes("elefante"))
    return "Pé de elefante";
  if (
    lowerGera.includes("descola") ||
    lowerGera.includes("solta") ||
    lowerGera.includes("descolamento")
  )
    return "Peça descolando";
  if (
    lowerGera.includes("fragilidade") ||
    lowerGera.includes("frágil") ||
    lowerGera.includes("quebra") ||
    lowerGera.includes("fraca")
  )
    return "Paredes frágeis";
  if (lowerGera.includes("entupir") || lowerGera.includes("entupimento")) return "Entupimento bico";
  if (
    lowerGera.includes("fiapos") ||
    lowerGera.includes("teias") ||
    lowerGera.includes("stringing")
  )
    return "Teias de fios (Stringing)";
  if (
    lowerGera.includes("buraco") ||
    lowerGera.includes("lacuna") ||
    lowerGera.includes("fenda") ||
    lowerGera.includes("buracos") ||
    lowerGera.includes("pillow")
  )
    return "Pillowing / Buracos no topo";
  if (lowerGera.includes("estria") || lowerGera.includes("marca")) return "Marcas na peça";
  if (
    lowerGera.includes("empenamento") ||
    lowerGera.includes("warping") ||
    lowerGera.includes("levanta")
  )
    return "Warping (Empenamento)";

  // Check if it's actually an error text, if not leave empty
  if (
    lowerGera.includes("geram") ||
    lowerGera.includes("causam") ||
    lowerGera.includes("criam") ||
    lowerGera.includes("erro") ||
    lowerGera.includes("defeito") ||
    lowerGera.includes("risco") ||
    lowerGera.includes("ruim") ||
    lowerGera.includes("falha")
  ) {
    if (lowerGera.includes("frágil") || lowerGera.includes("frágeis")) return "Peça frágil";
    if (lowerGera.includes("descola")) return "Descolamento";
    if (lowerGera.includes("ruim")) return "Acabamento ruim";

    const words = oQueGera
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .split(/\s+/)
      .slice(0, 2)
      .join(" ");
    return words;
  }

  return "Erro de fatiamento";
};

const SPEED_QUALITY_SCORES: Record<string, Record<string, number>> = {
  "layer-height": {
    "Miniaturas, joias": 90,
    "Peças visuais": 75,
    "Peças padrão c/ detalhe": 60,
    "Uso geral — PADRÃO": 50,
    "Protótipos grandes": 35,
    Rascunhos: 15,
  },
  "first-layer-height": {
    "Mesas perfeitamente niveladas": 75,
    "Mesas com leve desnível": 65,
    "Mesas irregulares": 50,
    "Problemas graves de nivelamento": 35,
  },
  "line-width-default": {
    "Detalhes muito finos, textos pequenos": 80,
    "Precisão máxima": 70,
    "Uso geral": 50,
    Reforço: 40,
    Rápido: 30,
    Estrutural: 15,
  },
  "line-width-first-layer": {
    "Mesas perfeitas": 75,
    "Mesas boas": 65,
    "Mesas regulares": 50,
    "Mesas irregulares": 35,
  },
  "line-width-outer-wall": {
    "Miniaturas, joias, textos": 85,
    "Alta qualidade": 70,
    "Uso geral": 50,
    "Estruturais, protótipos": 30,
  },
  "line-width-inner-wall": {
    "Visual consistente": 70,
    "Bom equilíbrio": 60,
    "Maior resistência": 50,
    "Máxima resistência": 40,
  },
  "line-width-top": {
    "Ideal p/ Ironing": 85,
    "Alta qualidade": 75,
    "Consistência com a parede": 60,
  },
  "line-width-sparse-infill": {
    "Máxima precisão": 40,
    "Aceleração padrão": 60,
    "Aceleração extrema": 75,
  },
  "line-width-solid-infill": {
    "Topo espelhado, ideal p/ Ironing": 80,
    "Consistência com parede externa": 65,
    "Mais rápido, menos detalhe": 50,
  },
  "line-width-support": {
    Fino: 60,
    "Equilíbrio estabilidade × remoção": 50,
    "Suporte muito estável": 40,
  },
  "line-width-bridge": {
    "Vãos > 80 mm com risco de queda": 75,
    "Vãos 30–80 mm": 65,
    "Vãos < 30 mm, pontes estruturais": 50,
  },
  "seam-position": {
    "Peças com cantos": 50,
    "Peças com face oculta": 55,
    "Peças técnicas": 35,
    "Cilindros, esferas, vasos": 15,
  },
  "scarf-seam": {
    Padrão: 50,
    "Vasos, cilindros": 75,
    "Máxima invisibilidade": 90,
  },
  "staggered-seam": {
    Padrão: 50,
    "Peças estruturais": 65,
  },
  "seam-gap": {
    "Materiais muito fluidos": 60,
    "Uso geral": 50,
    "Materiais que escorrem (PETG, TPU)": 40,
  },
  "wipe-speed": {
    "Materiais com stringing (PETG, TPU)": 65,
    "Uso geral": 50,
    "PLA bem calibrado": 40,
  },
  "wipe-speed-role-based": {
    Ativado: 60,
    Desativado: 45,
  },
  "wipe-on-loops": {
    Ativado: 55,
    Desativado: 50,
  },
  "wipe-before-outer-wall": {
    Ativado: 70,
    Desativado: 50,
  },
  "xy-hole-compensation": {
    "Peças sem furos ou tolerâncias largas": 50,
    "+0,05 mm": 70,
    "+0,10 mm": 80,
    "+0,15–0,20 mm": 90,
  },
  "xy-contour-compensation": {
    "Peças isoladas, sem encaixe": 50,
    "−0,05 mm": 75,
    "−0,10 mm": 85,
    "+0,05 mm": 65,
  },
  "elephant-foot-compensation": {
    "Peças pequenas ou já dimensionadas no CAD": 40,
    "Uso geral": 60,
    "Peças grandes, ABS": 75,
    "Peças muito grandes, materiais que contraem": 90,
  },
  "arc-fitting": {
    "Peças com curvas, firmwares modernos": 80,
    "Peças angulares ou firmware antigo sem G2/G3": 50,
  },
  "bridge-flow": {
    "Vãos longos (>50mm)": 75,
    "Vãos médios (30–50mm)": 60,
    "Vãos curtos (<30mm)": 50,
  },
  "extra-overhang-walls": {
    "Overhangs leves (<45°)": 50,
    "Overhangs médios (45–60°)": 65,
    "Overhangs severos (>60°)": 80,
  },
  "ironing-type": {
    "Peças estruturais, economia de tempo": 50,
    "Padrão — peças com topo visível": 75,
    "Peças com várias faces planas": 85,
    "Casos especiais, peças pequenas": 90,
  },
  "wall-generator": {
    "Peças simples, estruturais, furos com dimensão precisa": 50,
    "Detalhes finos, textos em relevo, engrenagens, paredes <1mm": 65,
  },
  "wall-order": {
    "Melhor qualidade visual e dimensional": 50,
    "Melhor resistência estrutural": 40,
    "Mecanismos com tolerâncias precisas": 60,
  },
  "infill-first": {
    "Peças com infill muito denso, foco em velocidade": 35,
    "Uso geral, melhor qualidade visual": 50,
  },
  "detect-overhangs": {
    "Peças com curvas, esferas, ângulos": 60,
    "Peças sem overhangs (caixas retas)": 40,
  },
  "wall-count": {
    "Peças decorativas, vasos": 85,
    "Peças leves, decorativas": 70,
    "Uso geral, boa resistência": 50,
    "Peças funcionais e robustas": 30,
    "Peças mecânicas de alta carga": 15,
  },
  "wall-alternating-extra": {
    "Desativado — PADRÃO": 50,
    Ativado: 55,
  },
  "detect-thin-walls": {
    "Desativado — PADRÃO": 50,
    Ativado: 65,
  },
  "top-layers": {
    "Peças descartáveis, protótipos": 75,
    "Mínimo aceitável": 60,
    "Uso geral": 50,
    "Topos visíveis com qualidade": 30,
  },
  "bottom-layers": {
    Mínimo: 65,
    "Uso geral": 50,
    "Peças grandes, materiais que warpam": 35,
  },
  "top-shell-thickness": {
    "0,6–0,8 mm": 40,
    "1 mm — PADRÃO": 50,
    "1,2–1,5 mm": 65,
  },
  "top-surface-density": {
    "80–90%": 40,
    "100% — PADRÃO": 50,
  },
  "top-surface-pattern": {
    Rectilinear: 45,
    "Linha Monotônica — PADRÃO": 50,
    Concentrica: 55,
  },
  "bottom-shell-thickness": {
    "0 mm — PADRÃO": 50,
    "0,6–1 mm": 60,
  },
  "bottom-surface-density": {
    "80–90%": 40,
    "100% — PADRÃO": 50,
  },
  "bottom-surface-pattern": {
    Rectilinear: 45,
    "Monótono — PADRÃO": 50,
  },
  "top-bottom-solid-infill-overlap": {
    "10 %": 45,
    "15 % — PADRÃO": 50,
    "25 %": 60,
  },
  "infill-density": {
    "0–5%": 85,
    "10–15%": 70,
    "15–20% — PADRÃO": 50,
    "25–40%": 35,
    "40–60%": 20,
    "80–100%": 10,
  },
  "infill-pattern": {
    "Peças rápidas, decorativas": 75,
    "Uso geral": 50,
    "Peças de alta resistência": 20,
    "Resistência lateral": 30,
    "Peças com carga complexa": 45,
    "Decorativas, velocidade máxima": 90,
  },
  "infill-direction": {
    "0°": 45,
    "45° — PADRÃO": 50,
    "90°": 45,
    "0°/90°": 55,
  },
  "infill-wall-overlap": {
    "0–10%": 40,
    "15–25% — PADRÃO": 50,
    "30–40%": 60,
    "50%": 65,
  },
  "infill-multiline": {
    "1 — PADRÃO": 50,
    "2": 65,
    "3+": 75,
  },
  "infill-anchor-max": {
    "0 mm": 40,
    "10 mm": 45,
    "20 mm — PADRÃO": 50,
  },
  "infill-anchor-length": {
    "100%": 40,
    "400% — PADRÃO": 50,
    "800%+": 60,
  },
  "internal-solid-infill-pattern": {
    "Retilíneo — PADRÃO": 50,
    Monotônico: 55,
    Grade: 60,
  },
  "solid-infill-direction": {
    "0°": 45,
    "45° — PADRÃO": 50,
    "90°": 45,
  },
  "solid-infill-rotation": {
    "0°": 45,
    "0,90° — PADRÃO": 50,
    "45° ou 90°": 55,
  },
  "bridge-apply-infill": {
    Desativado: 40,
    "Superfícies superiores — PADRÃO": 50,
    "Todas as superfícies": 60,
  },
  "filter-small-gaps": {
    "0 mm — PADRÃO": 50,
    "5–15 mm²": 60,
  },
  "align-infill-direction": {
    "Desativado — PADRÃO": 50,
    Ativado: 60,
  },
  "enable-support-sup": {
    "Peças sem saliências ou anti-suporte": 60,
    "Peças com overhangs > 45°": 40,
  },
  "support-type-sup": {
    "Geometria orgânica, miniaturas, peças com suportes internos": 60,
    "Peças estruturais simples, impressões multimaterial": 40,
    "Ajuste fino à geometria": 50,
  },
  "raft-layers-sup": {
    "Mesas planas e bem calibradas": 60,
    "Mesas irregulares, ABS, Nylon, peças que warpam": 40,
  },
  "brim-type-out": {
    "Uso geral, deixe automático": 50,
    "Visual, warping em paredes externas": 45,
    "Ilhas internas empenando": 48,
    "Máxima adesão (ABS difícil)": 40,
    "PLA com excelente adesão": 55,
  },
  "spiral-vase-out": {
    "Uso geral, peças funcionais": 50,
    "Vasos, luminárias, copos decorativos": 85,
  },
};

const ECONOMY_SCORES: Record<string, Record<string, number>> = {
  "layer-height": {
    "Miniaturas, joias": 30,
    "Peças visuais": 40,
    "Peças padrão c/ detalhe": 45,
    "Uso geral — PADRÃO": 50,
    "Protótipos grandes": 60,
    Rascunhos: 75,
  },
  "first-layer-height": {
    "Mesas perfeitamente niveladas": 55,
    "Mesas com leve desnível": 50,
    "Mesas irregulares": 45,
    "Problemas graves de nivelamento": 35,
  },
  "line-width-default": {
    "Detalhes muito finos, textos pequenos": 45,
    "Precisão máxima": 50,
    "Uso geral": 50,
    Reforço: 55,
    Rápido: 60,
    Estrutural: 65,
  },
  "line-width-first-layer": {
    "Mesas perfeitas": 55,
    "Mesas boas": 50,
    "Mesas regulares": 45,
    "Mesas irregulares": 35,
  },
  "line-width-outer-wall": {
    "Miniaturas, joias, textos": 45,
    "Alta qualidade": 50,
    "Uso geral": 50,
    "Estruturais, protótipos": 55,
  },
  "line-width-inner-wall": {
    "Visual consistente": 50,
    "Bom equilíbrio": 48,
    "Maior resistência": 44,
    "Máxima resistência": 40,
  },
  "line-width-top": {
    "Ideal p/ Ironing": 45,
    "Alta qualidade": 50,
    "Consistência com a parede": 55,
  },
  "line-width-sparse-infill": {
    "Máxima precisão": 40,
    "Aceleração padrão": 50,
    "Aceleração extrema": 60,
  },
  "line-width-solid-infill": {
    "Topo espelhado, ideal p/ Ironing": 40,
    "Consistência com parede externa": 50,
    "Mais rápido, menos detalhe": 60,
  },
  "line-width-support": {
    Fino: 75,
    "Equilíbrio estabilidade × remoção": 50,
    "Suporte muito estável": 35,
  },
  "line-width-bridge": {
    "Vãos > 80 mm com risco de queda": 50,
    "Vãos 30–80 mm": 50,
    "Vãos < 30 mm, pontes estruturais": 50,
  },
  "seam-position": {
    "Peças com cantos": 50,
    "Peças com face oculta": 50,
    "Peças técnicas": 50,
    "Cilindros, esferas, vasos": 50,
  },
  "scarf-seam": {
    Padrão: 50,
    "Vasos, cilindros": 50,
    "Máxima invisibilidade": 50,
  },
  "staggered-seam": {
    Padrão: 50,
    "Peças estruturais": 50,
  },
  "seam-gap": {
    "Materiais muito fluidos": 50,
    "Uso geral": 50,
    "Materiais que escorrem (PETG, TPU)": 50,
  },
  "wipe-speed": {
    "Materiais com stringing (PETG, TPU)": 50,
    "Uso geral": 50,
    "PLA bem calibrado": 50,
  },
  "wipe-speed-role-based": {
    Ativado: 50,
    Desativado: 50,
  },
  "wipe-on-loops": {
    Ativado: 50,
    Desativado: 50,
  },
  "wipe-before-outer-wall": {
    Ativado: 50,
    Desativado: 50,
  },
  "xy-hole-compensation": {
    "Peças sem furos ou tolerâncias largas": 50,
    "+0,05 mm": 50,
    "+0,10 mm": 50,
    "+0,15–0,20 mm": 50,
  },
  "xy-contour-compensation": {
    "Peças isoladas, sem encaixe": 50,
    "−0,05 mm": 50,
    "−0,10 mm": 50,
    "+0,05 mm": 50,
  },
  "elephant-foot-compensation": {
    "Peças pequenas ou já dimensionadas no CAD": 50,
    "Uso geral": 50,
    "Peças grandes, ABS": 50,
    "Peças muito grandes, materiais que contraem": 50,
  },
  "arc-fitting": {
    "Peças com curvas, firmwares modernos": 50,
    "Peças angulares ou firmware antigo sem G2/G3": 50,
  },
  "bridge-flow": {
    "Vãos longos (>50mm)": 50,
    "Vãos médios (30–50mm)": 50,
    "Vãos curtos (<30mm)": 50,
  },
  "extra-overhang-walls": {
    "Overhangs leves (<45°)": 50,
    "Overhangs médios (45–60°)": 40,
    "Overhangs severos (>60°)": 30,
  },
  "ironing-type": {
    "Peças estruturais, economia de tempo": 50,
    "Padrão — peças com topo visível": 40,
    "Peças com várias faces planas": 35,
    "Casos especiais, peças pequenas": 30,
  },
  "wall-generator": {
    "Peças simples, estruturais, furos com dimensão precisa": 50,
    "Detalhes finos, textos em relevo, engrenagens, paredes <1mm": 50,
  },
  "wall-order": {
    "Melhor qualidade visual e dimensional": 50,
    "Melhor resistência estrutural": 50,
    "Mecanismos com tolerâncias precisas": 50,
  },
  "infill-first": {
    "Peças com infill muito denso, foco em velocidade": 50,
    "Uso geral, melhor qualidade visual": 50,
  },
  "detect-overhangs": {
    "Peças com curvas, esferas, angles": 50,
    "Peças sem overhangs (caixas retas)": 50,
  },
  "wall-count": {
    "Peças decorativas, vasos": 90,
    "Peças leves, decorativas": 75,
    "Uso geral, boa resistência": 50,
    "Peças funcionais e robustas": 30,
    "Peças mecânicas de alta carga": 15,
  },
  "wall-alternating-extra": {
    "Desativado — PADRÃO": 50,
    Ativado: 45,
  },
  "detect-thin-walls": {
    "Desativado — PADRÃO": 50,
    Ativado: 50,
  },
  "top-layers": {
    "Peças descartáveis, protótipos": 75,
    "Mínimo aceitável": 60,
    "Uso geral": 50,
    "Topos visíveis com qualidade": 35,
  },
  "bottom-layers": {
    Mínimo: 65,
    "Uso geral": 50,
    "Peças grandes, materiais que warpam": 35,
  },
  "top-shell-thickness": {
    "0,6–0,8 mm": 70,
    "1 mm — PADRÃO": 50,
    "1,2–1,5 mm": 35,
  },
  "top-surface-density": {
    "80–90%": 65,
    "100% — PADRÃO": 50,
  },
  "top-surface-pattern": {
    Rectilinear: 50,
    "Linha Monotônica — PADRÃO": 50,
    Concentrica: 50,
  },
  "bottom-shell-thickness": {
    "0 mm — PADRÃO": 50,
    "0,6–1 mm": 40,
  },
  "bottom-surface-density": {
    "80–90%": 65,
    "100% — PADRÃO": 50,
  },
  "bottom-surface-pattern": {
    Rectilinear: 50,
    "Monótono — PADRÃO": 50,
  },
  "top-bottom-solid-infill-overlap": {
    "10 %": 50,
    "15 % — PADRÃO": 50,
    "25 %": 45,
  },
  "infill-density": {
    "0–5%": 90,
    "10–15%": 70,
    "15–20% — PADRÃO": 50,
    "25–40%": 35,
    "40–60%": 20,
    "80–100%": 10,
  },
  "infill-pattern": {
    "Peças rápidas, decorativas": 50,
    "Uso geral": 50,
    "Peças de alta resistência": 50,
    "Resistência lateral": 45,
    "Peças com carga complexa": 50,
    "Decorativas, velocidade máxima": 85,
  },
  "infill-direction": {
    "0°": 50,
    "45° — PADRÃO": 50,
    "90°": 50,
    "0°/90°": 50,
  },
  "infill-wall-overlap": {
    "0–10%": 55,
    "15–25% — PADRÃO": 50,
    "30–40%": 45,
    "50%": 40,
  },
  "infill-multiline": {
    "1 — PADRÃO": 50,
    "2": 50,
    "3+": 50,
  },
  "infill-anchor-max": {
    "0 mm": 50,
    "10 mm": 50,
    "20 mm — PADRÃO": 50,
  },
  "infill-anchor-length": {
    "100%": 50,
    "400% — PADRÃO": 50,
    "800%+": 50,
  },
  "internal-solid-infill-pattern": {
    "Retilíneo — PADRÃO": 50,
    Monotônico: 50,
    Grade: 45,
  },
  "solid-infill-direction": {
    "0°": 50,
    "45° — PADRÃO": 50,
    "90°": 50,
  },
  "solid-infill-rotation": {
    "0°": 50,
    "0,90° — PADRÃO": 50,
    "45° ou 90°": 50,
  },
  "bridge-apply-infill": {
    Desativado: 50,
    "Superfícies superiores — PADRÃO": 50,
    "Todas as superfícies": 50,
  },
  "filter-small-gaps": {
    "0 mm — PADRÃO": 50,
    "5–15 mm²": 50,
  },
  "align-infill-direction": {
    "Desativado — PADRÃO": 50,
    Ativado: 50,
  },
  "enable-support-sup": {
    "Peças sem saliências ou anti-suporte": 90,
    "Peças com overhangs > 45°": 30,
  },
  "support-type-sup": {
    "Geometria orgânica, miniaturas, peças com suportes internos": 70,
    "Peças estruturais simples, impressões multimaterial": 30,
    "Ajuste fino à geometria": 45,
  },
  "raft-layers-sup": {
    "Mesas planas e bem calibradas": 90,
    "Mesas irregulares, ABS, Nylon, peças que warpam": 35,
  },
  "brim-type-out": {
    "Uso geral, deixe automático": 50,
    "Visual, warping em paredes externas": 45,
    "Ilhas internas empenando": 48,
    "Máxima adesão (ABS difícil)": 35,
    "PLA com excelente adesão": 90,
  },
  "spiral-vase-out": {
    "Uso geral, peças funcionais": 50,
    "Vasos, luminárias, copos decorativos": 95,
  },
};

const calculateSpeedQualityScore = (
  item: CourseItem,
  optionUso: string,
  options: { value: string; uso: string; resultado: string }[],
): { score: number; active: boolean } => {
  const itemScores = SPEED_QUALITY_SCORES[item.id];
  if (!itemScores) {
    return { score: 50, active: false };
  }
  const score = itemScores[optionUso];
  if (score === undefined) {
    return { score: 50, active: false };
  }
  return { score, active: true };
};

const calculateEconomyScore = (
  item: CourseItem,
  optionUso: string,
  options: { value: string; uso: string; resultado: string }[],
): { score: number; active: boolean } => {
  const itemScores = ECONOMY_SCORES[item.id];
  if (!itemScores) {
    return { score: 50, active: false };
  }
  const score = itemScores[optionUso];
  if (score === undefined) {
    return { score: 50, active: false };
  }
  return { score, active: true };
};

const parseNumericValue = (str: string): number | null => {
  if (!str) return null;
  // Extract first floating number (could have decimals or commas)
  const normalized = str.replace(",", ".").replace(/[^\d.-]/g, "");
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? null : parsed;
};

const getValidationClassAndStatus = (
  item: CourseItem,
  currentVal: string,
  optimalVal: string,
  nozzleSize: string,
) => {
  const trimmedCurrent = currentVal.trim().toLowerCase();
  const trimmedOptimal = optimalVal.trim().toLowerCase();

  if (trimmedCurrent === trimmedOptimal) {
    return {
      status: "correct",
      className: "text-[#00C896] border-[#00C896]/30 focus:border-[#00C896] bg-[#00C896]/[0.02]",
    };
  }

  const nozzleNum = parseFloat(nozzleSize) || 0.4;
  const parsedTyped = parseNumericValue(currentVal);
  const parsedOptimal = parseNumericValue(optimalVal);

  const isAbsurdNumeric = (): boolean => {
    if (parsedTyped === null) return true; // non-numeric entered for a numeric field
    if (parsedTyped < 0) return true; // negative values are physically impossible/absurd for these parameters

    const id = item.id.toLowerCase();

    if (id === "layer-height" || id === "first-layer-height" || id === "precise-z-height") {
      return parsedTyped < 0.04 || parsedTyped > 0.8;
    }
    if (
      id.includes("line-width") ||
      id.includes("width") ||
      item.label.toLowerCase().includes("largura da linha")
    ) {
      return parsedTyped < 0.15 || parsedTyped > 2.0;
    }
    if (id === "wall-count" || id === "wall-loops") {
      return parsedTyped < 1 || parsedTyped > 15;
    }
    if (id === "infill-density") {
      return parsedTyped < 0 || parsedTyped > 100;
    }
    if (id === "bed-temp" || id === "bed-temperature" || id.includes("bed-temp")) {
      return parsedTyped < 20 || parsedTyped > 135;
    }
    if (id === "cooling-fan-speed" || id.includes("cooling-fan") || id.includes("fan-speed")) {
      return parsedTyped < 0 || parsedTyped > 100;
    }
    if (
      id.includes("speed") ||
      id.includes("velocity") ||
      item.label.toLowerCase().includes("velocidade")
    ) {
      return parsedTyped < 5 || parsedTyped > 800;
    }
    if (id.includes("temperature") || id.includes("temp")) {
      return parsedTyped < 130 || parsedTyped > 320;
    }
    return false;
  };

  // Determine if it's numeric or text-based
  const id = item.id.toLowerCase();
  const isNumericField =
    id === "layer-height" ||
    id === "first-layer-height" ||
    id.includes("width") ||
    id.includes("density") ||
    id.includes("count") ||
    id.includes("temp") ||
    id.includes("speed") ||
    id.includes("fan") ||
    id.includes("multiplier") ||
    id.includes("ratio") ||
    id.includes("gap") ||
    id.includes("loops");

  let isAbsurd = false;

  if (isNumericField) {
    isAbsurd = isAbsurdNumeric();
  } else {
    // Text options
    const options = item.content.options || [];
    // It's absurd if it's empty, or does not fuzzy-match any of the possible valid values or usages, and is not optimal
    const matchesAnyOption = options.some(
      (opt) =>
        opt.value.toLowerCase().includes(trimmedCurrent) ||
        trimmedCurrent.includes(opt.value.toLowerCase()) ||
        opt.uso.toLowerCase().includes(trimmedCurrent),
    );
    if (!matchesAnyOption && trimmedCurrent !== trimmedOptimal) {
      isAbsurd = true;
    }
  }

  if (isAbsurd) {
    return {
      status: "absurd",
      className:
        "text-red-500 border-red-500/50 bg-red-500/10 focus:border-red-500 font-extrabold animate-pulse",
    };
  }

  // Modified, but safe custom value (Show in Yellow/Gold as customized!)
  return {
    status: "custom",
    className:
      "text-yellow-400 border-yellow-400/50 bg-yellow-400/5 focus:border-yellow-400 font-bold",
  };
};

export function Simulator() {
  const [activeTab, setActiveTab] = useState<string>("qualidade");
  const [viewMode, setViewMode] = useState<"slicer" | "calibration" | "infographic">("slicer");
  const [calibratedFlow, setCalibratedFlow] = useState<string | null>(null);
  const [calibratedPA, setCalibratedPA] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // New configuration and calibration physical inputs
  const [nozzleSize, setNozzleSize] = useState<"0.2" | "0.4" | "0.6" | "0.8">("0.4");
  const [plateType, setPlateType] = useState<string>("pei-texturizada");
  const [printerPreset, setPrinterPreset] = useState<string>("bambu-x1c");
  const [calibFlowRate, setCalibFlowRate] = useState<number>(0.98);
  const [calibPA, setCalibPA] = useState<number>(0.025);
  const [calibMaxVol, setCalibMaxVol] = useState<number>(15);
  const [selectedErrorFilter, setSelectedErrorFilter] = useState<string>("all");

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "altura-camada": true,
    "largura-linha": true,
    costura: true,
    precisao: true,
    alisamento: true,
    "gerador-paredes": true,
    "paredes-superficies": true,
    preenchimento: true,
    "pontes-saliencias": true,
    "primeira-camada-vel": true,
    "outras-camadas-vel": true,
    aceleracao: true,
    "suporte-basico": true,
    "suporte-avancado": true,
    "suporte-arvore": true,
    jangada: true,
    "wipe-tower": true,
    "opcoes-purga": true,
    "adesao-cama": true,
    "modo-especial": true,
    gcode: true,
  });

  const [selectedItem, setSelectedItem] = useState<CourseItem | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Application / Assistant criteria
  const [partType, setPartType] = useState<"estrutural" | "decorativa" | "prototipo" | "flexivel">(
    "estrutural",
  );
  const [partSize, setPartSize] = useState<"pequena" | "media" | "grande">("media");
  const [exposure, setExposure] = useState<"interno" | "uv" | "calor" | "frio" | "quimico">(
    "interno",
  );
  const [filament, setFilament] = useState<"pla" | "petg" | "abs" | "asa" | "tpu" | "nylon">("pla");
  const [optimizationGoal, setOptimizationGoal] = useState<
    "balanced" | "speed" | "economy" | "quality"
  >("balanced");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Locked parameters set manually
  const [lockedParameters, setLockedParameters] = useState<Record<string, boolean>>({});
  const [editedParameters, setEditedParameters] = useState<Record<string, boolean>>({});

  // Core reactive parameters state
  const [parameterValues, setParameterValues] = useState<Record<string, string>>(() => {
    const initialValues: Record<string, string> = {};
    courseTabs.forEach((tab) => {
      tab.groups.forEach((group) => {
        group.items.forEach((item) => {
          initialValues[item.id] = item.value;
        });
      });
    });
    return initialValues;
  });

  // State for user's selected usage of each parameter individually
  // Kept empty on mount so the AI Meta de Otimização (via getInitialUsageForItem)
  // drives what's shown until the user manually picks a usage.
  const [selectedUsages, setSelectedUsages] = useState<Record<string, string>>({});

  // Track the last processed physical inputs to trigger presets only when major parameters are modified
  const [lastInputs, setLastInputs] = useState({
    filament: "pla",
    partType: "estrutural",
    nozzleSize: "0.4",
    optimizationGoal: "balanced",
  });

  // Auto-tuner disabled: keeping user selections static as requested

  // Helper to find initial usage for an item
  const getInitialUsageForItem = (item: CourseItem): string => {
    // Drive the initial selection from the AI Meta de Otimização + material/part/nozzle.
    // This is what makes the "Meta de Otimização IA" dropdown actually change the UI.
    return getOptimalUsageForConfig(item, filament, partType, nozzleSize, optimizationGoal);
  };

  // Helper to get options for an item
  const getItemOptions = (item: CourseItem) => {
    if (item.content.options && item.content.options.length > 0) {
      return item.content.options;
    }
    if (item.type === "checkbox") {
      return [
        { value: "Desativado", uso: "Desabilitar recurso", resultado: "Desativa o comportamento" },
        { value: "Ativado", uso: "Habilitar recurso", resultado: "Ativa o comportamento" },
      ];
    }
    return [{ value: item.value, uso: "Padrão", resultado: "Uso geral recomendado" }];
  };

  // Helper to calculate impact of selected usage on print time and filament consumption
  const getUsagePerformanceImpact = (
    item: CourseItem,
    usageName: string,
  ): { time: "up" | "down" | "neutral"; filament: "up" | "down" | "neutral" } => {
    let time: "up" | "down" | "neutral" = "neutral";
    let filament: "up" | "down" | "neutral" = "neutral";

    const options = getItemOptions(item);
    const selectedOpt = options.find((o) => o.uso === usageName);
    if (!selectedOpt) {
      return { time, filament };
    }

    const valueStr = selectedOpt.value.toLowerCase();
    const resultStr = selectedOpt.resultado.toLowerCase();
    const useStr = selectedOpt.uso.toLowerCase();
    const textToAnalyze = `${valueStr} ${resultStr} ${useStr}`.toLowerCase();

    // 1. Precise overrides for critical parameters
    if (item.id === "layer-height") {
      const val = parseFloat(valueStr.replace(",", "."));
      if (!isNaN(val)) {
        if (val < 0.2)
          time = "up"; // Slower
        else if (val > 0.2) time = "down"; // Faster
      }
    } else if (item.id === "wall-count") {
      const val = parseInt(valueStr) || 0;
      if (val > 0) {
        if (val < 3) {
          time = "down";
          filament = "down";
        } else if (val > 3) {
          time = "up";
          filament = "up";
        }
      }
    } else if (item.id === "infill-density") {
      if (
        textToAnalyze.includes("0–5") ||
        textToAnalyze.includes("5%") ||
        textToAnalyze.includes("10–15") ||
        textToAnalyze.includes("10%")
      ) {
        time = "down";
        filament = "down";
      } else if (
        textToAnalyze.includes("25–40") ||
        textToAnalyze.includes("40–60") ||
        textToAnalyze.includes("80–100") ||
        textToAnalyze.includes("40%") ||
        textToAnalyze.includes("80%")
      ) {
        time = "up";
        filament = "up";
      }
    } else if (item.id === "ironing-type") {
      if (valueStr.includes("desativado")) {
        time = "neutral";
        filament = "neutral";
      } else {
        time = "up"; // Ironing adds lots of time
      }
    } else if (item.id.includes("line-width") || item.id.includes("largura-linha")) {
      // Standard is usually 0.42 mm or 100%
      if (
        textToAnalyze.includes("0,35") ||
        textToAnalyze.includes("fino") ||
        textToAnalyze.includes("0,38") ||
        textToAnalyze.includes("70%") ||
        textToAnalyze.includes("80%")
      ) {
        time = "up"; // thinner line = more passes = slower
        filament = "down"; // less plastic
      } else if (
        textToAnalyze.includes("0,50") ||
        textToAnalyze.includes("0,55") ||
        textToAnalyze.includes("0,60") ||
        textToAnalyze.includes("estrutural") ||
        textToAnalyze.includes("rápido") ||
        textToAnalyze.includes("120%") ||
        textToAnalyze.includes("140%") ||
        textToAnalyze.includes("150%")
      ) {
        time = "down"; // thicker line = fewer passes = faster
        filament = "up"; // more plastic
      }
    } else if (item.id.includes("speed") || item.id.includes("velocidade")) {
      if (
        textToAnalyze.includes("lento") ||
        textToAnalyze.includes("reduzido") ||
        textToAnalyze.includes("lenta") ||
        textToAnalyze.includes("qualidade")
      ) {
        time = "up";
      } else if (
        textToAnalyze.includes("rápido") ||
        textToAnalyze.includes("rapido") ||
        textToAnalyze.includes("alta") ||
        textToAnalyze.includes("acelera")
      ) {
        time = "down";
      }
    } else if (item.id.includes("seam") || item.id.includes("costura")) {
      // Minimal impact on time/filament
      return { time: "neutral", filament: "neutral" };
    } else {
      // 2. Keyword fallback for other items
      if (
        textToAnalyze.includes("lento") ||
        textToAnalyze.includes("mais tempo") ||
        textToAnalyze.includes("demora") ||
        textToAnalyze.includes("slow") ||
        textToAnalyze.includes("lenta")
      ) {
        time = "up";
      } else if (
        textToAnalyze.includes("rápido") ||
        textToAnalyze.includes("rapido") ||
        textToAnalyze.includes("fast") ||
        textToAnalyze.includes("veloz") ||
        textToAnalyze.includes("menos tempo")
      ) {
        time = "down";
      }

      if (
        textToAnalyze.includes("mais material") ||
        textToAnalyze.includes("mais filamento") ||
        textToAnalyze.includes("gasta mais") ||
        textToAnalyze.includes("pesado") ||
        textToAnalyze.includes("gasto") ||
        textToAnalyze.includes("mais plástico")
      ) {
        filament = "up";
      } else if (
        textToAnalyze.includes("menos material") ||
        textToAnalyze.includes("menos filamento") ||
        textToAnalyze.includes("economi") ||
        textToAnalyze.includes("gasta menos") ||
        textToAnalyze.includes("leve") ||
        textToAnalyze.includes("menos plástico")
      ) {
        filament = "down";
      }
    }

    return { time, filament };
  };

  // Helper to calculate impact of selected usage on aesthetics and mechanical strength
  const getUsageAspectImpacts = (
    item: CourseItem,
    usageName: string,
  ): { estetica: "up" | "down" | "neutral"; resistencia: "up" | "down" | "neutral" } => {
    let estetica: "up" | "down" | "neutral" = "neutral";
    let resistencia: "up" | "down" | "neutral" = "neutral";

    const options = getItemOptions(item);
    const selectedOpt = options.find((o) => o.uso === usageName);
    if (!selectedOpt) {
      return { estetica, resistencia };
    }

    const valueStr = selectedOpt.value.toLowerCase();
    const resultStr = selectedOpt.resultado.toLowerCase();
    const useStr = selectedOpt.uso.toLowerCase();
    const textToAnalyze = `${valueStr} ${resultStr} ${useStr}`.toLowerCase();

    // 1. Precise overrides for critical parameters
    if (item.id === "layer-height") {
      const val = parseFloat(valueStr.replace(",", "."));
      if (!isNaN(val)) {
        if (val <= 0.12) {
          estetica = "up"; // Better details
        } else if (val >= 0.24) {
          estetica = "down"; // Visibly rough layers
          resistencia = "up"; // Thick layers have sturdier vertical walls
        }
      }
    } else if (item.id === "wall-count") {
      const val = parseInt(valueStr) || 0;
      if (val > 0) {
        if (val <= 2) {
          resistencia = "down";
          estetica = "down"; // Infill show-through
        } else if (val >= 4) {
          resistencia = "up";
          estetica = "up"; // Solid shell, no show-through
        }
      }
    } else if (item.id === "infill-density") {
      if (
        textToAnalyze.includes("0–5") ||
        textToAnalyze.includes("5%") ||
        textToAnalyze.includes("10–15") ||
        textToAnalyze.includes("10%")
      ) {
        resistencia = "down";
      } else if (
        textToAnalyze.includes("25–40") ||
        textToAnalyze.includes("40–60") ||
        textToAnalyze.includes("80–100") ||
        textToAnalyze.includes("40%") ||
        textToAnalyze.includes("80%")
      ) {
        resistencia = "up";
      }
    } else if (item.id === "infill-pattern") {
      if (
        textToAnalyze.includes("giroide") ||
        textToAnalyze.includes("gyroid") ||
        textToAnalyze.includes("cúbico") ||
        textToAnalyze.includes("cubic")
      ) {
        resistencia = "up";
      } else if (textToAnalyze.includes("concêntrico") || textToAnalyze.includes("concentric")) {
        resistencia = "down";
      }
    } else if (item.id === "ironing-type") {
      if (!valueStr.includes("desativado")) {
        estetica = "up";
      }
    } else if (item.id === "scarf-seam") {
      if (!valueStr.includes("nenhum") && !valueStr.includes("desativado")) {
        estetica = "up";
      }
    } else if (item.id === "seam-position") {
      if (textToAnalyze.includes("aleatório")) {
        estetica = "down";
      } else if (textToAnalyze.includes("alinhado") || textToAnalyze.includes("traseira")) {
        estetica = "up";
      }
    } else if (item.id.includes("line-width") || item.id.includes("largura-linha")) {
      if (
        textToAnalyze.includes("0,35") ||
        textToAnalyze.includes("fino") ||
        textToAnalyze.includes("0,38")
      ) {
        estetica = "up";
        resistencia = "down";
      } else if (
        textToAnalyze.includes("0,50") ||
        textToAnalyze.includes("0,55") ||
        textToAnalyze.includes("0,60") ||
        textToAnalyze.includes("estrutural") ||
        textToAnalyze.includes("largo")
      ) {
        estetica = "down";
        resistencia = "up";
      }
    } else if (item.id.includes("speed") || item.id.includes("velocidade")) {
      if (
        textToAnalyze.includes("lento") ||
        textToAnalyze.includes("reduzido") ||
        textToAnalyze.includes("qualidade")
      ) {
        estetica = "up";
      } else if (
        textToAnalyze.includes("rápido") ||
        textToAnalyze.includes("velocidade de rascunho")
      ) {
        estetica = "down";
      }
    } else if (item.id.includes("temp")) {
      if (textToAnalyze.includes("alta") || textToAnalyze.includes("máxima")) {
        resistencia = "up";
      } else if (textToAnalyze.includes("baixa") || textToAnalyze.includes("mínima")) {
        resistencia = "down";
      }
    } else if (
      item.id.includes("fan") ||
      item.id.includes("ventoinha") ||
      item.id.includes("resfriamento")
    ) {
      if (textToAnalyze.includes("alta") || textToAnalyze.includes("100%")) {
        estetica = "up"; // Better overhangs
        resistencia = "down"; // Worse layer bonding
      } else if (textToAnalyze.includes("desativado") || textToAnalyze.includes("baixa")) {
        estetica = "down";
        resistencia = "up";
      }
    } else {
      // General fallbacks based on result text
      if (
        textToAnalyze.includes("estética") ||
        textToAnalyze.includes("acabamento") ||
        textToAnalyze.includes("visual") ||
        textToAnalyze.includes("aparência") ||
        textToAnalyze.includes("bonito") ||
        textToAnalyze.includes("lisa")
      ) {
        if (
          textToAnalyze.includes("melhora") ||
          textToAnalyze.includes("perfeito") ||
          textToAnalyze.includes("esconde") ||
          textToAnalyze.includes("evita")
        ) {
          estetica = "up";
        } else if (
          textToAnalyze.includes("piora") ||
          textToAnalyze.includes("marcado") ||
          textToAnalyze.includes("visível")
        ) {
          estetica = "down";
        }
      }
      if (
        textToAnalyze.includes("resistência") ||
        textToAnalyze.includes("mecânica") ||
        textToAnalyze.includes("forte") ||
        textToAnalyze.includes("robust") ||
        textToAnalyze.includes("solda")
      ) {
        if (
          textToAnalyze.includes("melhora") ||
          textToAnalyze.includes("aumenta") ||
          textToAnalyze.includes("máxima") ||
          textToAnalyze.includes("forte")
        ) {
          resistencia = "up";
        } else if (
          textToAnalyze.includes("frágil") ||
          textToAnalyze.includes("diminui") ||
          textToAnalyze.includes("quebra") ||
          textToAnalyze.includes("fraca")
        ) {
          resistencia = "down";
        }
      }
    }

    return { estetica, resistencia };
  };

  // Study progress tracker state (persisted in localStorage)
  const [studiedItems, setStudiedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("orcaslicer_course_studied");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const toggleStudiedItem = (itemId: string) => {
    setStudiedItems((prev) => {
      const updated = { ...prev, [itemId]: !prev[itemId] };
      try {
        localStorage.setItem("orcaslicer_course_studied", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Error mapping and keywords for filtering configurations by defect/faults
  const errorOptions = [
    { id: "all", label: "⚠️ Todos os Erros (Sem filtro)" },
    { id: "warp", label: "Warping / Descolamento (Falta de Adesão)" },
    { id: "elefante", label: "Pé de Elefante (Base Alargada/Esmagada)" },
    { id: "stringing", label: "Stringing / Fiapos (Teias de Aranha)" },
    { id: "subextrusao", label: "Subextrusão / Voids (Linhas com Buracos)" },
    { id: "overextrusao", label: "Overextrusão / Rebarbas e Excesso" },
    { id: "adesao", label: "Frágil / Baixa Solda entre Camadas Z" },
    { id: "overheating", label: "Overheating (Deformação em Pontes/Saliências)" },
    { id: "cicatrizes", label: "Cicatrizes e Costura Marcada (Estética)" },
    { id: "suporte", label: "Dificuldade na Remoção dos Suportes" },
    { id: "ghosting", label: "Ghosting / Ringing (Vibração na Parede)" },
  ];

  const errorKeywords: Record<string, string[]> = {
    warp: [
      "warp",
      "descol",
      "adesão",
      "aderência",
      "mesa",
      "brim",
      "encolhimento",
      "envergadura",
      "borda",
      "saia",
      "adhesion",
    ],
    elefante: ["elefante", "elephant", "esmag"],
    stringing: [
      "stringing",
      "fiapo",
      "retração",
      "vazamento",
      "wipe",
      "temperatura",
      "temp",
      "retract",
    ],
    subextrusao: [
      "subextrus",
      "void",
      "buraco",
      "falha",
      "vazão",
      "volumétrica",
      "fluxo",
      "under-extrusion",
    ],
    overextrusao: ["overextrus", "excesso", "rebarba", "fluxo", "over-extrusion"],
    adesao: [
      "solda",
      "adesão entre",
      "adesão de",
      "frágil",
      "resistência vertical",
      "z",
      "inter-layer",
      "delamina",
    ],
    overheating: [
      "cooling",
      "ventila",
      "resfria",
      "derret",
      "ponte",
      "overhang",
      "saliência",
      "saliacias",
      "bridg",
      "heating",
    ],
    cicatrizes: [
      "costura",
      "seam",
      "scarf",
      "cicatriz",
      "marca",
      "alisamento",
      "bico",
      "scarf",
      "z-seam",
    ],
    suporte: ["suporte", "remov", "gruda", "raft", "jangada", "distância z", "support"],
    ghosting: [
      "acelera",
      "jerk",
      "vibra",
      "resson",
      "mola",
      "mecanic",
      "velocidade",
      "ghosting",
      "ringing",
    ],
  };

  // Helper to calculate the exact absolute box value to type in OrcaSlicer based on nozzle & calibration
  const getCalculatedBoxValue = (item: CourseItem, recommendedValue: string) => {
    const nozzleNum = parseFloat(nozzleSize);
    const scale = nozzleNum / 0.4;

    // Helper to get the active layer height (Altura da camada) as the base for relative calculations
    const getEffectiveLayerHeight = (): number => {
      if (parameterValues && parameterValues["layer-height"] !== undefined) {
        const valStr = parameterValues["layer-height"].replace(" mm", "").replace(",", ".").trim();
        const parsed = parseFloat(valStr);
        if (!isNaN(parsed) && parsed > 0) {
          return parsed;
        }
      }
      const recVal = getRecommendedValueForParameter("layer-height");
      const base = parseFloat(recVal.replace(" mm", "").replace(",", "."));
      if (!isNaN(base)) {
        return base * scale;
      }
      return 0.2 * scale; // default fallback
    };

    // Helper to get the active default line width (Largura da linha padrão) as the base for relative calculations
    const getEffectiveDefaultLineWidth = (): number => {
      if (parameterValues && parameterValues["line-width-default"] !== undefined) {
        const valStr = parameterValues["line-width-default"]
          .replace(" mm", "")
          .replace(",", ".")
          .trim();
        const parsed = parseFloat(valStr);
        if (!isNaN(parsed) && parsed > 0) {
          return parsed;
        }
      }
      const recVal = getRecommendedValueForParameter("line-width-default");
      const base = parseFloat(recVal.replace(" mm", "").replace(",", "."));
      if (!isNaN(base)) {
        const pct = (base / 0.4) * 100;
        return (pct / 100) * nozzleNum;
      }
      return 1.05 * nozzleNum; // fallback 105% of nozzle
    };

    // Layer Height
    if (item.id === "layer-height") {
      const base = parseFloat(recommendedValue.replace(" mm", "").replace(",", "."));
      if (!isNaN(base)) {
        const calc = base * scale;
        return {
          label: `${calc.toFixed(2).replace(".", ",")} mm`,
          formula: `Padrão: ${recommendedValue} (Escalado para bico ${nozzleNum}mm)`,
        };
      }
    }

    // First Layer Height
    if (item.id === "first-layer-height") {
      const currentLayerH = getEffectiveLayerHeight();
      if (recommendedValue.includes("%")) {
        const pct = parseFloat(recommendedValue.replace("%", ""));
        const calc = (pct / 100) * currentLayerH;
        return {
          label: `${calc.toFixed(2).replace(".", ",")} mm`,
          formula: `${pct}% da Altura da Camada Ativa (${currentLayerH.toFixed(2).replace(".", ",")} mm)`,
        };
      }
      const base = parseFloat(recommendedValue.replace(" mm", "").replace(",", "."));
      if (!isNaN(base)) {
        const calc = base * scale;
        return {
          label: `${calc.toFixed(2).replace(".", ",")} mm`,
          formula: `Fixo: ${recommendedValue} (Escalado para bico ${nozzleNum}mm)`,
        };
      }
    }

    // Line Widths
    if (
      item.id.includes("line-width") ||
      item.id.includes("width") ||
      item.label.toLowerCase().includes("largura da linha")
    ) {
      const activeDefaultWidth = getEffectiveDefaultLineWidth();

      if (recommendedValue.includes("%") && !recommendedValue.includes("mm")) {
        const pct = parseFloat(recommendedValue.replace("%", ""));
        if (
          recommendedValue.toLowerCase().includes("padrão") ||
          recommendedValue.toLowerCase().includes("padrao") ||
          item.id === "line-width-first-layer"
        ) {
          const calc = (pct / 100) * activeDefaultWidth;
          return {
            label: `${calc.toFixed(2).replace(".", ",")} mm`,
            formula: `${pct}% da Largura Padrão (${activeDefaultWidth.toFixed(2).replace(".", ",")} mm)`,
          };
        } else {
          const calc = (pct / 100) * nozzleNum;
          return {
            label: `${calc.toFixed(2).replace(".", ",")} mm`,
            formula: `${pct}% do bico (${nozzleNum} mm)`,
          };
        }
      }
      const base = parseFloat(recommendedValue.replace(" mm", "").replace(",", "."));
      if (!isNaN(base)) {
        // ratio relative to 0.4 nozzle
        const pct = (base / 0.4) * 100;
        const calc = (pct / 100) * nozzleNum;
        return {
          label: `${calc.toFixed(2).replace(".", ",")} mm`,
          formula: `${Math.round(pct)}% do bico (${nozzleNum} mm)`,
        };
      }
    }

    // Flow Ratio / Extrusion Multiplier
    if (
      item.id.includes("extrusion-multiplier") ||
      item.id.includes("flow-ratio") ||
      item.label.toLowerCase().includes("fluxo")
    ) {
      return {
        label: `${calibFlowRate.toFixed(3).replace(".", ",")}`,
        formula: `Fator Calibrado Ativo (Valor de Entrada)`,
      };
    }

    // Pressure Advance
    if (
      item.id.includes("pressure-advance") ||
      item.id.includes("pa-value") ||
      item.label.toLowerCase().includes("pressure advance")
    ) {
      return {
        label: `${calibPA.toFixed(3).replace(".", ",")}`,
        formula: `PA Calibrado Ativo (Valor de Entrada)`,
      };
    }

    // Volumetric Limit
    if (item.id.includes("volumetric") || item.label.toLowerCase().includes("volumétrica")) {
      return {
        label: `${calibMaxVol} mm³/s`,
        formula: `Limite de Vazão Ativo para o Filamento`,
      };
    }

    // Print speeds
    if (
      item.id.includes("speed") ||
      item.id.includes("velocity") ||
      item.label.toLowerCase().includes("velocidade")
    ) {
      let baseSpeed = parseFloat(recommendedValue.replace(" mm/s", ""));
      if (!isNaN(baseSpeed)) {
        // 1. Scale based on Printer Preset
        let printerFactor = 1.0;
        if (printerPreset === "ender3") {
          printerFactor = 0.5; // slow down significantly for budget bed slingers
        } else if (printerPreset === "prusa") {
          printerFactor = 0.75; // high quality bed slinger, moderate speed
        }

        // 2. Scale based on Nozzle Size (Bico)
        let nozzleFactor = 1.0;
        if (nozzleSize === "0.6") {
          nozzleFactor = 0.8;
        } else if (nozzleSize === "0.8") {
          nozzleFactor = 0.6;
        } else if (nozzleSize === "0.2") {
          nozzleFactor = 0.9; // details need slower speeds
        }

        // 3. Scale based on Optimization Goal
        let goalFactor = 1.0;
        if (optimizationGoal === "speed") {
          goalFactor = 1.25;
        } else if (optimizationGoal === "quality") {
          goalFactor = 0.7;
        } else if (optimizationGoal === "economy") {
          goalFactor = 0.9;
        }

        baseSpeed = Math.round(baseSpeed * printerFactor * nozzleFactor * goalFactor);

        // 4. Filament Speed Caps (Hard physical limits of the polymer)
        let cappedByFilament = false;
        if (filament === "tpu") {
          // TPU cannot be printed fast
          const maxTPUSpeed = item.id.includes("infill") ? 45 : 30;
          if (baseSpeed > maxTPUSpeed) {
            baseSpeed = maxTPUSpeed;
            cappedByFilament = true;
          }
        } else if (filament === "nylon") {
          const maxNylonSpeed = 80;
          if (baseSpeed > maxNylonSpeed) {
            baseSpeed = maxNylonSpeed;
            cappedByFilament = true;
          }
        } else if (filament === "petg") {
          const maxPETGSpeed = 150;
          if (baseSpeed > maxPETGSpeed) {
            baseSpeed = maxPETGSpeed;
            cappedByFilament = true;
          }
        }

        // 5. Get dynamic feature-specific width & height
        const getLineWidthForSpeedItem = (speedItemId: string): number => {
          let linkedWidthId = "line-width-default";
          if (speedItemId.includes("first-layer")) {
            linkedWidthId = "line-width-first-layer";
          } else if (speedItemId.includes("outer-wall")) {
            linkedWidthId = "line-width-outer-wall";
          } else if (speedItemId.includes("inner-wall")) {
            linkedWidthId = "line-width-inner-wall";
          } else if (speedItemId.includes("top-surface")) {
            linkedWidthId = "line-width-top";
          } else if (speedItemId.includes("solid-infill")) {
            linkedWidthId = "line-width-solid-infill";
          } else if (speedItemId === "infill-speed") {
            linkedWidthId = "line-width-sparse-infill";
          }

          if (parameterValues && parameterValues[linkedWidthId] !== undefined) {
            const valStr = parameterValues[linkedWidthId]
              .replace(" mm", "")
              .replace(",", ".")
              .trim();
            const parsed = parseFloat(valStr);
            if (!isNaN(parsed) && parsed > 0) {
              return parsed;
            }
          }
          return getEffectiveDefaultLineWidth();
        };

        const getLayerHeightForSpeedItem = (speedItemId: string): number => {
          let linkedHId = "layer-height";
          if (speedItemId.includes("first-layer")) {
            linkedHId = "first-layer-height";
          }

          if (parameterValues && parameterValues[linkedHId] !== undefined) {
            const valStr = parameterValues[linkedHId].replace(" mm", "").replace(",", ".").trim();
            const parsed = parseFloat(valStr);
            if (!isNaN(parsed) && parsed > 0) {
              return parsed;
            }
          }
          return getEffectiveLayerHeight();
        };

        const calcLayerHeight = getLayerHeightForSpeedItem(item.id);
        const calcLineWidth = getLineWidthForSpeedItem(item.id);
        const area = calcLayerHeight * calcLineWidth;
        const physicalLimit = calibMaxVol / area; // in mm/s

        if (baseSpeed > physicalLimit) {
          return {
            label: `${Math.round(physicalLimit)} mm/s`,
            formula: `⚠️ Limitado por física de vazão máxima (${calibMaxVol} mm³/s) para área de ${area.toFixed(3)} mm²`,
          };
        }

        let formulaText = `Nominal (Fatores: Impressora ×${printerFactor.toFixed(2)}, Bico ×${nozzleFactor.toFixed(2)}, Meta ×${goalFactor.toFixed(2)})`;
        if (cappedByFilament) {
          formulaText = `⚠️ Limitado pelo filamento ${filament.toUpperCase()} (${baseSpeed} mm/s)`;
        }

        return {
          label: `${baseSpeed} mm/s`,
          formula: `${formulaText} [Vazão: ${(baseSpeed * area).toFixed(1)} mm³/s]`,
        };
      }
    }

    return {
      label: recommendedValue,
      formula: "Padrão de referência para o perfil",
    };
  };

  // Helper to render error tags in a styled list with custom color codes
  const renderErrorTags = (oQueGeraText: string) => {
    const text = oQueGeraText || "";
    const foundTags: { label: string; color: string }[] = [];

    const checkAndAdd = (keyword: string, label: string, color: string) => {
      if (text.toLowerCase().includes(keyword)) {
        foundTags.push({ label, color });
      }
    };

    checkAndAdd("warp", "Warping / Empenamento", "bg-red-500/10 text-red-400 border-red-500/20");
    checkAndAdd("descol", "Descolamento", "bg-rose-500/10 text-rose-400 border-rose-500/20");
    checkAndAdd("elefante", "Pé de Elefante", "bg-amber-500/10 text-amber-400 border-amber-500/20");
    checkAndAdd("esmag", "Linha Esmagada", "bg-yellow-500/10 text-yellow-400 border-yellow-500/20");
    checkAndAdd(
      "stringing",
      "Stringing / Fiapos",
      "bg-purple-500/10 text-purple-400 border-purple-500/20",
    );
    checkAndAdd(
      "fiapo",
      "Teias de Fiapos",
      "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
    );
    checkAndAdd(
      "subextrus",
      "Subextrusão",
      "bg-orange-500/10 text-orange-400 border-orange-500/20",
    );
    checkAndAdd("void", "Voids / Buracos", "bg-indigo-500/10 text-indigo-400 border-indigo-500/20");
    checkAndAdd("overextrus", "Overextrusão", "bg-red-600/10 text-red-300 border-red-600/20");
    checkAndAdd(
      "excesso",
      "Excesso Material",
      "bg-orange-600/10 text-orange-300 border-orange-600/20",
    );
    checkAndAdd("solda", "Solda Z Fraca", "bg-cyan-500/10 text-cyan-400 border-cyan-500/20");
    checkAndAdd("frágil", "Frágil", "bg-cyan-600/10 text-cyan-300 border-cyan-600/20");
    checkAndAdd("costura", "Costura Visível", "bg-teal-500/10 text-teal-400 border-teal-500/20");
    checkAndAdd(
      "cicatriz",
      "Cicatrizes",
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    );
    checkAndAdd(
      "derret",
      "Overheating / Derretimento",
      "bg-pink-500/10 text-pink-400 border-pink-500/20",
    );
    checkAndAdd("ponte", "Pontes Ruins", "bg-pink-600/10 text-pink-300 border-pink-600/20");
    checkAndAdd("suporte", "Suporte Difícil", "bg-blue-500/10 text-blue-400 border-blue-500/20");
    checkAndAdd("gruda", "Suporte Grudado", "bg-sky-500/10 text-sky-400 border-sky-500/20");
    checkAndAdd(
      "acelera",
      "Vibração / Ghosting",
      "bg-violet-500/10 text-violet-400 border-violet-500/20",
    );
    checkAndAdd("jerk", "Jerk Ruim", "bg-indigo-600/10 text-indigo-300 border-indigo-600/20");

    if (foundTags.length === 0) {
      return <span className="text-gray-400 text-[10.5px] leading-snug">{text}</span>;
    }

    return (
      <div className="flex flex-col gap-1.5 py-1">
        <div className="flex flex-wrap gap-1">
          {foundTags.map((tag, idx) => (
            <span
              key={idx}
              className={`px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase border ${tag.color} tracking-wide`}
            >
              {tag.label}
            </span>
          ))}
        </div>
        <p className="text-[10.5px] text-gray-400 leading-snug">{text}</p>
      </div>
    );
  };

  // Helper to calculate the master recommendation for a specific item based on per-row selected usage
  const getRecommendedValueForParameter = (itemId: string): string => {
    const foundItem = courseTabs
      .flatMap((t) => t.groups.flatMap((g) => g.items))
      .find((i) => i.id === itemId);
    if (!foundItem) return "";

    const usage = selectedUsages[itemId];
    const effectiveUsage =
      usage ??
      getOptimalUsageForConfig(foundItem, filament, partType, nozzleSize, optimizationGoal);

    if (foundItem.content.options && foundItem.content.options.length > 0) {
      const opt = foundItem.content.options.find((o) => o.uso === effectiveUsage);
      return opt ? opt.value : foundItem.content.options[0].value;
    }

    if (foundItem.type === "checkbox") {
      return effectiveUsage === "Habilitar recurso" ? "Ativado" : "Desativado";
    }

    return foundItem.value;
  };

  // Helper to obtain recommended value for a specific usage (used for optimal comparisons)
  const getRecommendedValueForUsage = (item: CourseItem, usage: string): string => {
    if (!usage) {
      if (item.content.options && item.content.options.length > 0) {
        const defaultOpt = item.content.options.find(
          (opt) =>
            opt.uso.toLowerCase().includes("padrão") || opt.uso.toLowerCase().includes("padrao"),
        );
        return defaultOpt ? defaultOpt.value : item.content.options[0].value;
      }
      return item.value;
    }

    if (item.content.options && item.content.options.length > 0) {
      const opt = item.content.options.find((o) => o.uso === usage);
      return opt ? opt.value : item.content.options[0].value;
    }

    if (item.type === "checkbox") {
      return usage === "Habilitar recurso" ? "Ativado" : "Desativado";
    }

    return item.value;
  };

  // Automatically sync all parameterValues to match the current Master Recommendations in real-time
  useEffect(() => {
    const updatedValues: Record<string, string> = {};
    let changed = false;
    courseTabs.forEach((tab) => {
      tab.groups.forEach((group) => {
        group.items.forEach((item) => {
          // If the item is locked, preserve its value
          if (lockedParameters[item.id]) {
            updatedValues[item.id] = parameterValues[item.id];
            return;
          }

          // If the item is manually edited, preserve its value (prioritize custom typing)
          if (editedParameters[item.id]) {
            updatedValues[item.id] = parameterValues[item.id];
            return;
          }

          // If the item is 'first-layer-height', it depends dynamically on 'layer-height'
          if (item.id === "first-layer-height") {
            const recVal = getRecommendedValueForParameter(item.id);
            const boxVal = getCalculatedBoxValue(item, recVal).label;
            if (parameterValues[item.id] !== boxVal) {
              updatedValues[item.id] = boxVal;
              changed = true;
            } else {
              updatedValues[item.id] = parameterValues[item.id] || boxVal;
            }
            return;
          }

          // If the item is 'line-width-first-layer', it depends dynamically on 'line-width-default'
          if (item.id === "line-width-first-layer") {
            const recVal = getRecommendedValueForParameter(item.id);
            const boxVal = getCalculatedBoxValue(item, recVal).label;
            if (parameterValues[item.id] !== boxVal) {
              updatedValues[item.id] = boxVal;
              changed = true;
            } else {
              updatedValues[item.id] = parameterValues[item.id] || boxVal;
            }
            return;
          }

          const recVal = getRecommendedValueForParameter(item.id);
          const boxVal = getCalculatedBoxValue(item, recVal).label;
          if (parameterValues[item.id] !== boxVal) {
            updatedValues[item.id] = boxVal;
            changed = true;
          } else {
            updatedValues[item.id] = parameterValues[item.id] || boxVal;
          }
        });
      });
    });
    if (changed) {
      setParameterValues(updatedValues);
    }
  }, [
    nozzleSize,
    filament,
    exposure,
    partType,
    selectedUsages,
    calibFlowRate,
    calibPA,
    calibMaxVol,
    printerPreset,
    optimizationGoal,
    parameterValues["layer-height"],
    parameterValues["line-width-default"],
    parameterValues["first-layer-height"],
    parameterValues["line-width-first-layer"],
    parameterValues["line-width-outer-wall"],
    parameterValues["line-width-inner-wall"],
    parameterValues["line-width-top"],
    parameterValues["line-width-sparse-infill"],
    parameterValues["line-width-solid-infill"],
    lockedParameters,
    editedParameters,
  ]);

  // Sync a single parameter to the recommended value
  const handleSyncParameter = (itemId: string, recommendedValue: string) => {
    setParameterValues((prev) => ({
      ...prev,
      [itemId]: recommendedValue,
    }));
    setToastMessage(`Sincronizado: ${itemId} alterado para ${recommendedValue}`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  // Sync ALL parameters to recommendations
  const handleSyncAllParameters = () => {
    const updatedValues = { ...parameterValues };
    let count = 0;
    courseTabs.forEach((tab) => {
      tab.groups.forEach((group) => {
        group.items.forEach((item) => {
          const recVal = getRecommendedValueForParameter(item.id);
          if (parameterValues[item.id] !== recVal) {
            updatedValues[item.id] = recVal;
            count++;
          }
        });
      });
    });
    setParameterValues(updatedValues);
    setToastMessage(`Sucesso: ${count} parâmetros atualizados para as recomendações selecionadas!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Export current settings to PDF Report
  const handleExportPDF = () => {
    setToastMessage("Gerando PDF... Aguarde um instante.");
    setTimeout(() => {
      try {
        generateConfigPDF({
          printerPreset,
          nozzleSize,
          partType,
          plateType,
          filament,
          exposure,
          calibFlowRate,
          calibPA,
          calibMaxVol,
          parameterValues,
          selectedUsages,
          getCalculatedBoxValue,
          getRecommendedValueForParameter,
        });
        setToastMessage("Sucesso: Relatório PDF baixado!");
      } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        setToastMessage("Erro: Falha ao gerar o relatório PDF.");
      }
      setTimeout(() => setToastMessage(null), 3500);
    }, 500);
  };

  // Helper to obtain the active value of a parameter, whether manually edited or calculated from chosen usage
  const getLiveParameterValue = (itemId: string): string => {
    if (parameterValues[itemId] !== undefined) {
      return parameterValues[itemId];
    }
    const foundItem = courseTabs
      .flatMap((t) => t.groups.flatMap((g) => g.items))
      .find((i) => i.id === itemId);
    if (!foundItem) return "";
    const recVal = getRecommendedValueForParameter(itemId);
    return getCalculatedBoxValue(foundItem, recVal).label;
  };

  // Filament profiles in OrcaSlicer determine automatic bed temperature and cooling fan speed
  const getFilamentDefaults = (fil: string) => {
    switch (fil) {
      case "abs":
        return { bedTemp: 100, fanSpeed: 15 };
      case "asa":
        return { bedTemp: 100, fanSpeed: 20 };
      case "nylon":
        return { bedTemp: 95, fanSpeed: 10 };
      case "petg":
        return { bedTemp: 80, fanSpeed: 50 };
      case "tpu":
        return { bedTemp: 50, fanSpeed: 80 };
      case "pla":
      default:
        return { bedTemp: 60, fanSpeed: 100 };
    }
  };

  const defaults = getFilamentDefaults(filament);

  // Dynamic scores calculation based on ALL parameters
  const liveLayerHeightStr = getLiveParameterValue("layer-height");
  const currentLayerHeightVal = parseFloat(
    liveLayerHeightStr.replace(" mm", "").replace(",", ".").replace("mm", "") || "0.20",
  );

  const liveWallCountStr =
    getLiveParameterValue("wall-count") || getLiveParameterValue("wall-loops") || "3";
  const currentWallCountVal = parseInt(liveWallCountStr, 10) || 3;

  const liveInfillDensityStr = getLiveParameterValue("infill-density") || "15%";
  const currentInfillDensityVal = parseInt(liveInfillDensityStr.replace("%", "") || "15", 10);

  const currentInfillPatternVal =
    getLiveParameterValue("infill-pattern") ||
    getLiveParameterValue("sparse-infill-pattern") ||
    "Giroide (Gyroid)";

  // Map correct IDs from novos subgrupos (e.g. brim-type-out and draft-shield-out)
  const currentBrimVal =
    getLiveParameterValue("brim-type-out") || getLiveParameterValue("brim-type") || "Auto";
  const currentDraftShieldVal =
    getLiveParameterValue("draft-shield-out") ||
    getLiveParameterValue("draft-shield") ||
    "Desativado";

  const currentBedTempVal = parseInt(
    getLiveParameterValue("bed-temp") ||
      getLiveParameterValue("bed-temperature") ||
      String(defaults.bedTemp),
    10,
  );
  const currentFanVal = parseInt(
    getLiveParameterValue("cooling-fan-speed")?.replace("%", "") || String(defaults.fanSpeed),
    10,
  );

  const liveLineWidthStr = getLiveParameterValue("line-width-default") || "0.42mm";
  const currentLineWidthVal = parseFloat(
    liveLineWidthStr.replace(" mm", "").replace(",", ".").replace("mm", "") || "0.42",
  );
  const nozzleNum = parseFloat(nozzleSize) || 0.4;

  // 1. Aesthetic quality score
  let aestheticScore = 75;
  if (currentLayerHeightVal <= 0.08) aestheticScore += 20;
  else if (currentLayerHeightVal <= 0.12) aestheticScore += 15;
  else if (currentLayerHeightVal <= 0.16) aestheticScore += 8;
  else if (currentLayerHeightVal >= 0.28) aestheticScore -= 20;
  else if (currentLayerHeightVal >= 0.24) aestheticScore -= 10;

  if (filament === "pla") aestheticScore += 5;
  else if (filament === "tpu") aestheticScore += 2;
  else if (filament === "nylon") aestheticScore -= 10;

  const currentScarf = getLiveParameterValue("scarf-seam") || "Nenhum";
  if (currentScarf !== "Nenhum") aestheticScore += 5;

  // Aesthetic impact of Line Width (largura da linha)
  if (currentLineWidthVal > nozzleNum * 1.3) {
    aestheticScore -= 15; // Thick lines look rougher and lose fine edge detail
  } else if (currentLineWidthVal < nozzleNum * 0.95) {
    aestheticScore -= 12; // Narrow lines cause visible gaps or surface roughness
  } else {
    aestheticScore += 5; // Optimized width gives perfect surface finish
  }

  aestheticScore = Math.max(10, Math.min(100, aestheticScore));

  // 2. Mechanical strength score
  let mechanicalScore = 55;
  if (currentWallCountVal >= 5) mechanicalScore += 25;
  else if (currentWallCountVal >= 4) mechanicalScore += 15;
  else if (currentWallCountVal <= 2) mechanicalScore -= 15;

  if (currentInfillDensityVal >= 40) mechanicalScore += 25;
  else if (currentInfillDensityVal >= 30) mechanicalScore += 15;
  else if (currentInfillDensityVal >= 20) mechanicalScore += 5;
  else if (currentInfillDensityVal <= 10) mechanicalScore -= 15;

  if (currentInfillPatternVal.includes("Giroide") || currentInfillPatternVal.includes("Gyroid"))
    mechanicalScore += 10;
  else if (currentInfillPatternVal.includes("Cúbico") || currentInfillPatternVal.includes("Cubic"))
    mechanicalScore += 5;
  else if (currentInfillPatternVal.includes("Grade") || currentInfillPatternVal.includes("Grid"))
    mechanicalScore -= 5;
  else if (
    currentInfillPatternVal.includes("Concéntrico") ||
    currentInfillPatternVal.includes("Concentric")
  )
    mechanicalScore -= 15;

  if (filament === "nylon") mechanicalScore += 20;
  else if (filament === "abs" || filament === "asa") mechanicalScore += 15;
  else if (filament === "petg") mechanicalScore += 10;
  else if (filament === "pla") mechanicalScore -= 5;

  // Mechanical impact of Line Width (largura da linha)
  if (currentLineWidthVal >= nozzleNum * 1.2) {
    mechanicalScore += 15; // Wide lines provide strong fusing and massive interlayer bonding
  } else if (currentLineWidthVal < nozzleNum * 0.95) {
    mechanicalScore -= 20; // Very thin lines have weak fusing and low tensile strength
  }

  mechanicalScore = Math.max(10, Math.min(100, mechanicalScore));

  // 3. Print Speed score
  let speedScore = 60;
  if (currentLayerHeightVal >= 0.28) speedScore += 25;
  else if (currentLayerHeightVal >= 0.24) speedScore += 15;
  else if (currentLayerHeightVal >= 0.2) speedScore += 5;
  else if (currentLayerHeightVal <= 0.08) speedScore -= 30;
  else if (currentLayerHeightVal <= 0.12) speedScore -= 15;

  if (currentInfillDensityVal <= 10) speedScore += 10;
  else if (currentInfillDensityVal >= 30) speedScore -= 15;

  if (currentWallCountVal <= 2) speedScore += 8;
  else if (currentWallCountVal >= 4) speedScore -= 10;

  if (filament === "tpu")
    speedScore -= 35; // TPU prints slow
  else if (filament === "pla") speedScore += 5;

  // Speed impact of Line Width (largura da linha)
  if (currentLineWidthVal >= nozzleNum * 1.2) {
    speedScore += 10; // Covers larger volume with fewer passes
  } else if (currentLineWidthVal < nozzleNum * 0.95) {
    speedScore -= 15; // Requires more passes to fill the same width
  }

  speedScore = Math.max(10, Math.min(100, speedScore));

  // 4. Success and adhesion rate
  let successRate = 90;
  const warningsList: string[] = [];

  // --- Physical Limits Compatibility checks ---
  if (currentLayerHeightVal > nozzleNum * 0.75) {
    successRate -= 30;
    warningsList.push(
      `⚠️ ALTURA CRÍTICA: Altura de camada (${currentLayerHeightVal}mm) acima de 75% do bico (${nozzleNum}mm) causará perda completa de soldagem Z.`,
    );
  } else if (currentLayerHeightVal < nozzleNum * 0.2) {
    successRate -= 15;
    warningsList.push(
      `⚠️ ALTURA EXTREMA: Altura de camada (${currentLayerHeightVal}mm) menor que 20% do bico (${nozzleNum}mm) corre alto risco de entupir o bico por contrapressão.`,
    );
  }

  if (currentLineWidthVal > nozzleNum * 1.5) {
    successRate -= 20;
    warningsList.push(
      `⚠️ LINHA MUITO LARGA: Largura de linha padrão (${currentLineWidthVal}mm) acima de 150% do bico (${nozzleNum}mm) causa sobrecarga de torque e falhas de extrusão.`,
    );
  } else if (currentLineWidthVal < nozzleNum * 0.95) {
    successRate -= 20;
    warningsList.push(
      `⚠️ LINHA MUITO ESTREITA: Largura de linha padrão (${currentLineWidthVal}mm) menor que o bico (${nozzleNum}mm) causa falha na adesão e lacunas estruturais.`,
    );
  }

  if (partType === "estrutural" && currentWallCountVal < 4) {
    successRate -= 20;
    warningsList.push(
      `⚠️ ESTRUTURA FRÁGIL: Peças com aplicação Estrutural exigem pelo menos 4 paredes (loops de parede). Atual: ${currentWallCountVal}.`,
    );
  }

  if (partType === "estrutural" && currentInfillDensityVal < 20) {
    successRate -= 20;
    warningsList.push(
      `⚠️ PREENCHIMENTO FRACO: Peças estruturais necessitam de pelo menos 20% de densidade de preenchimento. Atual: ${currentInfillDensityVal}%.`,
    );
  }

  const isBrimDisabled = currentBrimVal === "Nenhum" || currentBrimVal === "Desativado";
  const isDraftShieldEnabled = currentDraftShieldVal.includes("Ativado");

  if (filament === "abs" || filament === "asa" || filament === "nylon") {
    if (isBrimDisabled) {
      successRate -= 35;
      warningsList.push(
        `⚠️ ALERTA DE ENVERGADURA: ${filament.toUpperCase()} sem Brim possui risco gravíssimo de descolamento e empenamento térmico.`,
      );
    }
    if (currentBedTempVal < 90) {
      successRate -= 30;
      warningsList.push(
        `⚠️ MESA FRIA: ${filament.toUpperCase()} exige pelo menos 90°C de temperatura de mesa para aderência química.`,
      );
    }
    if (currentFanVal > 30) {
      successRate -= 25;
      warningsList.push(
        `⚠️ CHOQUE TÉRMICO: Ventilação acima de 30% em ${filament.toUpperCase()} causa resfriamento excessivo e quebra de camadas.`,
      );
    }
    if (!isDraftShieldEnabled) {
      successRate -= 15;
      warningsList.push(
        `⚠️ CABINE FECHADA: É recomendável habilitar Escudo contra vento (Draft Shield) para ${filament.toUpperCase()} sem cabine selada.`,
      );
    }
  }

  if (filament === "petg") {
    if (currentBedTempVal < 70) {
      successRate -= 15;
      warningsList.push(
        "⚠️ TEMPERATURA MESA: PETG prefere mesa entre 70°C e 85°C para evitar descolamento precoce.",
      );
    }
  }

  if (filament === "pla") {
    if (exposure === "uv") {
      warningsList.push(
        "⚠️ CLIMA INADEQUADO: PLA degradará rapidamente sob radiação solar / UV (prefira ASA).",
      );
    }
    if (exposure === "calor") {
      warningsList.push(
        "⚠️ AMOLECIMENTO TÉRMICO: PLA deforma acima de 55°C. Inadequado para o ambiente de Calor Extremo.",
      );
    }
  }

  if (filament === "tpu") {
    if (currentBedTempVal > 60) {
      successRate -= 10;
      warningsList.push(
        "⚠️ ADESÃO EXCESSIVA: TPU funde permanentemente em chapas PEI quentes (mesa ideal: ≤50°C).",
      );
    }
    const currentSpeedVal = parseFloat(getLiveParameterValue("outer-wall-speed") || "25");
    if (currentSpeedVal > 45) {
      successRate -= 20;
      warningsList.push(
        "⚠️ VELOCIDADE ALTA: TPU elástico exige velocidades baixas (<40 mm/s) para não engasgar o extrusor.",
      );
    }
  }

  successRate = Math.max(5, Math.min(100, successRate));

  // Global Progress calculations
  const allCourseItems = courseTabs.flatMap((tab) => tab.groups.flatMap((g) => g.items));
  const totalItemsCount = allCourseItems.length;
  const totalStudiedCount = allCourseItems.filter((item) => studiedItems[item.id]).length;
  const globalPercent = Math.round((totalStudiedCount / totalItemsCount) * 100) || 0;

  // Active tab progress calculation
  const activeTabObj = courseTabs.find((t) => t.id === activeTab)!;
  const activeTabItems = activeTabObj.groups.flatMap((g) => g.items);
  const activeTotal = activeTabItems.length;
  const activeStudied = activeTabItems.filter((item) => studiedItems[item.id]).length;
  const activePercent = Math.round((activeStudied / activeTotal) * 100) || 0;

  // Proactive auto-suggest of material when environment changes
  const handleExposureChange = (exp: "interno" | "uv" | "calor" | "frio" | "quimico") => {
    setExposure(exp);
    if (exp === "uv") {
      setFilament("asa");
    } else if (exp === "calor") {
      setFilament("abs");
    } else if (exp === "frio") {
      setFilament("tpu");
    } else if (exp === "quimico") {
      setFilament("petg");
    } else {
      setFilament(partType === "flexivel" ? "tpu" : "pla");
    }
  };

  const handlePartTypeChange = (type: "estrutural" | "decorativa" | "prototipo" | "flexivel") => {
    setPartType(type);
    if (type === "flexivel") {
      setFilament("tpu");
    } else if (filament === "tpu") {
      setFilament("pla");
    }
  };

  // Filter list of parameters based on active tab, search term, and error/defect type
  const getFilteredItems = (groupItems: CourseItem[]) => {
    return groupItems.filter((item) => {
      // 1. Defect/Error Filter
      if (selectedErrorFilter !== "all") {
        const keywords = errorKeywords[selectedErrorFilter] || [];
        const itemText = (
          item.label +
          " " +
          (item.content.oQueGera || "") +
          " " +
          (item.content.oQueE || "") +
          " " +
          (item.content.porQueAjustar || "") +
          " " +
          (item.content.regraDeOuro || "")
        ).toLowerCase();

        const matchesKeyword = keywords.some((kw) => itemText.includes(kw));
        if (!matchesKeyword) return false;
      }

      // 2. Search Term Filter
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        item.label.toLowerCase().includes(searchLower) ||
        (item.content.oQueE && item.content.oQueE.toLowerCase().includes(searchLower)) ||
        (item.content.oQueGera && item.content.oQueGera.toLowerCase().includes(searchLower)) ||
        (item.content.regraDeOuro && item.content.regraDeOuro.toLowerCase().includes(searchLower))
      );
    });
  };

  const exposureLabels: Record<string, string> = {
    interno: "Uso Interno Protegido",
    uv: "Exposição Solar / UV",
    calor: "Calor Extremo (>60°C)",
    frio: "Frio Extremo (Sub-zero)",
    quimico: "Umidade & Químicos",
  };

  const exposureIcons: Record<string, React.ReactNode> = {
    interno: <Shield size={14} />,
    uv: <Sun size={14} />,
    calor: <Thermometer size={14} />,
    frio: <CloudSnow size={14} />,
    quimico: <Droplets size={14} />,
  };

  const filamentLabels: Record<string, string> = {
    pla: "PLA (Uso Geral)",
    petg: "PETG (Forte/Dúctil)",
    abs: "ABS (Rigidez/Calor)",
    asa: "ASA (Sol/Outdoor)",
    tpu: "TPU (Flexível)",
    nylon: "Nylon (Desgaste)",
  };

  const getFilamentColorDot = (fil: string) => {
    switch (fil) {
      case "pla":
        return "#00C896";
      case "petg":
        return "#3b82f6";
      case "abs":
        return "#eab308";
      case "asa":
        return "#ef4444";
      case "tpu":
        return "#a855f7";
      case "nylon":
        return "#f97316";
      default:
        return "#9ca3af";
    }
  };

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden select-none"
      style={{ background: "#0d0f13", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div
          className="fixed top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2 border bg-[#1e2128] border-[#00C896] text-[#00C896]"
          style={{ boxShadow: "0 10px 30px -5px rgba(0, 200, 150, 0.25)" }}
        >
          <Sparkles size={14} className="animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── TOP TOOLBAR ─────────────────────────────────────────── */}
      <TopBar viewMode={viewMode} setViewMode={setViewMode} />

      {/* ── MAIN WORKSPACE ────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">
        {viewMode === "infographic" ? (
          <InfographicView />
        ) : viewMode === "calibration" ? (
          <CalibrationSuite
            onBackToSlicer={() => setViewMode("slicer")}
            onApplyCalibratedFlow={(flow) => {
              setCalibratedFlow(flow);
              setParameterValues((prev) => ({
                ...prev,
                "extrusion-multiplier": flow,
                "flow-ratio": flow,
              }));
            }}
            onApplyCalibratedPA={(pa) => {
              setCalibratedPA(pa);
              setParameterValues((prev) => ({
                ...prev,
                "pressure-advance": pa,
                "pa-value": pa,
              }));
            }}
            currentFilament={filament}
          />
        ) : (
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0d0f13] p-4">
            {/* Top Bar with Global Study Progress, Presets & active config */}
            <div className="flex flex-col gap-2 bg-[#161a22] p-2.5 rounded-xl border border-gray-800/80 mb-2.5 text-xs">
              {/* Row 1: Setup Físico e Peça */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                {/* Impressora Ativa */}
                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-500 tracking-wider mb-0.5 block">
                    Impressora Ativa
                  </label>
                  <div className="relative">
                    <select
                      value={printerPreset}
                      onChange={(e) => setPrinterPreset(e.target.value)}
                      className="w-full py-0.5 pl-7 pr-3 h-7 text-[11px] font-bold bg-[#0f1115] border border-gray-800 rounded-md text-gray-300 outline-none focus:border-[#00C896] cursor-pointer appearance-none"
                    >
                      <option value="bambu-x1c">Bambu Lab X1 Carbon</option>
                      <option value="ender3">Ender 3 V3 KE</option>
                      <option value="voron">Voron 2.4 (CoreXY)</option>
                      <option value="prusa">Prusa MK4</option>
                    </select>
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#00C896]">
                      <Printer size={12} />
                    </div>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[8px]">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Bico (Nozzle Size) */}
                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-500 tracking-wider mb-0.5 block">
                    Diâmetro do Bico (Influência)
                  </label>
                  <div className="relative">
                    <select
                      value={nozzleSize}
                      onChange={(e) => setNozzleSize(e.target.value as any)}
                      className="w-full py-0.5 pl-7 pr-3 h-7 text-[11px] font-bold bg-[#0f1115] border border-gray-800 rounded-md text-gray-300 outline-none focus:border-[#00C896] cursor-pointer appearance-none"
                    >
                      <option value="0.2">0,2 mm (Miniaturas)</option>
                      <option value="0.4">0,4 mm (Padrão)</option>
                      <option value="0.6">0,6 mm (Rápido/Técnico)</option>
                      <option value="0.8">0,8 mm (Grandes Estruturas)</option>
                    </select>
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-cyan-400">
                      <Sliders size={12} />
                    </div>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[8px]">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Tipo de Peça */}
                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-500 tracking-wider mb-0.5 block">
                    Tipo de Peça (Aplicação)
                  </label>
                  <div className="relative">
                    <select
                      value={partType}
                      onChange={(e) => handlePartTypeChange(e.target.value as any)}
                      className="w-full py-0.5 pl-7 pr-3 h-7 text-[11px] font-bold bg-[#0f1115] border border-gray-800 rounded-md text-gray-300 outline-none focus:border-[#00C896] cursor-pointer appearance-none"
                    >
                      <option value="estrutural">Estrutural (Resistente)</option>
                      <option value="decorativa">Decorativa (Visual)</option>
                      <option value="prototipo">Protótipo (Rápido)</option>
                      <option value="flexivel">Flexível (Tenacidade)</option>
                    </select>
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-400">
                      <Cpu size={12} />
                    </div>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[8px]">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Tipo da Placa */}
                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-500 tracking-wider mb-0.5 block">
                    Tipo da Placa (Mesa)
                  </label>
                  <div className="relative">
                    <select
                      value={plateType}
                      onChange={(e) => setPlateType(e.target.value)}
                      className="w-full py-0.5 pl-7 pr-3 h-7 text-[11px] font-bold bg-[#0f1115] border border-gray-800 rounded-md text-gray-300 outline-none focus:border-[#00C896] cursor-pointer appearance-none"
                    >
                      <option value="pei-texturizada">Chapa PEI Texturizada</option>
                      <option value="pei-lisa">Chapa PEI Lisa / Satinada</option>
                      <option value="cool-plate">Chapa Fria (Cool Plate)</option>
                      <option value="high-temp">Chapa de Alta Temperatura</option>
                    </select>
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-purple-400">
                      <Layers size={12} />
                    </div>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[8px]">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Meta de Otimização IA */}
                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-500 tracking-wider mb-0.5 block flex items-center gap-1">
                    <Sparkles size={10} className="text-[#00C896] animate-pulse" />
                    <span>Meta de Otimização IA</span>
                  </label>
                  <div className="relative">
                    <select
                      value={optimizationGoal}
                      onChange={(e) => setOptimizationGoal(e.target.value as any)}
                      className="w-full py-0.5 pl-7 pr-3 h-7 text-[11px] font-bold bg-[#0f1115] border border-emerald-950/80 rounded-md text-[#00C896] outline-none focus:border-[#00C896] cursor-pointer appearance-none shadow-[0_0_8px_rgba(0,200,150,0.08)]"
                    >
                      <option value="balanced" className="bg-[#1a1d24] text-gray-300">
                        ⚖️ Ajuste Balanceado
                      </option>
                      <option value="speed" className="bg-[#1a1d24] text-gray-300">
                        ⚡ Tempo (Velocidade)
                      </option>
                      <option value="economy" className="bg-[#1a1d24] text-gray-300">
                        🍃 Economia de Filamento
                      </option>
                      <option value="quality" className="bg-[#1a1d24] text-gray-300">
                        💎 Estética (Qualidade)
                      </option>
                    </select>
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#00C896]">
                      <Sparkles size={11} />
                    </div>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[8px]">
                      ▼
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Material, Exposição e Calibrações Ativas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 border-t border-gray-800/30 pt-2">
                {/* Termoplástico */}
                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-500 tracking-wider mb-0.5 block">
                    Material (Filamento)
                  </label>
                  <div className="relative">
                    <select
                      value={filament}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setFilament(val);
                        if (val === "tpu") {
                          setPartType("flexivel");
                        }
                      }}
                      className="w-full py-0.5 pl-7 pr-3 h-7 text-[11px] font-bold bg-[#0f1115] border border-gray-800 rounded-md text-gray-300 outline-none focus:border-[#00C896] cursor-pointer appearance-none"
                    >
                      {(["pla", "petg", "abs", "asa", "tpu", "nylon"] as const).map((fil) => (
                        <option key={fil} value={fil} className="bg-[#1a1d24]">
                          {filamentLabels[fil]}
                        </option>
                      ))}
                    </select>
                    <div
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                      style={{ background: getFilamentColorDot(filament) }}
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[8px]">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Exposição de Destino */}
                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-500 tracking-wider mb-0.5 block">
                    Exposição de Destino
                  </label>
                  <div className="relative">
                    <select
                      value={exposure}
                      onChange={(e) => handleExposureChange(e.target.value as any)}
                      className="w-full py-0.5 pl-7 pr-3 h-7 text-[11px] font-bold bg-[#0f1115] border border-gray-800 rounded-md text-gray-300 outline-none focus:border-[#00C896] cursor-pointer appearance-none"
                    >
                      {(["interno", "uv", "calor", "frio", "quimico"] as const).map((exp) => (
                        <option key={exp} value={exp} className="bg-[#1a1d24]">
                          {exposureLabels[exp]}
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#00C896]">
                      {exposureIcons[exposure]}
                    </div>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[8px]">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Fator de Fluxo */}
                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-500 tracking-wider mb-0.5 block">
                    Fator Fluxo (Calibração)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.80"
                    max="1.20"
                    value={calibFlowRate}
                    onChange={(e) => setCalibFlowRate(parseFloat(e.target.value) || 0.98)}
                    className="w-full py-0.5 px-2 font-mono font-semibold bg-[#0f1115] border border-gray-800 rounded-md text-gray-300 outline-none focus:border-[#00C896] text-[11px] text-center border-gray-800/80 h-7"
                  />
                </div>

                {/* Pressure Advance */}
                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-500 tracking-wider mb-0.5 block">
                    PA K-Value (Calibração)
                  </label>
                  <input
                    type="number"
                    step="0.005"
                    min="0.000"
                    max="0.300"
                    value={calibPA}
                    onChange={(e) => setCalibPA(parseFloat(e.target.value) || 0.025)}
                    className="w-full py-0.5 px-2 font-mono font-semibold bg-[#0f1115] border border-gray-800 rounded-md text-gray-300 outline-none focus:border-[#00C896] text-[11px] text-center border-gray-800/80 h-7"
                  />
                </div>

                {/* Vazão Volumétrica */}
                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-500 tracking-wider mb-0.5 block">
                    Vazão Máx. (mm³/s)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max="50"
                    value={calibMaxVol}
                    onChange={(e) => setCalibMaxVol(parseInt(e.target.value, 10) || 15)}
                    className="w-full py-0.5 px-2 font-mono font-semibold bg-[#0f1115] border border-gray-800 rounded-md text-gray-300 outline-none focus:border-[#00C896] text-[11px] text-center border-gray-800/80 h-7"
                  />
                </div>
              </div>
            </div>

            {/* Horizontal Tabs similar to Slicer with Study tracker indicators */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 border-b border-gray-800/80 mb-4 bg-[#141720]/50 p-2 rounded-xl">
              <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar-none py-1">
                {courseTabs.map((tab) => {
                  const items = tab.groups.flatMap((g) => g.items);
                  const studiedCount = items.filter((item) => studiedItems[item.id]).length;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? "bg-[#00C896] text-gray-950 shadow-[0_4px_12px_rgba(0,200,150,0.15)]"
                          : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                      }`}
                    >
                      <span>{tabIcons[tab.id]}</span>
                      <span>{tab.label}</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md font-bold transition-all ${
                          isActive
                            ? "bg-blue-600/30 text-blue-300 border border-blue-500/40"
                            : "bg-blue-950/40 text-blue-400/80 border border-blue-900/30"
                        }`}
                      >
                        {studiedCount}/{items.length}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Study progress bar, Search and Error Filter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 flex-shrink-0">
                <div className="hidden lg:flex items-center gap-2 bg-[#0d0f13] px-2.5 py-1.5 rounded-lg border border-gray-800/60">
                  <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">
                    Lidos:
                  </span>
                  <div className="w-20 h-1.5 rounded-full bg-gray-900 overflow-hidden border border-gray-800">
                    <div className="h-full bg-[#00C896]" style={{ width: `${globalPercent}%` }} />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#00C896]">
                    {globalPercent}%
                  </span>
                </div>

                {/* Filtro de Falha/Defeito/Erro */}
                <div className="relative min-w-[200px] sm:w-60">
                  <select
                    value={selectedErrorFilter}
                    onChange={(e) => setSelectedErrorFilter(e.target.value)}
                    className="w-full bg-[#0d0f13] border border-gray-800 rounded-lg py-1.5 pl-3 pr-8 text-xs font-bold text-amber-400 outline-none focus:border-[#00C896] cursor-pointer appearance-none h-8"
                  >
                    {errorOptions.map((opt) => (
                      <option
                        key={opt.id}
                        value={opt.id}
                        className="bg-[#161a22] text-xs font-bold text-gray-300"
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[8px]">
                    ▼
                  </div>
                </div>

                <div className="relative w-full sm:w-48">
                  <Search
                    size={12}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="text"
                    placeholder="Buscar parâmetro..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0d0f13] border border-gray-800 rounded-lg py-1.5 pl-8 pr-3 text-xs text-gray-200 outline-none focus:border-[#00C896] transition-all h-8"
                  />
                </div>

                <button
                  onClick={handleExportPDF}
                  className="flex items-center justify-center gap-1.5 h-8 px-3.5 rounded-lg text-xs font-extrabold bg-[#00C896] hover:bg-[#00b084] text-gray-950 transition-all cursor-pointer whitespace-nowrap shadow-[0_2px_8px_rgba(0,200,150,0.2)] active:scale-95"
                  title="Gerar PDF com todos os parâmetros configurados"
                >
                  <Printer size={13} />
                  <span>Gerar Relatório PDF</span>
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              {/* Slicing Grid Table */}
              <div className="flex-1 min-h-0 overflow-y-auto border border-gray-800/80 rounded-xl bg-[#111318]/40 custom-scrollbar-thin">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#161a22] text-gray-400 font-semibold border-b border-gray-800 sticky top-0 z-10">
                      <th className="px-4 py-3 w-52 text-left">Parâmetro Slicer</th>
                      <th className="px-3 py-3 w-40 text-center">Uso Selecionado</th>
                      <th className="px-3 py-3 w-48 text-center">Foco do Uso</th>
                      <th className="px-3 py-3 w-56 text-center">
                        Valor para a Caixinha (OrcaSlicer)
                      </th>
                      <th className="px-3 py-3 w-44 text-center">Explicação</th>
                      <th className="px-4 py-3 w-64 text-left">Dica de Ouro</th>
                      <th className="px-2 py-3 w-10 text-center">Manual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {courseTabs.map((tab) => {
                      if (tab.id !== activeTab) return null;
                      // Gather items for this tab
                      return tab.groups.map((group) => {
                        const filteredItems = getFilteredItems(group.items);
                        if (filteredItems.length === 0) return null;

                        return (
                          <Fragment key={group.id}>
                            {/* Collapsible Group Header Row */}
                            <tr
                              onClick={() =>
                                setExpandedGroups((prev) => ({
                                  ...prev,
                                  [group.id]: !prev[group.id],
                                }))
                              }
                              className="bg-gray-900/30 hover:bg-gray-900/50 cursor-pointer transition-colors border-y border-gray-800/50"
                            >
                              <td
                                colSpan={7}
                                className="px-4 py-2 text-gray-400 font-extrabold uppercase tracking-wider text-[10px] select-none"
                              >
                                <div className="flex items-center gap-1.5">
                                  {expandedGroups[group.id] ? (
                                    <ChevronDown size={12} />
                                  ) : (
                                    <ChevronRight size={12} />
                                  )}
                                  <span>{group.label}</span>
                                  <span className="text-[9px] font-mono text-blue-400/90 lowercase font-bold ml-2">
                                    ({filteredItems.length} parâmetros)
                                  </span>
                                </div>
                              </td>
                            </tr>

                            {/* Parameter Rows */}
                            {expandedGroups[group.id] &&
                              filteredItems.map((item) => {
                                const recommendedValue = getRecommendedValueForParameter(item.id);
                                const calculatedBoxObj = getCalculatedBoxValue(
                                  item,
                                  recommendedValue,
                                );
                                const isLocked = lockedParameters[item.id] || false;
                                const isManualVal = parameterValues[item.id] !== undefined;
                                const isManualUsage = selectedUsages[item.id] !== undefined;
                                const isEdited =
                                  isLocked ||
                                  isManualVal ||
                                  isManualUsage ||
                                  editedParameters[item.id];

                                const optimalUsage = getOptimalUsageForConfig(
                                  item,
                                  filament,
                                  partType,
                                  nozzleSize,
                                  optimizationGoal,
                                );

                                return (
                                  <tr
                                    key={item.id}
                                    onMouseEnter={() => setHoveredItem(item.id)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    className={`hover:bg-white/[0.015] transition-colors border-b border-gray-800/35 relative ${
                                      selectedItem?.id === item.id ? "bg-[#00c896]/[0.02]" : ""
                                    }`}
                                  >
                                    {/* Parameter Label */}
                                    <td className="px-4 py-2">
                                      <div className="flex items-start gap-2.5">
                                        <input
                                          type="checkbox"
                                          checked={isLocked}
                                          onChange={(e) => {
                                            const checked = e.target.checked;
                                            setLockedParameters((prev) => ({
                                              ...prev,
                                              [item.id]: checked,
                                            }));
                                            if (checked) {
                                              setEditedParameters((prev) => ({
                                                ...prev,
                                                [item.id]: true,
                                              }));
                                              const currentValue =
                                                parameterValues[item.id] !== undefined
                                                  ? parameterValues[item.id]
                                                  : calculatedBoxObj.label;
                                              setParameterValues((prev) => ({
                                                ...prev,
                                                [item.id]: currentValue,
                                              }));
                                            } else {
                                              setEditedParameters((prev) => {
                                                const updated = { ...prev };
                                                delete updated[item.id];
                                                return updated;
                                              });
                                            }
                                          }}
                                          className="mt-0.5 w-3.5 h-3.5 rounded border-gray-700 focus:ring-0 focus:ring-offset-0 bg-[#0d0f13] cursor-pointer accent-yellow-400"
                                          title={
                                            isLocked
                                              ? "Destravar parâmetro"
                                              : "Travar parâmetro (fixar valor)"
                                          }
                                        />
                                        <div className="flex flex-col gap-0.5">
                                          <span
                                            className={`text-[11.5px] font-bold transition-colors flex items-center gap-1 ${
                                              isLocked
                                                ? "text-yellow-400"
                                                : studiedItems[item.id]
                                                  ? "text-blue-400 font-black"
                                                  : "text-gray-200"
                                            }`}
                                          >
                                            {isLocked && (
                                              <Lock
                                                size={10}
                                                className="text-yellow-400 flex-shrink-0"
                                              />
                                            )}
                                            <span>{item.label}</span>
                                          </span>
                                          <span
                                            className={`text-[9.5px] truncate max-w-[170px] transition-colors duration-200 ${
                                              isLocked
                                                ? "text-blue-400 font-bold"
                                                : studiedItems[item.id]
                                                  ? "text-blue-500/60"
                                                  : "text-gray-500"
                                            }`}
                                            title={item.content.oQueE}
                                          >
                                            {item.content.oQueE}
                                          </span>
                                        </div>
                                      </div>
                                    </td>

                                    {/* Uso Selecionado Selector */}
                                    <td className="px-3 py-2 text-center">
                                      {(() => {
                                        const currentUsage =
                                          selectedUsages[item.id] || getInitialUsageForItem(item);
                                        const options = getItemOptions(item);
                                        const selectedOpt = options.find(
                                          (o) => o.uso === currentUsage,
                                        );
                                        const optimalUsage = getOptimalUsageForConfig(
                                          item,
                                          filament,
                                          partType,
                                          nozzleSize,
                                          optimizationGoal,
                                        );
                                        const isOptimal = currentUsage === optimalUsage;

                                        return (
                                          <div className="flex flex-col gap-1 items-center justify-center">
                                            <select
                                              disabled={isLocked}
                                              value={currentUsage}
                                              onChange={(e) => {
                                                const newUsage = e.target.value;
                                                setSelectedUsages((prev) => ({
                                                  ...prev,
                                                  [item.id]: newUsage,
                                                }));
                                                setEditedParameters((prev) => {
                                                  const updated = { ...prev };
                                                  delete updated[item.id];
                                                  return updated;
                                                });
                                              }}
                                              className={`h-8 w-full max-w-[160px] px-2 py-1 border rounded-lg text-[11px] outline-none cursor-pointer font-bold truncate transition-all ${
                                                isOptimal
                                                  ? "bg-white/5 border-white/40 text-white focus:border-white"
                                                  : "bg-[#171a22] border-[#2d3142]/60 text-white focus:border-white"
                                              }`}
                                            >
                                              {options.map((opt, index) => {
                                                const optIsOptimal = opt.uso === optimalUsage;
                                                return (
                                                  <option
                                                    key={index}
                                                    value={opt.uso}
                                                    className="bg-[#161a22]"
                                                    style={{ color: "#ffffff" }}
                                                  >
                                                    {opt.uso} ({opt.resultado}){" "}
                                                    {optIsOptimal ? "★" : ""}
                                                  </option>
                                                );
                                              })}
                                            </select>
                                            {selectedOpt && (
                                              <span className="text-[9.5px] text-gray-400 bg-gray-500/5 border border-gray-800/40 px-1.5 py-0.5 rounded text-center mt-1 max-w-[150px] leading-tight block">
                                                {selectedOpt.resultado}
                                              </span>
                                            )}
                                          </div>
                                        );
                                      })()}
                                    </td>

                                    {/* Foco do Uso — 3 barras verticais compactas */}
                                    <td className="px-2 py-2 text-center align-middle border-x border-gray-800/30">
                                      {(() => {
                                        const currentUsage =
                                          selectedUsages[item.id] || getInitialUsageForItem(item);
                                        const options = getItemOptions(item);
                                        const selectedOpt = options.find(
                                          (o) => o.uso === currentUsage,
                                        );
                                        if (!selectedOpt) return null;

                                        const sqResult = calculateSpeedQualityScore(
                                          item,
                                          currentUsage,
                                          options,
                                        );
                                        const ecoResult = calculateEconomyScore(
                                          item,
                                          currentUsage,
                                          options,
                                        );
                                        const impacts = getUsageAspectImpacts(item, currentUsage);
                                        // Score neutro = 50 (meio da barra, amarelo). Sobe = verde, desce = vermelho.
                                        const velScore = sqResult.active
                                          ? 100 - sqResult.score
                                          : 50;
                                        const qualScore = sqResult.active ? sqResult.score : 50;
                                        const ecoScore = ecoResult.active ? ecoResult.score : 50;
                                        const resScore =
                                          impacts.resistencia === "up"
                                            ? 78
                                            : impacts.resistencia === "down"
                                              ? 22
                                              : 50;

                                        type VBar = {
                                          key: string;
                                          label: string;
                                          score: number;
                                        };
                                        const bars: VBar[] = [
                                          { key: "vel", label: "Vel", score: velScore },
                                          { key: "qual", label: "Qual", score: qualScore },
                                          { key: "eco", label: "Econ", score: ecoScore },
                                          { key: "res", label: "Resis", score: resScore },
                                        ];
                                        return (
                                          <div className="flex items-end justify-center gap-2.5 mx-auto select-none py-1">
                                            {bars.map((b) => {
                                              const s = Math.max(0, Math.min(100, b.score));
                                              // Cor única baseada no valor: baixo = vermelho, meio = amarelo, alto = verde.
                                              const fillColor =
                                                s < 20
                                                  ? "#dc2626"
                                                  : s < 40
                                                    ? "#f97316"
                                                    : s <= 60
                                                      ? "#eab308"
                                                      : s < 80
                                                        ? "#84cc16"
                                                        : "#16a34a";
                                              const activeLabel =
                                                s < 20
                                                  ? "Baixo"
                                                  : s < 40
                                                    ? "Méd-"
                                                    : s <= 60
                                                      ? "Méd"
                                                      : s < 80
                                                        ? "Méd+"
                                                        : "Alto";
                                              return (
                                                <div
                                                  key={b.key}
                                                  className="flex flex-col items-center gap-1"
                                                >
                                                  {/* Vertical track — mesma dimensão para todas as barras */}
                                                  <div className="relative w-2 h-12 rounded-full overflow-hidden border bg-gray-900/80 border-gray-800">
                                                    <div
                                                      className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-300 ease-out"
                                                      style={{
                                                        height: `${s}%`,
                                                        backgroundColor: fillColor,
                                                      }}
                                                    />
                                                  </div>
                                                  {/* Label + state */}
                                                  <span className="text-[8px] font-bold text-gray-500 tracking-wide uppercase leading-none">
                                                    {b.label}
                                                  </span>
                                                  <span
                                                    className="text-[8px] font-black tracking-wide uppercase leading-none"
                                                    style={{ color: fillColor }}
                                                  >
                                                    {activeLabel}
                                                  </span>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        );
                                      })()}
                                    </td>

                                    {/* Valor p/ Caixinha (OrcaSlicer) */}
                                    <td className="px-3 py-2 text-center">
                                      <div className="flex flex-col gap-1 items-center justify-center">
                                        <div className="flex items-center gap-1.5 justify-center">
                                          <input
                                            type="text"
                                            disabled={isLocked}
                                            value={
                                              parameterValues[item.id] !== undefined
                                                ? parameterValues[item.id]
                                                : calculatedBoxObj.label
                                            }
                                            onChange={(e) => {
                                              const newVal = e.target.value;
                                              setParameterValues((prev) => ({
                                                ...prev,
                                                [item.id]: newVal,
                                              }));
                                              setEditedParameters((prev) => ({
                                                ...prev,
                                                [item.id]: true,
                                              }));
                                            }}
                                            className={`px-2 py-1 bg-[#101216] border rounded-md font-mono text-xs font-black shadow-inner min-w-[110px] text-center outline-none transition-colors ${
                                              isLocked
                                                ? "bg-[#161a22]/40 border-yellow-400/20 cursor-not-allowed"
                                                : ""
                                            } ${
                                              getValidationClassAndStatus(
                                                item,
                                                parameterValues[item.id] !== undefined
                                                  ? parameterValues[item.id]
                                                  : calculatedBoxObj.label,
                                                calculatedBoxObj.label,
                                                nozzleSize,
                                              ).className
                                            }`}
                                          />
                                        </div>
                                        <span
                                          className="text-[9px] text-gray-500 font-mono block max-w-[180px] leading-tight truncate"
                                          title={calculatedBoxObj.formula}
                                        >
                                          {calculatedBoxObj.formula}
                                        </span>
                                      </div>
                                    </td>

                                    {/* Explicação */}
                                    <td className="px-3 py-2 text-center">
                                      <div className="max-w-[150px] mx-auto text-left">
                                        {renderErrorTags(item.content.oQueGera)}
                                      </div>
                                    </td>
                                    {/*
                                        
                                        return (
                                          <div 
                                            
                                            
                                          >
                                            
                                          </div>
                                        );
                                      })()}
                                    </td>

                                    {/* Dica de Ouro */}
                                    <td className="px-4 py-2 text-left">
                                      <div
                                        className="text-[10px] text-amber-300/90 font-medium italic leading-snug line-clamp-3 hover:line-clamp-none cursor-pointer transition-all select-text"
                                        title="Regra de ouro / Dica prática"
                                      >
                                        💡 {item.content.regraDeOuro}
                                      </div>
                                    </td>

                                    {/* Manual Book Icon */}
                                    <td className="px-2 py-2 text-center">
                                      <button
                                        onClick={() => setSelectedItem(item)}
                                        className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-[#00C896] transition-colors cursor-pointer"
                                        title="Abrir Explicação OrcaSlicer"
                                      >
                                        <BookOpen size={14} />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                          </Fragment>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── STATUS BAR ────────────────────────────────────────── */}
      <StatusBar tab={activeTabObj} calibratedFlow={calibratedFlow} calibratedPA={calibratedPA} />

      {/* ── COURSE PANEL (slide-in explanation) ──────────────────────────── */}
      {selectedItem && (
        <CoursePanel
          item={{
            ...selectedItem,
            value:
              parameterValues[selectedItem.id] !== undefined
                ? parameterValues[selectedItem.id]
                : selectedItem.value,
          }}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

/* ── SUB COMPONENTS ──────────────────────────────────────────────── */

interface TopBarProps {
  viewMode: "slicer" | "calibration" | "infographic";
  setViewMode: (mode: "slicer" | "calibration" | "infographic") => void;
}

function TopBar({ viewMode, setViewMode }: TopBarProps) {
  return (
    <div
      className="flex items-center h-9 flex-shrink-0 px-3 gap-4 font-sans select-none"
      style={{ background: "#111318", borderBottom: "1px solid #222530" }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2 flex-shrink-0 cursor-pointer"
        onClick={() => setViewMode("slicer")}
      >
        <div
          className="w-5 h-5 rounded flex items-center justify-center text-xs font-black"
          style={{ background: "#00C896", color: "#111318" }}
        >
          O
        </div>
        <span className="text-xs font-bold" style={{ color: "#e6edf3" }}>
          OrcaSlicer
        </span>
        <span className="text-xs text-gray-500">2.4</span>
      </div>

      {/* Menu items */}
      {["Arquivo", "Editar", "Processo", "Filamento", "Impressora", "Calibração", "Ajuda"].map(
        (m) => (
          <button
            key={m}
            onClick={() => {
              if (m === "Calibração") {
                setViewMode("calibration");
              } else {
                setViewMode("slicer");
              }
            }}
            className="text-xs transition-colors hover:text-white cursor-pointer"
            style={{
              color: m === "Calibração" && viewMode === "calibration" ? "#00C896" : "#8b949e",
              fontWeight: m === "Calibração" && viewMode === "calibration" ? "bold" : "normal",
            }}
          >
            {m}
          </button>
        ),
      )}

      <div className="flex-1" />

      {/* Preset selectors */}
      <div className="flex items-center gap-2">
        <PresetChip label="Bambu Lab X1 Carbon" icon={<Printer size={11} />} />
        <PresetChip label="Bambu PLA Basic @0.20mm" icon={<Layers size={11} />} />
      </div>

      {/* Infographic toggle */}
      <button
        onClick={() => setViewMode(viewMode === "infographic" ? "slicer" : "infographic")}
        className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer"
        style={{
          background: viewMode === "infographic" ? "#00C896" : "#1e2128",
          color: viewMode === "infographic" ? "#12141a" : "#00C896",
          border: viewMode === "infographic" ? "none" : "1px solid #00C89655",
        }}
      >
        <Sparkles size={11} />
        {viewMode === "infographic" ? "Ver Fatiador" : "Infográfico"}
      </button>

      {/* Toggle mode button */}
      <button
        onClick={() => setViewMode(viewMode === "slicer" ? "calibration" : "slicer")}
        className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer"
        style={{
          background: viewMode === "calibration" ? "#1e2128" : "#00C896",
          color: viewMode === "calibration" ? "#00C896" : "#12141a",
          border: viewMode === "calibration" ? "1px solid #00C896" : "none",
        }}
      >
        {viewMode === "calibration" ? (
          <>
            <Layers size={11} />
            Ver Fatiador
          </>
        ) : (
          <>
            <Gauge size={11} />
            Calibrar
          </>
        )}
      </button>
    </div>
  );
}

function PresetChip({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded cursor-pointer transition-colors hover:bg-white/5 bg-[#181a22] border border-gray-800">
      <span style={{ color: "#6b7280" }}>{icon}</span>
      <span className="text-xs text-[#c9d1d9]">{label}</span>
      <ChevronDown size={10} style={{ color: "#6b7280" }} />
    </div>
  );
}

interface StatusBarProps {
  tab: CourseTab;
  calibratedFlow: string | null;
  calibratedPA: string | null;
}

function StatusBar({ tab, calibratedFlow, calibratedPA }: StatusBarProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-1 flex-shrink-0 text-xs font-sans"
      style={{
        background: "#0b0c10",
        borderTop: "1px solid #222530",
        color: "#6b7280",
      }}
    >
      <div className="flex items-center gap-4">
        <span style={{ color: "#00C896" }}>● Pronto</span>
        <span>Aba ativa: {tab.label}</span>
        <span>{tab.tela}</span>
      </div>
      <div className="flex items-center gap-4">
        {calibratedFlow && (
          <span className="px-1.5 py-0.5 rounded bg-[#00C896]/15 text-[#00C896] font-mono font-semibold text-[10px]">
            Vazão Calibrada: {calibratedFlow}
          </span>
        )}
        {calibratedPA && (
          <span className="px-1.5 py-0.5 rounded bg-[#00C896]/15 text-[#00C896] font-mono font-semibold text-[10px]">
            PA Calibrado: {calibratedPA}s
          </span>
        )}
        <span>Bico: 0,4 mm</span>
        <span>Altura base: 0,20 mm</span>
        <span>Infill padrão: 15%</span>
        <span className="text-[#00C896]">OrcaSlicer Masterclass · Módulo 10</span>
      </div>
    </div>
  );
}
