// src/components/InfoCard.tsx — Card de parâmetro do curso (extraído do InfographicView).
// Módulo leve: NÃO importa Supabase, jsPDF nem a área do aluno, para que a
// página de vendas possa usá-lo sem arrastar o bundle pesado para o visitante.

import type { ReactNode } from "react";
import { AlertTriangle, Check, Info, Trophy, Zap } from "lucide-react";
import type { CourseItem } from "@/data/courseData";
import { getGuideImageForItem } from "@/data/guideImages";

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

export function getKnownErrorsForItem(item: CourseItem): KnownError[] {
  const hay = itemErrorHaystack(item);
  return KNOWN_ERRORS.filter((err) => err.keywords.some((k) => hay.includes(k.toLowerCase())));
}

function MiniStat({
  icon,
  color,
  label,
  text,
}: {
  icon: ReactNode;
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
          loading="lazy"
          decoding="async"
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
