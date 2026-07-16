import { useState, useMemo, useEffect } from "react";
import { courseTabs, type CourseItem } from "@/data/courseData";
import { getGuideImageForItem } from "@/data/guideImages";
import { CoursePanel } from "@/components/CoursePanel";
import { SuggestionsButton } from "@/components/SuggestionsButton";
import {
  Layers,
  Package,
  Cpu,
  Sliders,
  Settings,
  Search,
  Info,
  Zap,
  Trophy,
  Check,
  AlertTriangle,
  Lock,
  LogOut,
  Crown,
  Clock,
  RotateCcw,
  Download,
} from "lucide-react";
import { exportCourseAsPdf } from "@/lib/exportPdf";
import { useAccess } from "@/hooks/useAccess";
import { AuthPage } from "./AuthPage";
import { useContentProtection } from "@/hooks/useContentProtection";
import { supabase } from "@/integrations/supabase/client";
import {
  MODULE_UNLOCK_DAYS,
  getModuleUnlockDate,
  isModuleUnlocked,
  formatCountdown,
  QUALIDADE_SECTIONS,
  isQualidadeGroupUnlocked,
} from "@/lib/dripSchedule";

/** Tick a cada 1s para redesenhar os cronômetros dos módulos bloqueados. */
function useNowTick(intervalMs: number = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

const tabIcons: Record<string, React.ReactNode> = {
  qualidade: <Layers size={14} />,
  resistencia: <Package size={14} />,
  velocidade: <Cpu size={14} />,
  suporte: <Sliders size={14} />,
  multimaterial: <Settings size={14} />,
  outros: <Sliders size={14} />,
};

function firstSentence(text: string, max = 140): string {
  if (!text) return "";
  const m = text.match(/^[^.!?]{0,200}[.!?]/);
  const s = (m ? m[0] : text).trim();
  return s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s;
}

/**
 * Extrai a "regra prática" curta de um texto longo — ex.: "25% a 75% do bico".
 * Prioridade: intervalos numéricos (25% a 75%, 0,1 a 0,3 mm), trecho após
 * "Regra…:", ou primeira frase curta.
 */
function extractKeyRule(text: string): string {
  if (!text) return "";

  // 1) Intervalos numéricos comuns: "25% a 75%", "25% e 75%", "0,1 a 0,3 mm"
  const rangePercent = text.match(
    /(\d{1,3}\s*%\s*(?:a|e|até|-)\s*\d{1,3}\s*%(?:\s+d[oa]s?\s+[\wÀ-ÿ]+(?:\s+d[oa]s?\s+[\wÀ-ÿ]+)?)?)/i,
  );
  if (rangePercent) return capitalize(rangePercent[1].trim());

  const rangeMm = text.match(/(\d+[.,]?\d*\s*(?:a|e|até|-)\s*\d+[.,]?\d*\s*mm(?:\/s)?)/i);
  if (rangeMm) return capitalize(rangeMm[1].trim());

  const rangeTemp = text.match(/(\d{2,3}\s*(?:a|e|até|-)\s*\d{2,3}\s*°?C)/i);
  if (rangeTemp) return capitalize(rangeTemp[1].trim());

  // 2) Trecho após "Regra ...:" (regra física, regra de ouro, regra prática)
  const ruleMatch = text.match(/regra[^:]{0,30}:\s*([^.!?]{5,120})/i);
  if (ruleMatch) return capitalize(ruleMatch[1].trim());

  // 3) Frase que começa com "Ideal", "Use", "Mantenha", "Deve"
  const advice = text.match(
    /\b(?:ideal|use|mantenha|deve(?:\s+ficar)?|recomendado)\b[^.!?]{5,120}[.!?]/i,
  );
  if (advice) return capitalize(advice[0].replace(/[.!?]$/, "").trim());

  // 4) Fallback: primeira frase curta
  const first = firstSentence(text, 80);
  return first;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Se o item já tem `options` no dataset, usa-as. Caso contrário, sintetiza
 * opções clicáveis a partir do tipo e da regra de ouro para que nenhum card
 * fique sem valores para escolher.
 */
type DisplayOption = { value: string; uso: string; resultado: string };

function getDisplayOptions(item: CourseItem): DisplayOption[] {
  const existing = item.content.options;
  if (existing && existing.length > 0) {
    return existing.slice(0, 6).map((o) => ({
      value: o.value,
      uso: o.uso,
      resultado: o.resultado,
    }));
  }

  const defaultValue = item.value || "";
  const rule = item.content.regraDeOuro || "";
  const seen = new Set<string>();
  const push = (arr: DisplayOption[], opt: DisplayOption) => {
    const key = opt.value.trim().toLowerCase();
    if (!key || seen.has(key)) return;
    seen.add(key);
    arr.push(opt);
  };
  const out: DisplayOption[] = [];

  if (item.type === "checkbox") {
    const on = /ativ/i.test(defaultValue);
    push(out, {
      value: "Ativado",
      uso: on ? "Padrão recomendado" : "Ative se necessário",
      resultado: on ? "Comportamento padrão" : "Liga o recurso",
    });
    push(out, {
      value: "Desativado",
      uso: !on ? "Padrão recomendado" : "Desative se necessário",
      resultado: !on ? "Comportamento padrão" : "Desliga o recurso",
    });
    return out;
  }

  // Extrai valores numéricos com unidade (%, mm, mm/s, °C, s) da regra
  const numberRegex = /(\d+[.,]?\d*)\s*(%|mm\/s|mm|°?C|s\b)?/gi;
  const candidates: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = numberRegex.exec(rule)) !== null) {
    const num = m[1];
    const unit = (m[2] || "").trim();
    // filtra números soltos sem unidade quando o item é percent/number
    if (!unit && item.type !== "number" && item.type !== "dropdown") continue;
    // usa a unidade do valor padrão quando não há unidade explícita
    let display = unit ? `${num}${unit === "%" ? "%" : ` ${unit}`}` : num;
    if (!unit && item.type === "percent") display = `${num}%`;
    candidates.push(display.replace(/\s+/g, " ").trim());
  }

  if (defaultValue) {
    push(out, {
      value: defaultValue,
      uso: "Padrão recomendado",
      resultado: "Valor calibrado pela comunidade",
    });
  }
  for (const c of candidates.slice(0, 5)) {
    push(out, {
      value: c,
      uso: "Da dica de ouro",
      resultado: "Sugerido na regra prática",
    });
  }

  return out.slice(0, 6);
}

/**
 * Catálogo de defeitos de impressão FDM conhecidos. Cada entrada define
 * palavras-chave para casar contra o texto do parâmetro (oQueE + oQueGera +
 * porQueAjustar + label) e identificar a quais erros ele está relacionado.
 */
export interface KnownError {
  id: string;
  name: string;
  keywords: string[];
}

export const KNOWN_ERRORS: KnownError[] = [
  {
    id: "elephant-foot",
    name: "Pé de elefante",
    keywords: ["pé de elefante", "pe de elefante", "elephant foot"],
  },
  {
    id: "stringing",
    name: "Stringing",
    keywords: ["stringing", "string", "fios", "teias", "cabelos"],
  },
  {
    id: "warping",
    name: "Warping",
    keywords: ["warping", "warp", "empenamento", "empenar", "descolar", "descolamento"],
  },
  {
    id: "layer-shift",
    name: "Layer shift",
    keywords: ["layer shift", "deslocamento de camada", "camadas deslocadas"],
  },
  {
    id: "ghosting",
    name: "Ghosting / Ringing",
    keywords: ["ghosting", "ringing", "ecos", "ondulaç", "fantasma"],
  },
  { id: "z-wobble", name: "Z-wobble", keywords: ["z-wobble", "z wobble", "wobble", "ondulação z"] },
  {
    id: "under-extrusion",
    name: "Sub-extrusão",
    keywords: [
      "sub-extrus",
      "subextrus",
      "under-extrus",
      "pouco material",
      "falta de material",
      "gaps",
      "buracos",
    ],
  },
  {
    id: "over-extrusion",
    name: "Sobre-extrusão",
    keywords: [
      "sobre-extrus",
      "sobreextrus",
      "over-extrus",
      "excesso de material",
      "blobs",
      "excesso de filamento",
    ],
  },
  {
    id: "blobs-zits",
    name: "Blobs & Zits",
    keywords: ["blob", "zit", "bolha", "bolinhas", "pontos", "seam", "costura"],
  },
  {
    id: "poor-adhesion",
    name: "Má adesão",
    keywords: [
      "adesão",
      "adesao",
      "não gruda",
      "nao gruda",
      "solta da mesa",
      "primeira camada solta",
    ],
  },
  {
    id: "layer-separation",
    name: "Delaminação",
    keywords: [
      "delamin",
      "camadas separando",
      "separação de camadas",
      "layer separation",
      "rachadura entre camadas",
    ],
  },
  { id: "clogging", name: "Entupimento", keywords: ["entupimento", "entupir", "clog", "obstruç"] },
  {
    id: "overheating",
    name: "Superaquecimento",
    keywords: ["superaquec", "derretendo", "melting", "overheat", "peça mole"],
  },
  {
    id: "poor-overhang",
    name: "Overhang ruim",
    keywords: ["overhang", "saliência", "saliencia", "beiral", "inclinaç"],
  },
  { id: "poor-bridge", name: "Bridge ruim", keywords: ["bridge", "ponte", "vão", "vao"] },
  {
    id: "pillowing",
    name: "Pillowing",
    keywords: ["pillowing", "topo furado", "topo aberto", "buracos no topo"],
  },
  {
    id: "top-gap",
    name: "Topo com gaps",
    keywords: ["gap no topo", "falha no topo", "topo com falha", "top infill"],
  },
  {
    id: "poor-seam",
    name: "Costura visível",
    keywords: ["seam", "costura", "cicatriz", "linha vertical"],
  },
  {
    id: "poor-first-layer",
    name: "1ª camada ruim",
    keywords: ["primeira camada", "first layer", "1ª camada", "1a camada"],
  },
  {
    id: "support-scar",
    name: "Marca de suporte",
    keywords: [
      "marca de suporte",
      "cicatriz de suporte",
      "resíduo de suporte",
      "suporte difícil de remover",
      "suporte grudado",
    ],
  },
  {
    id: "poor-detail",
    name: "Perda de detalhes",
    keywords: ["perda de detalhe", "detalhes borrados", "detalhes finos", "sem definição"],
  },
  {
    id: "slow-print",
    name: "Impressão lenta",
    keywords: ["muito lento", "impressão lenta", "tempo alto", "tempo excessivo"],
  },
  { id: "vibration", name: "Vibração", keywords: ["vibração", "vibraç", "trepidaç"] },
  { id: "cracking", name: "Trincas", keywords: ["trinca", "rachadura", "crack", "quebra"] },
];

function itemErrorHaystack(item: CourseItem): string {
  return [
    item.label,
    item.content.oQueE,
    item.content.oQueGera,
    item.content.porQueAjustar,
    item.content.oQueInfluencia,
    ...(item.content.options?.map((o) => `${o.uso} ${o.resultado}`) ?? []),
  ]
    .join(" ")
    .toLowerCase();
}

function getKnownErrorsForItem(item: CourseItem): KnownError[] {
  const hay = itemErrorHaystack(item);
  return KNOWN_ERRORS.filter((err) => err.keywords.some((k) => hay.includes(k.toLowerCase())));
}

const SELECTIONS_STORAGE_KEY = "orcaslicer:infographic:selections";

/**
 * Presets de "Foco especial" — cada receita mapeia IDs de card para valores.
 * Apenas um preset pode estar ativo por vez. Os cards afetados ficam AZUIS.
 */
export interface FocusPreset {
  id: string;
  label: string;
  values: Record<string, string>;
}

export const FOCUS_PRESETS: FocusPreset[] = [
  {
    id: "petg-fosco",
    label: "PETG Fosco",
    values: {
      "nozzle-temp": "235 °C",
      "bed-temp": "75 °C",
      "fan-speed": "40–50%",
      "layer-height": "0,24 mm",
      "outer-wall-speed": "100 mm/s",
      "inner-wall-speed": "180 mm/s",
      "infill-speed": "220 mm/s",
      "filament-flow": "98%",
    },
  },
  {
    id: "petg-brilhante",
    label: "PETG Brilhante",
    values: {
      "nozzle-temp": "245 °C",
      "bed-temp": "75 °C",
      "fan-speed": "10–20%",
      "layer-height": "0,16 mm",
      "outer-wall-speed": "40 mm/s",
      "inner-wall-speed": "150 mm/s",
      "infill-speed": "200 mm/s",
      "filament-flow": "100%",
      "top-surface-pattern": "Monotonic",
    },
  },
  {
    id: "esconder-camadas",
    label: "Esconder linhas de camada",
    values: {
      "layer-height": "0,12 mm",
      "outer-wall-speed": "40 mm/s",
      "wall-generator": "Arachne",
      "top-surface-pattern": "Monotonic",
      "seam-position": "Traseira",
      "scarf-seam": "Ativado",
    },
  },
  {
    id: "textura-aspera",
    label: "Textura áspera",
    values: {
      "nozzle-temp": "240 °C",
      "bed-temp": "75 °C",
      "fan-speed": "80%",
      "layer-height": "0,28 mm",
      "outer-wall-speed": "140 mm/s",
      "inner-wall-speed": "200 mm/s",
      "infill-speed": "240 mm/s",
      "filament-flow": "100%",
      "infill-density": "40%",
      "ironing-type": "Desativado",
    },
  },
  {
    id: "parecer-injetada",
    label: "Parecer peça injetada",
    values: {
      "layer-height": "0,12 mm",
      "top-surface-pattern": "Monotonic",
      "ironing-type": "Superfícies superiores",
      "scarf-seam": "Ativado",
      "wall-order": "Externa/Interna/Preenchimento",
      "wall-generator": "Arachne",
    },
  },
  {
    id: "esconder-seam",
    label: "Esconder a costura",
    values: {
      "scarf-seam": "Ativado",
      "seam-position": "Alinhada",
      "staggered-seam": "Ativado",
      "seam-gap": "10%",
    },
  },
  {
    id: "resistencia-sem-material",
    label: "Resistência sem +material",
    values: {
      "wall-count": "5",
      "wall-generator": "Arachne",
      "infill-density": "20%",
    },
  },
  {
    id: "rapido-sem-perder",
    label: "Rápido sem perder qualidade",
    values: {
      "outer-wall-speed": "40 mm/s",
      "inner-wall-speed": "300 mm/s",
      "infill-speed": "400 mm/s",
      "travel-speed": "500 mm/s",
      "avoid-crossing-walls": "Ativado",
    },
  },
  {
    id: "reduzir-stringing",
    label: "Reduzir stringing",
    values: {
      "nozzle-temp": "205 °C",
      "avoid-crossing-walls": "Ativado",
      "wipe-before-outer-wall": "Ativado",
      "wipe-on-loops": "Ativado",
    },
  },
  {
    id: "topo-perfeito",
    label: "Topo perfeito",
    values: {
      "ironing-type": "Superfícies superiores",
      "top-surface-pattern": "Monotonic",
      "ironing-flow": "12%",
      "ironing-speed": "20 mm/s",
    },
  },
  {
    id: "acetinado",
    label: "Acabamento acetinado",
    values: {
      "nozzle-temp": "230 °C",
      "bed-temp": "70 °C",
      "fan-speed": "40%",
      "layer-height": "0,24 mm",
      "outer-wall-speed": "80 mm/s",
      "inner-wall-speed": "160 mm/s",
      "infill-speed": "200 mm/s",
      "filament-flow": "100%",
    },
  },
  {
    id: "camuflar-defeitos",
    label: "Camuflar defeitos",
    values: {
      "top-surface-pattern": "Hilbert Curve",
      "infill-pattern": "Concentric",
      "internal-solid-infill-pattern": "Monotonic",
    },
  },
  {
    id: "fibra-carbono",
    label: "Textura fibra de carbono",
    values: {
      "top-surface-pattern": "Hilbert Curve",
      "layer-height": "0,28 mm",
      "fan-speed": "100%",
    },
  },
  {
    id: "sla-like",
    label: "Parecer SLA",
    values: {
      "nozzle-temp": "215 °C",
      "bed-temp": "60 °C",
      "fan-speed": "100%",
      "layer-height": "0,08 mm",
      "outer-wall-speed": "30 mm/s",
      "inner-wall-speed": "120 mm/s",
      "infill-speed": "180 mm/s",
      "filament-flow": "100%",
      "ironing-type": "Superfícies superiores",
      "scarf-seam": "Ativado",
      "top-surface-pattern": "Monotonic",
    },
  },
  {
    id: "peca-pesada",
    label: "Peça mais pesada",
    values: {
      "infill-density": "100%",
      "wall-count": "6",
    },
  },
  {
    id: "reduzir-tempo-40",
    label: "Reduzir tempo 40%",
    values: {
      "infill-pattern": "Lightning",
      "infill-density": "10%",
      "wall-generator": "Arachne",
    },
  },
  {
    id: "melhorar-bridges",
    label: "Melhorar bridges",
    values: {
      "bridge-flow": "90%",
      "bridge-speed-external": "25 mm/s",
      "bridge-speed-internal": "25 mm/s",
      "bridge-angle": "0°",
    },
  },
  {
    id: "melhorar-overhang",
    label: "Melhorar overhang",
    values: {
      "slow-down-overhangs": "Ativado",
      "overhang-speed-25": "30 mm/s",
      "overhang-speed-50": "50 mm/s",
      "overhang-speed-75": "80 mm/s",
      "fan-speed": "100%",
    },
  },
  {
    id: "primeira-camada-perfeita",
    label: "1ª camada perfeita",
    values: {
      "first-layer-height": "0,20 mm",
      "first-layer-speed": "30 mm/s",
      "line-width-first-layer": "0,45 mm",
      "elephant-foot-compensation": "0,15 mm",
    },
  },
  {
    id: "silenciar-impressora",
    label: "Silenciar impressora",
    values: {
      "default-acceleration": "1500 mm/s²",
      "jerk-default": "5 mm/s",
      "travel-speed": "200 mm/s",
    },
  },
  {
    id: "soft-touch",
    label: "Soft touch",
    values: {
      "layer-height": "0,28 mm",
      "nozzle-temp": "210 °C",
      "outer-wall-speed": "120 mm/s",
      "fan-speed": "100%",
    },
  },
  {
    id: "esconder-direcao",
    label: "Esconder direção de impressão",
    values: {
      "seam-position": "Aleatória",
      "infill-direction": "45°",
      "top-surface-pattern": "Monotonic",
      "wall-order": "Externa/Interna/Preenchimento",
    },
  },
  {
    id: "resistencia-maxima",
    label: "Resistência máxima",
    values: {
      "wall-count": "6",
      "infill-pattern": "Gyroid",
      "infill-density": "25%",
      "top-layers": "6",
      "bottom-layers": "6",
    },
  },
];

const FOCUS_PRESET_KEY = "orcaslicer:preset:focus";
const getPreset = (id: string | null): FocusPreset | null =>
  FOCUS_PRESETS.find((p) => p.id === id) ?? null;

function loadSelections(): Record<string, string> {
  try {
    const raw =
      typeof window !== "undefined" ? window.localStorage.getItem(SELECTIONS_STORAGE_KEY) : null;
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function InfographicView() {
  const { loading, signedIn, info } = useAccess();
  const [activeTab, setActiveTab] = useState<string>("qualidade");
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<CourseItem | null>(null);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [errorFilter, setErrorFilter] = useState<string | null>(null);
  const [activePresetIds, setActivePresetIds] = useState<string[]>([]);
  const isAdmin = !!info?.isAdmin;
  const nowMs = useNowTick(1000);

  /** Admin destrava tudo; caso contrário usa o cronograma drip a partir do signup. Bypassed to always return true. */
  const isTabUnlocked = (tabId: string): boolean => {
    return true; // Sempre destravado para acesso completo imediato
  };

  // Anti-cópia: bloqueia seleção, botão direito, arrasto e atalhos de DevTools
  // no conteúdo pago. Admin também é protegido (marca d'água + logs continuam).
  useContentProtection(true);

  useEffect(() => {
    setSelections(loadSelections());
    try {
      const saved = window.localStorage.getItem(FOCUS_PRESET_KEY);
      if (saved) {
        // Aceita tanto JSON de array quanto o formato antigo (string única).
        let ids: string[] = [];
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) ids = parsed;
          else if (typeof parsed === "string") ids = [parsed];
        } catch {
          ids = [saved];
        }
        const valid = ids.filter((id) => getPreset(id)).slice(0, 2);
        if (valid.length) setActivePresetIds(valid);
      }
    } catch {}
  }, []);

  const setSelection = (itemId: string, value: string) => {
    setSelections((prev) => {
      const next = { ...prev };
      if (next[itemId] === value) delete next[itemId];
      else next[itemId] = value;
      try {
        window.localStorage.setItem(SELECTIONS_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const activePresets = activePresetIds
    .map((id) => getPreset(id))
    .filter((p): p is FocusPreset => !!p);

  /** Mapa id-do-card → labels dos presets ativos que gerenciam esse card. */
  const presetLabelById = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const p of activePresets) {
      for (const id of Object.keys(p.values)) {
        const arr = m.get(id) ?? [];
        arr.push(p.label);
        m.set(id, arr);
      }
    }
    return m;
  }, [activePresets]);

  const hasAnyState = !!search || !!errorFilter || Object.keys(selections).length > 0;

  const currentTab = courseTabs.find((t) => t.id === activeTab) ?? courseTabs[0];
  const currentTabUnlocked = isTabUnlocked(currentTab.id);

  /** Grupos do módulo Qualidade que ainda estão bloqueados pelo drip por seção. */
  const lockedQualidadeGroupIds = useMemo(() => {
    if (isAdmin) return new Set<string>();
    if (currentTab.id !== "qualidade" || !info) return new Set<string>();
    const locked = new Set<string>();
    for (const g of currentTab.groups) {
      if (!isQualidadeGroupUnlocked(g.id, info.trialStartedAt, new Date(nowMs))) {
        locked.add(g.id);
      }
    }
    return locked;
  }, [currentTab, isAdmin, info, nowMs]);

  const items = useMemo(() => {
    const all: CourseItem[] = currentTab.groups
      .filter((g) => !lockedQualidadeGroupIds.has(g.id))
      .flatMap((g) => g.items);
    let filtered = all;
    if (errorFilter) {
      filtered = filtered.filter((i) => getKnownErrorsForItem(i).some((e) => e.id === errorFilter));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.label.toLowerCase().includes(q) ||
          i.content.oQueE?.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q),
      );
    }
    return filtered;
  }, [currentTab, search, errorFilter, lockedQualidadeGroupIds]);

  // Lista de erros com contagem — só mostra os que aparecem na aba atual
  const errorsInTab = useMemo(() => {
    const all: CourseItem[] = currentTab.groups.flatMap((g) => g.items);
    const counts = new Map<string, { err: KnownError; count: number }>();
    for (const it of all) {
      for (const e of getKnownErrorsForItem(it)) {
        const cur = counts.get(e.id);
        if (cur) cur.count += 1;
        else counts.set(e.id, { err: e, count: 1 });
      }
    }
    return Array.from(counts.values()).sort((a, b) => b.count - a.count);
  }, [currentTab]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center animate-fade-in"
        style={{ background: "#0a0c10" }}
      >
        <div className="text-gray-500 text-sm font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00C896] animate-ping" />
          Carregando o curso...
        </div>
      </div>
    );
  }

  if (!signedIn) {
    return <AuthPage />;
  }

  const clearAll = () => {
    setSelections({});
    setSearch("");
    setErrorFilter(null);
    setActivePresetIds([]);
    try {
      window.localStorage.removeItem(SELECTIONS_STORAGE_KEY);
      window.localStorage.removeItem(FOCUS_PRESET_KEY);
    } catch {}
  };

  /**
   * Ativa/desativa um preset. Até 2 presets podem ficar ativos ao mesmo tempo.
   * Se o novo preset entrar em contradição com algum já ativo (mesmo card com
   * valor diferente), a seleção é ignorada — o botão fica vermelho e desabilitado.
   */
  const selectPreset = (presetId: string) => {
    setActivePresetIds((prev) => {
      let nextIds: string[];
      if (prev.includes(presetId)) {
        nextIds = prev.filter((id) => id !== presetId);
      } else {
        if (prev.length >= 2) return prev; // limite atingido
        const candidate = getPreset(presetId);
        if (!candidate) return prev;
        const conflict = prev.some((activeId) => {
          const active = getPreset(activeId);
          if (!active) return false;
          return Object.entries(candidate.values).some(
            ([k, v]) => k in active.values && active.values[k] !== v,
          );
        });
        if (conflict) return prev;
        nextIds = [...prev, presetId];
      }

      // Todos os IDs mencionados por qualquer preset são "gerenciados"; ao trocar
      // limpamos os anteriores e aplicamos apenas os dos presets ativos agora.
      const managedIds = new Set<string>();
      for (const p of FOCUS_PRESETS) {
        for (const id of Object.keys(p.values)) managedIds.add(id);
      }
      const activePresets = nextIds.map((id) => getPreset(id)).filter((p): p is FocusPreset => !!p);
      setSelections((cur) => {
        const nextSel = { ...cur };
        for (const id of managedIds) delete nextSel[id];
        for (const p of activePresets) {
          for (const [id, v] of Object.entries(p.values)) nextSel[id] = v;
        }
        try {
          window.localStorage.setItem(SELECTIONS_STORAGE_KEY, JSON.stringify(nextSel));
        } catch {}
        return nextSel;
      });
      try {
        if (nextIds.length) window.localStorage.setItem(FOCUS_PRESET_KEY, JSON.stringify(nextIds));
        else window.localStorage.removeItem(FOCUS_PRESET_KEY);
      } catch {}
      return nextIds;
    });
  };

  // Módulo bloqueado pelo drip = painel de cronômetro; senão, todos os itens.
  const isTabLocked = !currentTabUnlocked;
  const visibleItems = items;
  const hiddenCount = 0;

  const handleTabClick = (tabId: string) => {
    // Mesmo travado, permitimos abrir a aba — o painel mostrará o cronômetro.
    setActiveTab(tabId);
  };

  return (
    <div className="flex-1 min-w-0 overflow-y-auto" style={{ background: "#0a0c10" }}>
      <AccessTopBar info={info} />
      {/* Hero header */}
      <div
        className="px-8 pt-10 pb-8"
        style={{
          background:
            "radial-gradient(1200px 400px at 20% -10%, rgba(0,200,150,0.12), transparent 60%), radial-gradient(900px 400px at 90% 0%, rgba(96,165,250,0.10), transparent 60%)",
          borderBottom: "1px solid #1a1d25",
        }}
      >
        <div className="max-w-[1400px] mx-auto flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em]"
              style={{ background: "#00C89622", color: "#00C896", border: "1px solid #00C89644" }}
            >
              Novo · Modo Infográfico
            </span>
            <span className="text-[11px] text-gray-500">Leitura rápida · Guia visual</span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-black tracking-tight text-white leading-[1.05]"
            style={{ letterSpacing: "-0.02em" }}
          >
            Parâmetros do OrcaSlicer,{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00C896 0%, #60a5fa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              em um piscar de olhos.
            </span>
          </h1>
          <p className="text-gray-400 text-[15px] max-w-2xl leading-relaxed">
            Cada card resume um parâmetro em blocos visuais: o que é, por que ajustar e as opções
            mais usadas. Clique para abrir o guia completo com imagem.
          </p>

          {/* Tabs + search */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div
              className="flex items-center gap-1 p-1 rounded-full"
              style={{ background: "#12151c", border: "1px solid #1f2430" }}
            >
              {courseTabs.map((t) => {
                const active = t.id === activeTab;
                const locked = !isTabUnlocked(t.id);
                const unlockDate = info ? getModuleUnlockDate(t.id, info.trialStartedAt) : null;
                const msLeft = unlockDate ? unlockDate.getTime() - nowMs : 0;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleTabClick(t.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all relative"
                    style={{
                      background: active ? "#00C896" : "transparent",
                      color: active ? "#0a0c10" : locked ? "#4b5563" : "#8b949e",
                      opacity: locked ? 0.6 : 1,
                    }}
                    title={
                      locked && unlockDate
                        ? `Libera em ${formatCountdown(msLeft)} (${unlockDate.toLocaleString("pt-BR")})`
                        : undefined
                    }
                  >
                    {locked && <Lock size={11} />}
                    {tabIcons[t.id]}
                    {t.label}
                    {locked && msLeft > 0 && (
                      <span
                        className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold tabular-nums"
                        style={{
                          background: "#00C89622",
                          color: "#00C896",
                          border: "1px solid #00C89644",
                        }}
                      >
                        {formatCountdown(msLeft)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div
              className="flex items-center gap-2 px-3 h-9 rounded-full flex-1 min-w-[240px] max-w-[420px]"
              style={{ background: "#12151c", border: "1px solid #1f2430" }}
            >
              <Search size={14} className="text-gray-500 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar parâmetro…"
                className="bg-transparent outline-none text-xs text-gray-200 placeholder:text-gray-600 w-full"
              />
            </div>

            <button
              onClick={clearAll}
              disabled={!hasAnyState}
              title="Limpar buscas, filtros e marcações"
              className="flex items-center gap-1.5 px-3 h-9 rounded-full text-[11px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:text-white"
              style={{
                background: hasAnyState ? "#c084fc18" : "#12151c",
                border: hasAnyState ? "1px solid #c084fc55" : "1px solid #1f2430",
                color: hasAnyState ? "#e9d5ff" : "#6b7280",
              }}
            >
              <RotateCcw size={12} />
              Limpar tudo
            </button>

            <button
              onClick={() => exportCourseAsPdf(selections)}
              title="Baixar PDF com todos os parâmetros e valores recomendados"
              className="flex items-center gap-1.5 px-3 h-9 rounded-full text-[11px] font-semibold transition-all hover:text-white"
              style={{
                background: "#00C89622",
                border: "1px solid #00C89655",
                color: "#00C896",
              }}
            >
              <Download size={12} />
              Baixar PDF
            </button>
          </div>

          {/* Foco especial — presets de receitas de impressão */}
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center gap-2">
              <Zap size={12} style={{ color: "#60a5fa" }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                Foco especial
              </span>
              {activePresetIds.length > 0 && (
                <button
                  onClick={() => {
                    setActivePresetIds([]);
                    const managedIds = new Set<string>();
                    for (const p of FOCUS_PRESETS)
                      for (const id of Object.keys(p.values)) managedIds.add(id);
                    setSelections((cur) => {
                      const next = { ...cur };
                      for (const id of managedIds) delete next[id];
                      try {
                        window.localStorage.setItem(SELECTIONS_STORAGE_KEY, JSON.stringify(next));
                      } catch {}
                      return next;
                    });
                    try {
                      window.localStorage.removeItem(FOCUS_PRESET_KEY);
                    } catch {}
                  }}
                  className="text-[10px] font-semibold text-gray-500 hover:text-white underline"
                >
                  limpar
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {FOCUS_PRESETS.map((p) => {
                const active = activePresetIds.includes(p.id);
                // Conflito: outro preset ativo mexe no mesmo card com valor diferente.
                const conflict =
                  !active &&
                  activePresets.some((ap) =>
                    Object.entries(p.values).some(([k, v]) => k in ap.values && ap.values[k] !== v),
                  );
                const atCap = !active && !conflict && activePresetIds.length >= 2;
                const disabled = conflict || atCap;
                let bg = "#60a5fa18";
                let color = "#93c5fd";
                let border = "1px solid #60a5fa44";
                if (active) {
                  bg = "#60a5fa";
                  color = "#0a0c10";
                  border = "1px solid #60a5fa";
                } else if (conflict) {
                  bg = "#ef444422";
                  color = "#fca5a5";
                  border = "1px solid #ef444466";
                } else if (atCap) {
                  bg = "#60a5fa10";
                  color = "#60a5fa66";
                  border = "1px solid #60a5fa22";
                }
                const title = conflict
                  ? `Em contradição com um preset ativo — não pode ser combinado`
                  : atCap
                    ? "Limite de 2 focos ativos"
                    : `Aplica os valores recomendados para ${p.label}`;
                return (
                  <button
                    key={p.id}
                    onClick={() => !disabled && selectPreset(p.id)}
                    disabled={disabled}
                    title={title}
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all inline-flex items-center gap-1.5 disabled:cursor-not-allowed"
                    style={{ background: bg, color, border }}
                  >
                    {active && <Check size={10} />}
                    {conflict && <AlertTriangle size={10} />}
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtro por erro conhecido */}
          {errorsInTab.length > 0 && (
            <div className="flex flex-col gap-2 mt-1">
              <div className="flex items-center gap-2">
                <AlertTriangle size={12} style={{ color: "#c084fc" }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                  Filtrar por erro conhecido
                </span>
                {errorFilter && (
                  <button
                    onClick={() => setErrorFilter(null)}
                    className="text-[10px] font-semibold text-gray-500 hover:text-white underline"
                  >
                    limpar
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {errorsInTab.map(({ err, count }) => {
                  const active = errorFilter === err.id;
                  return (
                    <button
                      key={err.id}
                      onClick={() => setErrorFilter(active ? null : err.id)}
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all"
                      style={{
                        background: active ? "#c084fc" : "#c084fc18",
                        color: active ? "#1a1230" : "#e9d5ff",
                        border: active ? "1px solid #c084fc" : "1px solid #c084fc44",
                      }}
                    >
                      {err.name}
                      <span className="ml-1.5 opacity-70" style={{ fontSize: "10px" }}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bento grid of cards */}
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {isTabLocked ? (
          <LockedTabPanel
            tabLabel={currentTab.label}
            moduleId={currentTab.id}
            info={info}
            nowMs={nowMs}
          />
        ) : items.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-20">
            Nenhum parâmetro encontrado para "{search}".
          </div>
        ) : (
          <>
            {currentTab.id === "qualidade" && info && !isAdmin && (
              <QualidadeSectionsStatus trialStartedAt={info.trialStartedAt} nowMs={nowMs} />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {visibleItems.map((item, idx) => (
                <InfoCard
                  key={item.id}
                  item={item}
                  index={idx}
                  onOpen={() => setSelected(item)}
                  selectedValue={selections[item.id]}
                  onSelectValue={(v) => setSelection(item.id, v)}
                  isPreset={
                    presetLabelById.has(item.id) &&
                    activePresets.some((p) => p.values[item.id] === selections[item.id])
                  }
                  presetLabel={presetLabelById.get(item.id)?.join(" + ")}
                />
              ))}
            </div>
            {hiddenCount > 0 && null}
          </>
        )}
      </div>

      <CoursePanel item={selected} onClose={() => setSelected(null)} />
      <SuggestionsButton />
    </div>
  );
}

export function InfoCard({
  item,
  index,
  onOpen,
  selectedValue,
  onSelectValue,
  isPreset,
  presetLabel,
}: {
  item: CourseItem;
  index: number;
  onOpen: () => void;
  selectedValue?: string;
  onSelectValue: (value: string) => void;
  isPreset?: boolean;
  presetLabel?: string;
}) {
  const guide = getGuideImageForItem(item.id, item.label, item.value);
  const opts = getDisplayOptions(item);
  const accent = isPreset ? "#60a5fa" : "#00C896";
  const accentSoft = isPreset ? "rgba(96,165,250,0.15)" : "rgba(0,200,150,0.15)";

  return (
    <div
      className="group text-left rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "linear-gradient(180deg, #14181f 0%, #10131a 100%)",
        border: selectedValue
          ? `1px solid ${isPreset ? "#60a5faaa" : "#00C89688"}`
          : "1px solid #1f2430",
        boxShadow: "0 1px 0 rgba(255,255,255,0.03) inset, 0 20px 40px -20px rgba(0,0,0,0.6)",
        animation: `fadeUp 0.5s ease ${Math.min(index * 40, 400)}ms both`,
      }}
    >
      {/* Image header with guide image */}
      <button
        onClick={onOpen}
        className="relative overflow-hidden w-full block text-left cursor-pointer"
        style={{ borderBottom: "1px solid #1f2430" }}
      >
        <img
          src={guide.src}
          alt={item.label}
          className="w-full h-28 object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const img = e.currentTarget;
            if (guide.fallbackSrc && guide.fallbackSrc !== img.src) {
              img.src = guide.fallbackSrc;
            } else {
              img.style.display = "none";
              const fallback = img.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = "flex";
            }
          }}
        />
        <div
          className="w-full h-28 items-center justify-center"
          style={{
            display: "none",
            background: "linear-gradient(135deg, rgba(0,200,150,0.12), rgba(96,165,250,0.10))",
          }}
        >
          <span className="text-gray-600 text-xs uppercase tracking-wider">Guia Visual</span>
        </div>
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, transparent 40%, rgba(10,12,16,0.85) 100%)",
          }}
        />
        <div className="absolute bottom-2.5 left-4 flex items-center gap-1.5">
          <span
            className="px-2.5 py-0.5 rounded-md text-[9.5px] font-bold uppercase tracking-wider"
            style={{
              background: "#0a0c10cc",
              color: "#00C896",
              border: "1px solid #00C89655",
              backdropFilter: "blur(6px)",
            }}
          >
            Padrão · {item.value}
          </span>
        </div>
        {selectedValue && (
          <div className="absolute top-2.5 right-4">
            <span
              className="px-2.5 py-0.5 rounded-md text-[9.5px] font-bold uppercase tracking-wider flex items-center gap-1"
              style={{ background: accent, color: "#0a0c10" }}
            >
              <Check size={10} /> {isPreset ? (presetLabel ?? "Preset") : "Selecionado"}
            </span>
          </div>
        )}
      </button>

      <div className="p-5 flex flex-col gap-4 flex-1">
        <h3 className="text-[17px] font-bold text-white leading-tight tracking-tight">
          {item.label}
        </h3>

        <p className="text-[14px] text-gray-300 leading-relaxed font-medium">
          <span className="text-[#00C896] font-bold">Regra prática: </span>
          {extractKeyRule(item.content.oQueE)}
        </p>

        {/* Mini pill stats — Dica de Ouro + Consequência */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <MiniStat
            icon={<Trophy size={12} />}
            color="#facc15"
            label="Dica de Ouro"
            text={item.content.regraDeOuro}
          />
          <MiniStat
            icon={<Zap size={12} />}
            color="#fb923c"
            label="Consequência"
            text={item.content.oQueGera}
          />
        </div>

        {/* Erros conhecidos — chips lilás com nomes canônicos (pé de elefante, stringing, warping, ...) */}
        {(() => {
          const errors = getKnownErrorsForItem(item);
          if (errors.length === 0) return null;
          return (
            <div
              className="rounded-lg p-3 flex flex-col gap-2 min-w-0"
              style={{ background: "#1a1230", border: "1px solid #c084fc55" }}
            >
              <div className="flex items-center gap-1.5" style={{ color: "#c084fc" }}>
                <AlertTriangle size={12} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Erros conhecidos
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {errors.map((err) => (
                  <span
                    key={err.id}
                    className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                    style={{
                      background: "#c084fc22",
                      color: "#e9d5ff",
                      border: "1px solid #c084fc55",
                    }}
                  >
                    {err.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Options grid — clique para selecionar */}
        {opts.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Clique no valor para selecionar
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {opts.map((o: DisplayOption, i: number) => {
                const cleanValue = o.value
                  .replace(/\s*—\s*PADRÃO.*$/i, "")
                  .replace(/\s+do\s+padrão$/i, "")
                  .trim();
                const isSelected = selectedValue === cleanValue;
                return (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectValue(cleanValue);
                    }}
                    className="rounded-lg p-2.5 flex flex-col gap-1 text-left transition-all hover:-translate-y-0.5"
                    style={{
                      background: isSelected ? (isPreset ? "#60a5fa14" : "#00C89614") : "#0c0f14",
                      border: isSelected ? `1.5px solid ${accent}` : "1px solid #1a1e28",
                      boxShadow: isSelected ? `0 0 0 3px ${accentSoft}` : "none",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className="font-mono text-[13px] font-bold leading-none"
                        style={{ color: accent }}
                      >
                        {cleanValue}
                      </div>
                      {isSelected && <Check size={12} style={{ color: accent }} />}
                    </div>
                    <div className="text-[12px] font-semibold text-gray-100 leading-snug">
                      {o.uso}
                    </div>
                    <div className="text-[11.5px] text-gray-500 leading-snug">{o.resultado}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Caixa do valor final — o que o aluno digita no OrcaSlicer */}
        <div
          className="rounded-lg p-3 flex items-center justify-between gap-3"
          style={{
            background: isPreset ? "#60a5fa14" : "#00C89614",
            border: `1.5px solid ${isPreset ? "#60a5fa66" : "#00C89666"}`,
            boxShadow: isPreset
              ? "0 0 0 3px rgba(96,165,250,0.10)"
              : "0 0 0 3px rgba(0,200,150,0.08)",
          }}
        >
          <div className="flex flex-col gap-0.5 min-w-0">
            <span
              className="text-[9.5px] font-bold uppercase tracking-widest"
              style={{ color: accent }}
            >
              {isPreset
                ? `${presetLabel ?? "Preset"} · digite no OrcaSlicer`
                : `${selectedValue ? "Valor selecionado" : "Valor padrão"} · digite no OrcaSlicer`}
            </span>
            <span className="font-mono font-bold text-white text-[15px] leading-tight break-all">
              {selectedValue || item.value || "—"}
            </span>
          </div>
          {selectedValue && selectedValue !== item.value && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectValue("");
              }}
              className="text-[10px] font-semibold text-gray-400 hover:text-white transition-colors flex-shrink-0"
              title="Voltar para o padrão"
            >
              Resetar
            </button>
          )}
        </div>

        <button
          onClick={onOpen}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 hover:text-[#00C896] transition-colors mt-auto pt-1"
        >
          <Info size={12} />
          Ver guia completo
        </button>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function MiniStat({
  icon,
  color,
  label,
  text,
}: {
  icon: React.ReactNode;
  color: string;
  label: string;
  text: string;
}) {
  return (
    <div
      className="rounded-lg px-3 py-2.5 flex flex-col gap-1.5 min-w-0"
      style={{ background: "#0c0f14", border: "1px solid #1a1e28" }}
    >
      <div className="flex items-center gap-1.5" style={{ color }}>
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-[12px] text-gray-300 leading-relaxed">{text}</span>
    </div>
  );
}

import type { AccessInfo } from "@/lib/access.functions";

/** Barra superior: usuário + status do trial + logout. */
function AccessTopBar({ info }: { info: AccessInfo | null }) {
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

  if (!info) return null;

  return (
    <div
      className="w-full px-8 h-14 flex items-center justify-between gap-4"
      style={{
        background: "rgba(10,12,16,0.85)",
        borderBottom: "1px solid #1a1d25",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[13px]"
          style={{
            background: info.isAdmin ? "#facc1522" : "#00C89622",
            color: info.isAdmin ? "#facc15" : "#00C896",
            border: `1px solid ${info.isAdmin ? "#facc1555" : "#00C89655"}`,
          }}
        >
          {(info.displayName || info.email)[0]?.toUpperCase()}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[13px] font-bold text-white truncate">
            {info.displayName || info.email}
          </span>
          <span className="text-[11px] text-gray-500 truncate">{info.email}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {info.isAdmin ? (
          <a
            href="/admin"
            className="flex items-center gap-1.5 px-3 h-8 rounded-full text-[11px] font-bold uppercase tracking-wider hover:opacity-90 transition"
            style={{ background: "#facc1522", color: "#facc15", border: "1px solid #facc1555" }}
            title="Abrir painel admin"
          >
            <Crown size={12} /> Painel Admin
          </a>
        ) : (
          <span
            className="flex items-center gap-1.5 px-3 h-8 rounded-full text-[11px] font-bold uppercase tracking-wider"
            style={{ background: "#00C89622", color: "#00C896", border: "1px solid #00C89655" }}
          >
            <Check size={12} /> Aluno · Liberação progressiva
          </span>
        )}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 px-3 h-8 rounded-full text-[11px] font-semibold text-gray-400 hover:text-white transition-colors"
          style={{ background: "#12151c", border: "1px solid #1f2430" }}
        >
          <LogOut size={12} /> Sair
        </button>
      </div>
    </div>
  );
}

function LockedTabPanel({
  tabLabel,
  moduleId,
  info,
  nowMs,
}: {
  tabLabel: string;
  moduleId: string;
  info: AccessInfo | null;
  nowMs: number;
}) {
  const unlockDate = info ? getModuleUnlockDate(moduleId, info.trialStartedAt) : null;
  const msLeft = unlockDate ? Math.max(0, unlockDate.getTime() - nowMs) : 0;
  const dayOffset = MODULE_UNLOCK_DAYS[moduleId] ?? 0;

  return (
    <div
      className="rounded-2xl p-12 flex items-center justify-center"
      style={{
        background: "linear-gradient(180deg, #14181f 0%, #10131a 100%)",
        border: "1px solid #1f2430",
      }}
    >
      <div className="flex flex-col items-center gap-5 text-center max-w-lg">
        <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
          Módulo {tabLabel} · Ainda bloqueado
        </div>

        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #00C89622, #60a5fa22)",
            border: "1px solid #00C89644",
          }}
        >
          <Clock size={32} style={{ color: "#00C896" }} />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-black text-white tracking-tight">Libera em</h3>
          <div
            className="text-5xl font-black font-mono tabular-nums tracking-tight mt-1"
            style={{
              background: "linear-gradient(135deg, #00C896 0%, #60a5fa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {formatCountdown(msLeft)}
          </div>
          {unlockDate && (
            <p className="text-gray-500 text-xs mt-2">
              Liberação agendada para{" "}
              <span className="text-gray-300 font-semibold">
                {unlockDate.toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
          )}
        </div>

        <p className="text-gray-400 text-sm">
          Este módulo faz parte da liberação progressiva do curso — abre{" "}
          <span className="text-white font-semibold">
            {dayOffset} {dayOffset === 1 ? "dia" : "dias"}
          </span>{" "}
          após seu cadastro para você ter tempo de dominar cada etapa antes da próxima.
        </p>
      </div>
    </div>
  );
}
function QualidadeSectionsStatus({
  trialStartedAt,
  nowMs,
}: {
  trialStartedAt: string;
  nowMs: number;
}) {
  const now = new Date(nowMs);
  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
      {QUALIDADE_SECTIONS.map((section) => {
        const unlockDate = new Date(new Date(trialStartedAt).getTime() + section.day * 86400000);
        const unlocked = unlockDate.getTime() <= now.getTime();
        const msLeft = Math.max(0, unlockDate.getTime() - nowMs);
        return (
          <div
            key={section.id}
            className="rounded-2xl p-4 flex flex-col gap-1"
            style={{
              background: unlocked
                ? "linear-gradient(180deg, #14181f 0%, #10131a 100%)"
                : "#10131a",
              border: unlocked ? "1px solid #00C89644" : "1px solid #1f2430",
              opacity: unlocked ? 1 : 0.85,
            }}
          >
            <div className="flex items-center gap-2">
              {unlocked ? (
                <Check size={12} style={{ color: "#00C896" }} />
              ) : (
                <Lock size={12} style={{ color: "#6b7280" }} />
              )}
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: unlocked ? "#00C896" : "#6b7280" }}
              >
                {unlocked ? "Liberada" : `Libera no dia ${section.day}`}
              </span>
            </div>
            <div className="text-white font-bold text-sm">{section.label}</div>
            {!unlocked && (
              <div className="font-mono tabular-nums text-xs mt-1" style={{ color: "#00C896" }}>
                {formatCountdown(msLeft)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
