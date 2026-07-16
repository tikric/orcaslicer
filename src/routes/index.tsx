import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Check,
  Rocket,
  Layers,
  Zap,
  Wrench,
  Target,
  Trophy,
  Star,
  Clock,
  RefreshCw,
  Lock,
  ChevronRight,
  Play,
  BadgeCheck,
} from "lucide-react";
import { courseTabs } from "@/data/courseData";
import heroParts from "@/assets/hero-parts.jpg";
import { InfoCard } from "@/components/InfoCard";
import { Reveal } from "@/components/Reveal";

/** Link do checkout Kiwify — troque pela sua URL de venda. */
const KIWIFY_URL = "https://pay.kiwify.com.br/8Kj7UMH";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Curso OrcaSlicer Pro — Do zero ao slicing perfeito por R$ 39,90" },
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
  component: SalesPage,
});

/** Preview ao vivo — lê os dados reais do curso; atualiza automaticamente. */
function LiveCoursePreview() {
  const qualidade = courseTabs.find((t) => t.id === "qualidade") ?? courseTabs[0];
  const allItems = qualidade.groups.flatMap((g) => g.items);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % Math.min(allItems.length, 6)), 3800);
    return () => clearInterval(id);
  }, [allItems.length]);

  const item = allItems[idx] ?? allItems[0];
  const totalParams = useMemo(
    () => courseTabs.reduce((acc, t) => acc + t.groups.reduce((a, g) => a + g.items.length, 0), 0),
    [],
  );

  return (
    <div
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #10131a 0%, #0a0c10 100%)",
        border: "1px solid #1f2430",
        boxShadow: "0 30px 80px -20px rgba(0,200,150,0.25), 0 0 0 1px rgba(255,255,255,0.02) inset",
      }}
    >
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ background: "#0c0f14", borderColor: "#1f2430" }}
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
        <div className="flex-1 text-center text-[11px] text-gray-500 tracking-wide">
          orcaslicer.pro / curso / {qualidade.label.toLowerCase()}
        </div>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-bold"
          style={{ background: "#00C89622", color: "#00C896", border: "1px solid #00C89655" }}
        >
          AO VIVO
        </span>
      </div>

      <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[180px_1fr] min-h-[420px]">
        <aside
          className="p-2 sm:p-3 border-r flex flex-col gap-1"
          style={{ background: "#0c0f14", borderColor: "#1f2430" }}
        >
          {courseTabs.slice(0, 8).map((t, i) => (
            <div
              key={t.id}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] font-semibold"
              style={{
                background: i === 0 ? "#00C89614" : "transparent",
                color: i === 0 ? "#00C896" : "#6b7280",
                border: i === 0 ? "1px solid #00C89644" : "1px solid transparent",
              }}
            >
              <span className="text-sm">{t.icon}</span>
              <span className="truncate">{t.label}</span>
              {i > 0 && <Lock size={10} className="ml-auto opacity-60" />}
            </div>
          ))}
        </aside>

        <div className="p-4 sm:p-6 min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-3">
            <span>{qualidade.label}</span>
            <ChevronRight size={12} />
            <span className="text-gray-400">{item.label}</span>
          </div>

          <div className="flex flex-wrap items-baseline gap-3 mb-4">
            <h3 className="text-white text-xl sm:text-2xl font-black tracking-tight">
              {item.label}
            </h3>
            <span
              className="text-[13px] font-mono px-2 py-0.5 rounded-md"
              style={{ background: "#00C89614", color: "#00C896", border: "1px solid #00C89644" }}
            >
              {item.value}
            </span>
          </div>

          <p className="text-gray-300 text-[13.5px] leading-relaxed line-clamp-4">
            {item.content.oQueE}
          </p>

          <div
            className="mt-5 p-4 rounded-xl"
            style={{ background: "#00C89608", border: "1px solid #00C89633" }}
          >
            <div className="text-[10px] uppercase font-black tracking-widest text-[#00C896] mb-1.5">
              Regra de ouro
            </div>
            <p className="text-gray-200 text-[13px] leading-relaxed line-clamp-2">
              {item.content.regraDeOuro}
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between text-[11px] text-gray-500">
            <span>
              {totalParams}+ parâmetros documentados · {courseTabs.length} módulos
            </span>
            <div className="flex gap-1">
              {allItems.slice(0, 6).map((_, i) => (
                <span
                  key={i}
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: i === idx ? 18 : 6,
                    background: i === idx ? "#00C896" : "#2a2e3a",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Amostra grátis — renderiza os 15 primeiros parâmetros de Qualidade usando o mesmo InfoCard da tela interna. */
function FreeSamplePreview() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const qualidade = courseTabs.find((t) => t.id === "qualidade") ?? courseTabs[0];
  const items = qualidade.groups.flatMap((g) => g.items).slice(0, 15);
  const totalParams = useMemo(
    () => courseTabs.reduce((acc, t) => acc + t.groups.reduce((a, g) => a + g.items.length, 0), 0),
    [],
  );
  const noop = () => {};

  if (!isMounted) {
    return (
      <div className="relative" suppressHydrationWarning>
        {/* Grid idêntica à tela interna do curso com skeletons pulsantes */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          suppressHydrationWarning
        >
          {items.map((it) => (
            <div
              key={it.id}
              className="rounded-2xl h-[420px] border border-[#1f2430] flex flex-col p-5 gap-4"
              style={{
                background: "linear-gradient(180deg, #14181f 0%, #10131a 100%)",
              }}
              suppressHydrationWarning
            >
              <div className="h-40 rounded-xl bg-white/5 animate-pulse" />
              <div className="h-6 w-2/3 rounded bg-white/5 animate-pulse" />
              <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
              <div className="h-10 w-full rounded bg-white/5 animate-pulse" />
              <div className="h-20 w-full rounded bg-white/5 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Fade + CTA de desbloqueio sobre a parte borrada */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,12,16,0) 0%, rgba(10,12,16,0.9) 50%, #0a0c10 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-4 pb-8">
          <div
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(10,12,16,0.75)",
              color: "#00C896",
              border: "1px solid #00C89655",
              backdropFilter: "blur(6px)",
            }}
          >
            <Lock size={12} /> +{totalParams - 15} parâmetros bloqueados
          </div>
          <a
            href={KIWIFY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 px-6 rounded-xl font-bold text-sm flex items-center gap-2 transition-all hover:translate-y-[-1px]"
            style={{
              background: "#00C896",
              color: "#0a0c10",
              boxShadow: "0 12px 30px -8px rgba(0,200,150,0.55)",
              pointerEvents: "auto",
            }}
          >
            <Rocket size={15} />
            Desbloquear tudo por R$ 39,90
          </a>
          <span className="text-[11px] text-gray-500">Acesso vitalício · Garantia de 7 dias</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Grid idêntica à tela interna do curso */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((it, i) => {
          // 0-2 nítido, 3-8 blur leve, 9-14 blur forte
          const blur = i < 3 ? 0 : i < 9 ? 4 : 9;
          const opacity = i < 3 ? 1 : i < 9 ? 0.85 : 0.55;
          return (
            <div
              key={it.id}
              style={{
                filter: blur ? `blur(${blur}px)` : undefined,
                opacity,
                pointerEvents: blur ? "none" : "auto",
                userSelect: blur ? "none" : "auto",
                transition: "filter 300ms, opacity 300ms",
              }}
              aria-hidden={blur > 0 ? "true" : undefined}
            >
              <InfoCard item={it} index={i} onOpen={noop} onSelectValue={noop} />
            </div>
          );
        })}
      </div>

      {/* Fade + CTA de desbloqueio sobre a parte borrada */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,12,16,0) 0%, rgba(10,12,16,0.9) 50%, #0a0c10 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-4 pb-8">
        <div
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
          style={{
            background: "rgba(10,12,16,0.75)",
            color: "#00C896",
            border: "1px solid #00C89655",
            backdropFilter: "blur(6px)",
          }}
        >
          <Lock size={12} /> +{totalParams - 15} parâmetros bloqueados
        </div>
        <a
          href={KIWIFY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="h-12 px-6 rounded-xl font-bold text-sm flex items-center gap-2 transition-all hover:translate-y-[-1px]"
          style={{
            background: "#00C896",
            color: "#0a0c10",
            boxShadow: "0 12px 30px -8px rgba(0,200,150,0.55)",
            pointerEvents: "auto",
          }}
        >
          <Rocket size={15} />
          Desbloquear tudo por R$ 39,90
        </a>
        <span className="text-[11px] text-gray-500">Acesso vitalício · Garantia de 7 dias</span>
      </div>
    </div>
  );
}

export function SalesPage() {
  const modules = courseTabs.map((t) => ({
    icon: t.icon,
    label: t.label,
    count: t.groups.reduce((a, g) => a + g.items.length, 0),
  }));
  const totalParams = modules.reduce((a, m) => a + m.count, 0);

  // Header fixo: blur ao rolar + barra de progresso + CTA mobile.
  const [scrolled, setScrolled] = useState(false);
  const [showMobileCta, setShowMobileCta] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        setShowMobileCta(y > 720);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, y / max) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{
        background:
          "radial-gradient(1200px 600px at 15% -10%, rgba(0,200,150,0.12), transparent 60%), radial-gradient(900px 500px at 90% 10%, rgba(96,165,250,0.08), transparent 60%), #0a0c10",
      }}
    >
      {/* HEADER FIXO */}
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(10,12,16,0.82)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? "1px solid #1f2430" : "1px solid transparent",
        }}
      >
        {/* Barra de progresso de leitura */}
        <div
          className="absolute top-0 left-0 h-[2px] transition-[width] duration-150 ease-out"
          style={{
            width: `${progress * 100}%`,
            background: "linear-gradient(90deg, #00C896, #00e2aa)",
            boxShadow: "0 0 8px rgba(0,200,150,0.6)",
          }}
        />
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          <a href="#topo" className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "#00C89622", border: "1px solid #00C89655" }}
            >
              <Sparkles size={16} style={{ color: "#00C896" }} />
            </div>
            <span className="font-bold tracking-tight">
              OrcaSlicer <span style={{ color: "#00C896" }}>Pro</span>
            </span>
          </a>
          <div className="hidden md:flex items-center gap-6 text-[13px] font-semibold text-gray-400">
            <a href="#preview" className="hover:text-white transition-colors">
              Prévia
            </a>
            <a href="#modulos" className="hover:text-white transition-colors">
              Módulos
            </a>
            <a href="#depoimentos" className="hover:text-white transition-colors">
              Depoimentos
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={KIWIFY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex text-[13px] font-bold px-4 py-2 rounded-lg transition-all hover:translate-y-[-1px]"
              style={{
                background: "#00C896",
                color: "#0a0c10",
                boxShadow: "0 8px 20px -8px rgba(0,200,150,0.55)",
              }}
            >
              R$ 39,90 · Começar
            </a>
            <Link
              to="/curso"
              className="text-[13px] font-semibold px-4 py-2 rounded-lg transition-all hover:opacity-90"
              style={{ background: "#ffffff08", color: "#e5e7eb", border: "1px solid #1f2430" }}
            >
              Já sou aluno
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section
        id="topo"
        className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-20 grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-center"
      >
        {/* Grade sutil de fundo */}
        <div
          className="absolute inset-0 -z-10 pointer-events-none opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(70% 60% at 40% 30%, black, transparent)",
            WebkitMaskImage: "radial-gradient(70% 60% at 40% 30%, black, transparent)",
          }}
        />
        <div>
          <div
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
            style={{ background: "#00C89614", color: "#00C896", border: "1px solid #00C89655" }}
          >
            <BadgeCheck size={12} />
            Curso oficial · Atualizações vitalícias
          </div>

          <h1 className="text-[2rem] sm:text-5xl md:text-6xl font-black tracking-[-0.03em] leading-[1.05] break-words">
            Do zero ao <span style={{ color: "#00C896" }}>slicing perfeito</span> no OrcaSlicer.
          </h1>

          <p className="text-gray-300 text-base sm:text-lg mt-6 leading-relaxed max-w-xl">
            O único curso 100% em português que documenta{" "}
            <b className="text-white">cada parâmetro</b> do OrcaSlicer — o porquê, o quanto, e o que
            fazer quando dá errado. Pare de imprimir na tentativa e erro.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-8">
            <a
              href={KIWIFY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:translate-y-[-1px] w-full sm:w-auto"
              style={{
                background: "#00C896",
                color: "#0a0c10",
                boxShadow: "0 12px 30px -8px rgba(0,200,150,0.55)",
              }}
            >
              <Rocket size={16} />
              Quero acessar por R$ 39,90
            </a>
            <a
              href="#preview"
              className="h-12 px-5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 text-gray-200 transition-all hover:bg-white/5 w-full sm:w-auto"
              style={{ border: "1px solid #1f2430" }}
            >
              <Play size={14} /> Ver por dentro
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-8 text-[12px] text-gray-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} style={{ color: "#00C896" }} /> Garantia de 7 dias (devolução)
            </span>
            <span className="flex items-center gap-1.5">
              <RefreshCw size={14} style={{ color: "#00C896" }} /> Atualizado sempre
            </span>
            <span className="flex items-center gap-1.5">
              <Star size={14} style={{ color: "#f5c94e" }} /> 4.9/5 alunos
            </span>
          </div>
        </div>

        <div className="relative">
          <div
            className="absolute -inset-6 rounded-[2rem] blur-3xl opacity-60 pointer-events-none"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 40%, rgba(0,200,150,0.35), transparent 70%)",
            }}
          />
          <div
            className="relative rounded-3xl overflow-hidden group"
            style={{
              border: "1px solid #1f2430",
              boxShadow:
                "0 40px 100px -30px rgba(0,200,150,0.45), 0 0 0 1px rgba(255,255,255,0.03) inset",
            }}
          >
            <img
              src={heroParts}
              alt="Peças 3D impressas com qualidade profissional usando OrcaSlicer"
              width={1600}
              height={1200}
              fetchPriority="high"
              decoding="async"
              className="w-full h-auto block transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
              referrerPolicy="no-referrer"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(180deg, transparent 50%, rgba(10,12,16,0.85) 100%)",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between gap-3">
              <div>
                <div
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full mb-2"
                  style={{
                    background: "rgba(0,200,150,0.15)",
                    color: "#00e2aa",
                    border: "1px solid rgba(0,200,150,0.4)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Sparkles size={10} /> Resultado real de alunos
                </div>
                <div className="text-white font-black text-base sm:text-lg tracking-tight leading-tight">
                  Peças perfeitas.
                  <br />
                  Camada por camada.
                </div>
              </div>
              <div
                className="hidden sm:flex flex-col items-end shrink-0 px-3 py-2 rounded-xl"
                style={{
                  background: "rgba(10,12,16,0.6)",
                  border: "1px solid #1f2430",
                  backdropFilter: "blur(10px)",
                }}
              >
                <span className="text-[10px] uppercase tracking-widest text-gray-400">
                  Nota média
                </span>
                <div className="flex items-center gap-1">
                  <Star size={12} style={{ color: "#f5c94e", fill: "#f5c94e" }} />
                  <span className="text-white font-black text-sm">4.9</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-[11px] text-gray-500 mt-3">
            Imagens ilustrativas — resultados obtidos aplicando o método do curso.
          </p>
        </div>
      </section>

      {/* PRÉVIA AO VIVO */}
      <section id="preview" className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="text-center mb-8">
          <div
            className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
            style={{ background: "#ffffff08", color: "#00C896", border: "1px solid #1f2430" }}
          >
            Veja por dentro
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.02em]">
            Uma prévia do que você <span style={{ color: "#00C896" }}>vai aprender</span>.
          </h2>
        </div>
        <LiveCoursePreview />
        <p className="text-center text-[11px] text-gray-500 mt-3">
          Prévia em tempo real do conteúdo do curso — atualiza automaticamente.
        </p>
      </section>

      {/* AMOSTRA GRÁTIS — 15 PRIMEIROS PARÂMETROS COM BLUR */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="text-center mb-8">
          <div
            className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
            style={{ background: "#ffffff08", color: "#00C896", border: "1px solid #1f2430" }}
          >
            Amostra grátis
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.02em]">
            Espia os <span style={{ color: "#00C896" }}>15 primeiros parâmetros</span> de Qualidade.
          </h2>
          <p className="text-gray-400 mt-3 text-sm sm:text-base">
            Os primeiros estão abertos. O resto está esperando você lá dentro.
          </p>
        </div>
        <FreeSamplePreview />
      </section>

      {/* NÚMEROS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <Reveal>
          <div
            className="grid grid-cols-2 md:grid-cols-4 rounded-2xl overflow-hidden"
            style={{ background: "#10131a", border: "1px solid #1f2430" }}
          >
          {[
            { k: `${totalParams}+`, v: "Parâmetros documentados" },
            { k: `${courseTabs.length}`, v: "Módulos completos" },
            { k: "28", v: "Erros conhecidos + soluções" },
            { k: "∞", v: "Atualizações vitalícias" },
          ].map((s, i) => (
            <div
              key={i}
              className="p-6 text-center"
              style={{ borderRight: i < 3 ? "1px solid #1f2430" : "none" }}
            >
              <div className="text-3xl font-black tracking-tight" style={{ color: "#00C896" }}>
                {s.k}
              </div>
              <div className="text-[12px] text-gray-400 mt-1">{s.v}</div>
            </div>
          ))}
          </div>
        </Reveal>
      </section>

      {/* MÓDULOS */}
      <section id="modulos" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <Reveal className="text-center mb-12">
          <div
            className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: "#ffffff08", color: "#00C896", border: "1px solid #1f2430" }}
          >
            O que você domina
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.02em]">
            Cada aba do OrcaSlicer, <span style={{ color: "#00C896" }}>destrinchada</span>.
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Nada de "clica aqui e vê o que dá". Você aprende o que cada valor faz na peça — e quando
            muda.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-4">
          {modules.map((m, i) => (
            <Reveal key={i} delay={i * 70}>
            <div
              className="p-6 rounded-2xl group transition-all hover:translate-y-[-2px] h-full"
              style={{
                background: "linear-gradient(180deg, #10131a 0%, #0c0f14 100%)",
                border: "1px solid #1f2430",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: "#00C89614", border: "1px solid #00C89633" }}
                >
                  {m.icon}
                </div>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                  style={{ background: "#ffffff06", color: "#6b7280", border: "1px solid #1f2430" }}
                >
                  {m.count} params
                </span>
              </div>
              <h3 className="font-bold text-lg tracking-tight">{m.label}</h3>
              <p className="text-[13px] text-gray-400 mt-2 leading-relaxed">
                Guia completo com "o que é", "por que ajustar", "o que gera" e a regra de ouro para
                cada parâmetro.
              </p>
            </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: <Target size={20} />,
              title: "Peças perfeitas na primeira tentativa",
              text: "Regras de ouro objetivas por parâmetro. Você sabe o valor exato para o resultado que quer.",
            },
            {
              icon: <Wrench size={20} />,
              title: "Otimizações para cada objetivo",
              text: "Presets prontos para Qualidade, Velocidade, Resistência, Miniaturas e Peças funcionais.",
            },
            {
              icon: <Zap size={20} />,
              title: "Corrija erros em minutos",
              text: "Pé de elefante, stringing, warping, layer shift, ghosting — todos com causa e ajuste direto.",
            },
            {
              icon: <Layers size={20} />,
              title: "Simulador de calibração incluso",
              text: "Teste o efeito dos parâmetros visualmente antes de gastar filamento na impressora.",
            },
          ].map((b, i) => (
            <Reveal key={i} delay={i * 70}>
            <div
              className="p-6 rounded-2xl flex gap-4 h-full"
              style={{ background: "#10131a", border: "1px solid #1f2430" }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "#00C89614", color: "#00C896", border: "1px solid #00C89633" }}
              >
                {b.icon}
              </div>
              <div>
                <h3 className="font-bold tracking-tight">{b.title}</h3>
                <p className="text-[13.5px] text-gray-400 mt-1.5 leading-relaxed">{b.text}</p>
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <Reveal>
        <div
          className="rounded-3xl p-6 sm:p-10 md:p-14"
          style={{
            background:
              "radial-gradient(600px 300px at 10% 0%, rgba(0,200,150,0.10), transparent 60%), #10131a",
            border: "1px solid #1f2430",
          }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.02em] mb-8">
            Feito para quem <span style={{ color: "#00C896" }}>não aceita mais</span> imprimir no
            chute.
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Você já perdeu horas com peças falhando e não sabia por quê",
              "Quer imprimir mais rápido sem perder qualidade",
              "Precisa de peças funcionais resistentes de verdade",
              "Cansou de tutoriais superficiais no YouTube",
              "Já tem impressora boa mas o resultado não acompanha",
              "Quer vender impressões e precisa de padrão profissional",
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-3 text-[14px] text-gray-200">
                <Check size={16} style={{ color: "#00C896" }} className="mt-1 shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </div>
        </Reveal>
      </section>

      {/* GARANTIA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <Reveal>
        <div
          className="rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #10131a 0%, #0c0f14 100%)",
            border: "1px solid #00C89644",
          }}
        >
          <div
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6"
            style={{ background: "#00C89614", border: "1px solid #00C89655" }}
          >
            <ShieldCheck size={36} style={{ color: "#00C896" }} />
          </div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#00C896] mb-2">
            Garantia incondicional
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.02em]">
            7 dias de garantia. 100% do seu dinheiro de volta.
          </h2>
          <p className="text-gray-300 mt-4 max-w-xl mx-auto leading-relaxed">
            Você compra, acessa o curso completo e testa por 7 dias. Se em qualquer momento nesse
            período achar que não vale, é só pedir a devolução —{" "}
            <b className="text-white">reembolsamos 100%</b>, sem perguntas, direto pelo Kiwify.
          </p>
          <a
            href={KIWIFY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 mt-8 h-12 px-7 rounded-xl font-bold text-sm transition-all hover:translate-y-[-1px] w-full sm:w-auto"
            style={{
              background: "#00C896",
              color: "#0a0c10",
              boxShadow: "0 12px 30px -8px rgba(0,200,150,0.55)",
            }}
          >
            <Rocket size={16} />
            Comprar com garantia — R$ 39,90
          </a>
        </div>
        </Reveal>
      </section>

      {/* DEPOIMENTOS */}
      <section id="depoimentos" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.02em] text-center mb-12">
            Quem fez, imprime melhor.
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              n: "Rafael M.",
              r: "Maker · SP",
              t: "Reduzi 40% do tempo de impressão sem perder qualidade. O módulo de velocidade sozinho já paga o curso.",
            },
            {
              n: "Juliana P.",
              r: "Prototipagem · RJ",
              t: "Finalmente entendi por que minhas peças quebravam em Z. A parte de resistência é ouro.",
            },
            {
              n: "Diego A.",
              r: "Loja 3D · MG",
              t: "Padronizei os presets da loja inteira. Meus clientes recebem peças consistentes agora.",
            },
          ].map((d, i) => (
            <Reveal key={i} delay={i * 90}>
            <div
              className="p-6 rounded-2xl h-full"
              style={{ background: "#10131a", border: "1px solid #1f2430" }}
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, k) => (
                  <Star key={k} size={13} style={{ color: "#f5c94e", fill: "#f5c94e" }} />
                ))}
              </div>
              <p className="text-[14px] text-gray-200 leading-relaxed">"{d.t}"</p>
              <div className="mt-4 text-[12px]">
                <div className="font-bold text-white">{d.n}</div>
                <div className="text-gray-500">{d.r}</div>
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PREÇO */}
      <section id="preco" className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <Reveal>
        <div
          className="rounded-3xl p-6 sm:p-10 md:p-14 text-center relative"
          style={{
            background:
              "radial-gradient(500px 260px at 50% 0%, rgba(0,200,150,0.15), transparent 60%), #10131a",
            border: "1px solid #1f2430",
            boxShadow: "0 30px 80px -30px rgba(0,200,150,0.35)",
          }}
        >
          <div
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6"
            style={{ background: "#00C89622", color: "#00C896", border: "1px solid #00C89655" }}
          >
            <Trophy size={12} /> Acesso completo
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="text-gray-500 text-xl line-through">R$ 197</span>
            <span className="text-5xl sm:text-6xl font-black tracking-tight">R$ 39,90</span>
          </div>
          <p className="text-gray-400 mt-2 text-sm">
            Pagamento único · Acesso imediato · Atualizações vitalícias
          </p>

          <ul className="grid md:grid-cols-2 gap-3 max-w-xl mx-auto mt-8 text-left">
            {[
              `Acesso total aos ${courseTabs.length} módulos`,
              `${totalParams}+ parâmetros explicados`,
              "Catálogo de 28 erros + correções",
              "Simulador de calibração",
              "Atualizações vitalícias",
              "Garantia de 7 dias (reembolso total)",
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-[13.5px] text-gray-200">
                <Check size={15} style={{ color: "#00C896" }} /> {f}
              </li>
            ))}
          </ul>

          <a
            href={KIWIFY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 mt-10 px-6 sm:px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all hover:translate-y-[-1px] w-full sm:w-auto"
            style={{
              background: "#00C896",
              color: "#0a0c10",
              boxShadow: "0 12px 30px -8px rgba(0,200,150,0.55)",
            }}
          >
            <Rocket size={16} />
            Comprar por R$ 39,90 no Kiwify
          </a>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[12px] text-gray-500">
            <Clock size={12} /> Acesso imediato · <Lock size={12} /> Checkout seguro via Kiwify
          </div>
        </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.02em] text-center mb-10">
            Perguntas frequentes
          </h2>
        </Reveal>
        <div className="space-y-3">
          {[
            {
              q: "Como recebo o acesso depois de comprar?",
              a: "Assim que o pagamento é confirmado pelo Kiwify, você recebe as instruções de acesso no email cadastrado. Login imediato.",
            },
            {
              q: "Serve pra quem tá começando?",
              a: "Sim. O curso começa do zero — cada parâmetro é explicado do que é, por que existe e quando mudar.",
            },
            {
              q: "Serve pra outras impressoras além da Bambu?",
              a: "Sim. OrcaSlicer funciona com Bambu, Prusa, Voron, Ender e qualquer FDM. Os conceitos são universais.",
            },
            {
              q: "Como funciona a garantia?",
              a: "Você tem 7 dias a partir da compra para pedir reembolso total pelo Kiwify. Sem perguntas, sem burocracia.",
            },
            {
              q: "Recebo as atualizações do curso?",
              a: "Sim, para sempre. Toda vez que o OrcaSlicer lança um recurso novo, o curso é atualizado — você já tem acesso.",
            },
          ].map((f, i) => (
            <Reveal key={i} delay={i * 60} y={10}>
            <details
              className="group rounded-2xl px-5 py-4 cursor-pointer"
              style={{ background: "#10131a", border: "1px solid #1f2430" }}
            >
              <summary className="flex items-center justify-between font-bold text-[15px] list-none">
                {f.q}
                <ChevronRight
                  size={16}
                  className="text-gray-500 transition-transform group-open:rotate-90"
                />
              </summary>
              <p className="text-gray-400 text-[13.5px] leading-relaxed mt-3">{f.a}</p>
            </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA FIXO MOBILE */}
      <div
        className="fixed bottom-0 inset-x-0 z-40 sm:hidden transition-transform duration-300 ease-out"
        style={{ transform: showMobileCta ? "translateY(0)" : "translateY(110%)" }}
      >
        <div
          className="flex items-center justify-between gap-3 px-4 py-3"
          style={{
            background: "rgba(10,12,16,0.92)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderTop: "1px solid #1f2430",
          }}
        >
          <div className="leading-tight">
            <div className="text-[11px] text-gray-500 line-through">R$ 197</div>
            <div className="text-lg font-black tracking-tight">
              R$ 39,90 <span className="text-[10px] font-bold text-[#00C896] uppercase">único</span>
            </div>
          </div>
          <a
            href={KIWIFY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-5 rounded-xl font-bold text-sm flex items-center gap-2"
            style={{
              background: "#00C896",
              color: "#0a0c10",
              boxShadow: "0 10px 24px -8px rgba(0,200,150,0.55)",
            }}
          >
            <Rocket size={15} />
            Quero acessar
          </a>
        </div>
      </div>
      {/* Espaçador para o CTA fixo não cobrir o rodapé no mobile */}
      <div className="h-16 sm:hidden" />

      {/* FOOTER */}
      <footer
        className="max-w-6xl mx-auto px-4 sm:px-6 py-10 mt-10 border-t"
        style={{ borderColor: "#1f2430" }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-gray-500">
          <div className="flex items-center gap-2">
            <Sparkles size={12} style={{ color: "#00C896" }} />
            <span className="font-bold text-gray-300">OrcaSlicer Pro</span> · Curso não oficial ·
            Todos os direitos reservados
          </div>
          <div className="flex gap-4">
            <Link to="/curso" className="hover:text-white transition-colors">
              Entrar
            </Link>
            <a href="#preview" className="hover:text-white transition-colors">
              Prévia
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
