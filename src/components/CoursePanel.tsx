import {
  X,
  ChevronRight,
  Info,
  HelpCircle,
  Activity,
  Zap,
  Settings,
} from "lucide-react";
import type { CourseItem } from "@/data/courseData";

interface CoursePanelProps {
  item: CourseItem | null;
  onClose: () => void;
}

export function CoursePanel({ item, onClose }: CoursePanelProps) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative h-full w-full max-w-[1400px] overflow-y-auto shadow-2xl p-6 rounded-2xl"
        style={{ background: "#0d0f13", border: "1px solid #2a2e3a" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex flex-col gap-4">
          {/* Header Panel */}
          <header
            className="rounded-2xl p-6 flex items-start justify-between gap-4 shadow-xl"
            style={{ background: "#1a1d24", border: "1px solid #2a2e3a" }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    background: "#00C89622",
                    color: "#00C896",
                    border: "1px solid #00C89644",
                  }}
                >
                  Parâmetro OrcaSlicer
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
                {item.label}
              </h1>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-semibold text-gray-500 tracking-wider">
                    Valor Padrão
                  </span>
                  <span className="text-xl font-bold font-mono text-[#00C896]">{item.value}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/5 text-gray-500 transition-colors flex-shrink-0"
            >
              <X size={20} />
            </button>
          </header>

          {/* Guia visual + explicações compactas lado a lado */}
          {/* Explicações concisas de largura total */}
          <div
            className="rounded-2xl p-5 shadow-lg"
            style={{ background: "#1a1d24", border: "1px solid #2a2e3a" }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
              <MiniInfo
                title="O que é"
                icon={<Info size={12} />}
                color="#60a5fa"
                text={item.content.oQueE}
              />
              <MiniInfo
                title="Por que ajustar"
                icon={<HelpCircle size={12} />}
                color="#f59e0b"
                text={item.content.porQueAjustar}
              />
              <MiniInfo
                title="Influencia"
                icon={<Activity size={12} />}
                color="#34d399"
                text={item.content.oQueInfluencia}
              />
              <MiniInfo
                title="Consequência"
                icon={<Zap size={12} />}
                color="#fb923c"
                text={item.content.oQueGera}
              />
            </div>
          </div>

          {/* Tabela Resumida + extras abaixo */}
          <div className="grid grid-cols-1 gap-4">
            {item.content.options && item.content.options.length > 0 && (
              <div
                className="rounded-2xl p-6 shadow-lg"
                style={{ background: "#1a1d24", border: "1px solid #2a2e3a" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="p-1.5 rounded-lg"
                    style={{ background: "#a78bfa22", color: "#a78bfa" }}
                  >
                    <Settings size={16} />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                    Opções Disponíveis — o que cada uma faz
                  </h3>
                </div>
                {(() => {
                  const opts = item.content.options.slice(0, 6);
                  const cols = Math.min(opts.length, 6);
                  const gridCols: Record<number, string> = {
                    1: "grid-cols-1",
                    2: "grid-cols-1 sm:grid-cols-2",
                    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
                    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
                    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
                    6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
                  };
                  return (
                    <div className={`grid gap-3 ${gridCols[cols]}`}>
                      {opts.map((opt, i) => (
                        <div
                          key={i}
                          className="rounded-xl p-4 flex flex-col gap-2 transition-all hover:translate-y-[-2px]"
                          style={{ background: "#161920", border: "1px solid #2a2e3a" }}
                        >
                          <div className="font-mono font-bold text-[#00C896] text-lg leading-none">
                            {opt.value}
                          </div>
                          <div className="h-px w-full" style={{ background: "#2a2e3a" }} />
                          <div className="text-[13px] font-semibold text-gray-100 leading-snug">
                            {opt.uso}
                          </div>
                          <div className="text-[12.5px] text-gray-400 leading-snug">
                            {opt.resultado}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {item.content.comoConfigurar && (
              <InfoCard title="COMO CONFIGURAR" icon={<Settings size={16} />} color="#38bdf8">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-black/20 border border-white/5">
                  <ChevronRight size={18} className="text-[#38bdf8] mt-0.5 flex-shrink-0" />
                  <p className="text-base leading-relaxed text-gray-200 font-medium italic">
                    {item.content.comoConfigurar}
                  </p>
                </div>
              </InfoCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  icon,
  color,
  children,
  className = "",
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl p-6 shadow-lg transition-all hover:translate-y-[-2px] ${className}`}
      style={{ background: "#1a1d24", border: "1px solid #2a2e3a" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg" style={{ background: `${color}22`, color }}>
          {icon}
        </div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function MiniInfo({
  title,
  icon,
  color,
  text,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  text: string;
}) {
  // Resumo automático: primeira frase (até ponto final) para manter conciso.
  const summary = (() => {
    if (!text) return "";
    const match = text.match(/^[^.!?]{0,180}[.!?]/);
    const first = (match ? match[0] : text).trim();
    return first.length > 180 ? first.slice(0, 177).trimEnd() + "…" : first;
  })();
  return (
    <div
      className="rounded-xl p-3.5 flex flex-col gap-2 min-w-0"
      style={{ background: "#161920", border: "1px solid #2a2e3a" }}
    >
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-md" style={{ background: `${color}22`, color }}>
          <span className="flex" style={{ transform: "scale(1.15)" }}>
            {icon}
          </span>
        </div>
        <h4 className="text-[11px] font-bold uppercase tracking-widest" style={{ color }}>
          {title}
        </h4>
      </div>
      <p className="text-[13.5px] leading-relaxed text-gray-200">{summary}</p>
    </div>
  );
}
