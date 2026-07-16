import { useEffect, useRef, useState } from "react";
import {
  Wrench,
  Gauge,
  Layers,
  Thermometer,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Calculator,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  Check,
  Shield,
  HelpCircle,
  FileText,
  Sliders,
  Flame,
  LineChart,
  Grid,
} from "lucide-react";

interface CalibrationSuiteProps {
  onBackToSlicer: () => void;
  onApplyCalibratedFlow: (flowRate: string) => void;
  onApplyCalibratedPA: (pa: string) => void;
  currentFilament: string;
}

export function CalibrationSuite({
  onBackToSlicer,
  onApplyCalibratedFlow,
  onApplyCalibratedPA,
  currentFilament,
}: CalibrationSuiteProps) {
  // Navigation inside calibration guide
  const [activeStep, setActiveStep] = useState<number>(1); // Começa no Passo 1 (Preparação) para o usuário ver o checklist com destaques "ALTERADO".
  const [activeCalibTab, setActiveCalibTab] = useState<
    "flow" | "pa" | "temp" | "max_flow" | "retraction" | "vfa" | "tolerance" | "ironing"
  >("flow");

  // Checklist states for Step 1
  const [machineChecks, setMachineChecks] = useState<Record<string, boolean>>({
    correias: false,
    nivelamento: false,
    limpeza: false,
    lubrificacao: false,
    folgas: false,
  });

  const [filamentChecks, setFilamentChecks] = useState<Record<string, boolean>>({
    umidade: false,
    diametro: false,
    carretel: false,
    guias: false,
  });

  const [fileChecks, setFileChecks] = useState<Record<string, boolean>>({
    bico_medida: false,
    limites: false,
    firmware: false,
  });

  // Flow Rate Calculator states
  const [flowRateCurrent, setFlowRateCurrent] = useState<number>(0.98);
  const [flowRateModifier, setFlowRateModifier] = useState<number>(0);
  const [flowRateCalibrated, setFlowRateCalibrated] = useState<number | null>(null);

  // Pressure Advance Calculator states
  const [paMode, setPaMode] = useState<"line" | "tower">("line");
  const [paStart, setPaStart] = useState<number>(0.0);
  const [paFactor, setPaFactor] = useState<number>(0.005);
  const [paHeight, setPaHeight] = useState<number>(15);
  const [paCalibrated, setPaCalibrated] = useState<number | null>(null);

  // Temp Tower states
  const [tempBase, setTempBase] = useState<number>(220);
  const [tempStep, setTempStep] = useState<number>(5);
  const [bestTempHeight, setBestTempHeight] = useState<number>(3);
  const [tempCalibrated, setTempCalibrated] = useState<number | null>(null);

  // Max Flow rate states
  const [maxFlowStart, setMaxFlowStart] = useState<number>(5);
  const [maxFlowEnd, setMaxFlowEnd] = useState<number>(20);
  const [maxFlowHeight, setMaxFlowHeight] = useState<number>(42);
  const [maxFlowTotalHeight, setMaxFlowTotalHeight] = useState<number>(50);
  const [maxFlowCalibrated, setMaxFlowCalibrated] = useState<number | null>(null);

  // Retraction Tower states
  const [retrStart, setRetrStart] = useState<number>(0.4);
  const [retrStep, setRetrStep] = useState<number>(0.1);
  const [retrHeight, setRetrHeight] = useState<number>(2.5);
  const [retrCalibrated, setRetrCalibrated] = useState<number | null>(null);

  // VFA States (Vertical Fine Artifacts)
  const [vfaStart, setVfaStart] = useState<number>(40);
  const [vfaEnd, setVfaEnd] = useState<number>(200);
  const [vfaHeight, setVfaHeight] = useState<number>(45);
  const [vfaTotalHeight, setVfaTotalHeight] = useState<number>(80);
  const [vfaCalibrated, setVfaCalibrated] = useState<number | null>(null);

  // Tolerance States
  const [toleranceVal, setToleranceVal] = useState<number>(0.2);

  // Ironing States
  const [ironingFlow, setIroningFlow] = useState<number>(15);
  const [ironingSpeed, setIroningSpeed] = useState<number>(50);
  const [ironingCalibrated, setIroningCalibrated] = useState<boolean>(false);

  // General state feedback
  const [appliedToast, setAppliedToast] = useState<string | null>(null);

  const toggleCheck = (category: "machine" | "filament" | "file", id: string) => {
    if (category === "machine") {
      setMachineChecks((prev) => ({ ...prev, [id]: !prev[id] }));
    } else if (category === "filament") {
      setFilamentChecks((prev) => ({ ...prev, [id]: !prev[id] }));
    } else if (category === "file") {
      setFileChecks((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const checkAllPercent = () => {
    const total =
      Object.keys(machineChecks).length +
      Object.keys(filamentChecks).length +
      Object.keys(fileChecks).length;
    const checked =
      Object.values(machineChecks).filter(Boolean).length +
      Object.values(filamentChecks).filter(Boolean).length +
      Object.values(fileChecks).filter(Boolean).length;
    return Math.round((checked / total) * 100);
  };

  // Flow rate calculation
  const calculateFlowRate = () => {
    // Formula: New Flow = Old Flow * (100 + modifier) / 100
    const calculated = (flowRateCurrent * (100 + flowRateModifier)) / 100;
    setFlowRateCalibrated(Number(calculated.toFixed(4)));
  };

  // PA calculation
  const calculatePA = () => {
    // Formula: PA = Start + (Height * Factor)
    const calculated = paStart + paHeight * paFactor;
    setPaCalibrated(Number(calculated.toFixed(4)));
  };

  // Temp calculation
  const calculateTemp = () => {
    const calculated = tempBase - bestTempHeight * tempStep;
    setTempCalibrated(calculated);
  };

  // Max Volumetric flow calculation
  const calculateMaxFlow = () => {
    // Formula: Max Flow = Start + (Height * (End - Start) / TotalHeight)
    const calculated =
      maxFlowStart + (maxFlowHeight * (maxFlowEnd - maxFlowStart)) / maxFlowTotalHeight;
    setMaxFlowCalibrated(Number(calculated.toFixed(2)));
  };

  // Retraction calculation
  const [vfaSpeedCalibrated, setVfaSpeedCalibrated] = useState<number | null>(null);
  const calculateRetr = () => {
    // Formula: Retraction = Start + (BestHeightInMillimeters * Step) or Index * Step
    const calculated = retrStart + retrHeight * retrStep;
    setRetrCalibrated(Number(calculated.toFixed(3)));
  };

  // VFA Calculation
  const calculateVFA = () => {
    // Formula: Best Speed = Start + (Height * (End - Start) / TotalHeight)
    const calculated = vfaStart + (vfaHeight * (vfaEnd - vfaStart)) / vfaTotalHeight;
    setVfaSpeedCalibrated(Number(calculated.toFixed(1)));
  };

  const handleApplyFlow = () => {
    if (flowRateCalibrated !== null) {
      onApplyCalibratedFlow(flowRateCalibrated.toString());
      showToast(`Multiplicador de Vazão (${flowRateCalibrated}) aplicado ao perfil de filamento!`);
    }
  };

  const handleApplyPA = () => {
    if (paCalibrated !== null) {
      onApplyCalibratedPA(paCalibrated.toString());
      showToast(`Pressure Advance (${paCalibrated}s) aplicado com sucesso!`);
    }
  };

  const showToast = (msg: string) => {
    setAppliedToast(msg);
    setTimeout(() => setAppliedToast(null), 3000);
  };

  const getFilamentName = (f: string) => {
    return f.toUpperCase();
  };

  // Ref e efeito: marca em amarelo com badge "ALTERADO" qualquer input
  // numérico ou slider que teve seu valor modificado em relação ao inicial.
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const initials = new WeakMap<HTMLInputElement, string>();
    const scan = () => {
      const inputs = root.querySelectorAll<HTMLInputElement>(
        'input[type="number"], input[type="range"]',
      );
      inputs.forEach((el) => {
        if (!initials.has(el)) initials.set(el, el.value);
        const orig = initials.get(el)!;
        const changed = el.value !== orig;
        el.dataset.changed = changed ? "true" : "false";
      });
    };
    scan();
    const handler = () => scan();
    root.addEventListener("input", handler);
    root.addEventListener("change", handler);
    const mo = new MutationObserver(scan);
    mo.observe(root, { subtree: true, childList: true });
    return () => {
      root.removeEventListener("input", handler);
      root.removeEventListener("change", handler);
      mo.disconnect();
    };
  }, [activeStep, activeCalibTab]);

  return (
    <div
      ref={containerRef}
      className="calibration-suite flex flex-col h-full w-full bg-[#15171e] text-gray-200 overflow-hidden font-sans"
    >
      {/* Dynamic Toast */}
      {appliedToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl bg-[#1e2128] border border-[#00C896] text-[#00C896] animate-bounce flex items-center gap-2">
          <Sparkles size={14} className="animate-spin" />
          <span>{appliedToast}</span>
        </div>
      )}

      {/* HEADER ROW */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800/80 bg-[#12141a]/90 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-gradient-to-br from-[#00C896]/20 to-emerald-500/10 border border-[#00C896]/30 text-[#00C896]">
            <Gauge size={18} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              Laboratório de Calibração Mestre OrcaSlicer
              <span className="px-2 py-0.5 rounded text-[9px] bg-[#00C896]/10 text-[#00C896] border border-[#00C896]/20 uppercase font-black font-mono">
                WIKI COMPATÍVEL
              </span>
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Siga os passos rigorosos do OrcaSlicer para atingir precisão dimensional e superfícies
              perfeitas.
            </p>
          </div>
        </div>

        <button
          onClick={onBackToSlicer}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-950 bg-[#00C896] hover:bg-[#00e2aa] transition-all cursor-pointer shadow-lg shadow-emerald-950/20 active:scale-95"
        >
          <Play size={10} fill="currentColor" />
          Voltar ao Fatiador
        </button>
      </div>

      {/* STEP PROGRESS WIZARD */}
      <div className="grid grid-cols-3 border-b border-gray-800/50 bg-[#12141a]/45 flex-shrink-0">
        {[
          {
            step: 1,
            label: "PASSO 1: VERIFICAÇÕES INICIAIS",
            desc: "Máquina, Filamento e Arquivos",
            icon: <Wrench size={14} />,
          },
          {
            step: 2,
            label: "PASSO 2: TESTES & CALCULADORAS",
            desc: "Flow Rate, PA, Temperatura, Vazão Máxima",
            icon: <Calculator size={14} />,
          },
          {
            step: 3,
            label: "PASSO 3: FLUXO DE FATIAMENTO",
            desc: "Aplicação Prática no Perfil de Peças",
            icon: <Layers size={14} />,
          },
        ].map((s) => (
          <button
            key={s.step}
            onClick={() => setActiveStep(s.step)}
            className={`px-5 py-3 text-left border-r border-gray-800/30 transition-all cursor-pointer relative ${
              activeStep === s.step
                ? "bg-[#1e2128]/50 text-[#00C896]"
                : "text-gray-500 hover:bg-gray-900/20 hover:text-gray-300"
            }`}
          >
            {activeStep === s.step && (
              <div className="absolute left-0 bottom-0 right-0 h-0.5 bg-[#00C896]" />
            )}
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`p-1 rounded-md text-[10px] ${
                  activeStep === s.step
                    ? "bg-[#00C896]/15 text-[#00C896]"
                    : "bg-gray-800/40 text-gray-500"
                }`}
              >
                {s.icon}
              </span>
              <span className="text-[11px] font-black tracking-wider uppercase font-mono">
                {s.label}
              </span>
            </div>
            <div className="text-[10px] text-gray-400 font-medium pl-6 truncate">{s.desc}</div>
          </button>
        ))}
      </div>

      {/* CORE VIEWPORT / CONTENT CONTENT */}
      <div className="flex-1 overflow-hidden flex min-h-0 bg-[#0d0f14]">
        {/* STEP 1 PANEL: VERIFICAÇÕES INICIAIS */}
        {activeStep === 1 && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar-thin">
            {/* Header / Intro */}
            <div className="p-4 rounded-xl border border-yellow-500/10 bg-yellow-500/5 text-yellow-100/90 text-xs flex gap-3 leading-relaxed">
              <AlertTriangle className="text-yellow-500 flex-shrink-0" size={18} />
              <div>
                <span className="font-bold text-yellow-400 uppercase block mb-1">
                  REGRA NÚMERO 1 DA CALIBRAÇÃO DE FATIADOR:
                </span>
                Não adianta calibrar parâmetros de software se o hardware possuir imperfeições
                mecânicas. Realizar calibrações de vazão com correias frouxas ou filamento úmido
                resultará em valores incorretos e frustração. Marque os itens abaixo como concluídos
                antes de avançar para os testes físicos de impressão!
              </div>
            </div>

            {/* Checklist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Categoria A: Mecânica da Máquina */}
              <div className="p-4 rounded-xl border border-gray-800 bg-[#16181f]/70 space-y-3.5">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-800/50">
                  <Wrench size={15} className="text-blue-400" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-white font-mono">
                    1. Mecânica da Impressora
                  </h3>
                </div>
                <div className="space-y-2 text-[11px] text-gray-400">
                  {[
                    {
                      id: "correias",
                      title: "Tensão das Correias",
                      desc: "Correias devem estar firmes (afinação ~110Hz a 150Hz), sem folgas nem sobre-tensionadas.",
                    },
                    {
                      id: "nivelamento",
                      title: "Nivelamento Físico da Mesa",
                      desc: "Mesh ou nivelamento manual perfeito. O primeiro bico deve assentar de forma idêntica em toda a cama.",
                    },
                    {
                      id: "limpeza",
                      title: "Limpeza da Chapa (PEI)",
                      desc: "Lave a mesa com detergente neutro e água quente ou álcool isopropílico. Óleo de dedos destrói a adesão!",
                    },
                    {
                      id: "lubrificacao",
                      title: "Lubrificação de Guias Lineares",
                      desc: "Fusos lubrificados com graxa de teflon (PTFE) e guias lineares com óleo de máquina fino.",
                    },
                    {
                      id: "folgas",
                      title: "Aperto de Parafusos e Polias",
                      desc: "Verifique se a polia do motor de passo está firme e se não há vibrações físicas no cabeçote de extrusão.",
                    },
                  ].map((chk) => (
                    <button
                      key={chk.id}
                      onClick={() => toggleCheck("machine", chk.id)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer flex gap-2.5 items-start ${
                        machineChecks[chk.id]
                          ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-100"
                          : "bg-[#111218]/55 border-gray-800/40 hover:border-gray-700/60"
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-3.5 h-3.5 rounded flex items-center justify-center transition-all ${
                          machineChecks[chk.id]
                            ? "bg-yellow-400 text-gray-950"
                            : "border border-gray-700"
                        }`}
                      >
                        {machineChecks[chk.id] && <Check size={10} strokeWidth={3} />}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`font-bold flex items-center gap-2 ${machineChecks[chk.id] ? "text-yellow-300" : "text-gray-300"}`}
                        >
                          {chk.title}
                          {machineChecks[chk.id] && <AlteradoTag />}
                        </div>
                        <div className="text-[10px] text-gray-500 font-medium leading-normal mt-0.5">
                          {chk.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Categoria B: Filamentos & Armazenamento */}
              <div className="p-4 rounded-xl border border-gray-800 bg-[#16181f]/70 space-y-3.5">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-800/50">
                  <Flame size={15} className="text-orange-400" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-white font-mono">
                    2. Filamento & Material
                  </h3>
                </div>
                <div className="space-y-2 text-[11px] text-gray-400">
                  {[
                    {
                      id: "umidade",
                      title: "Secagem do Filamento",
                      desc: "Crucial para PETG, Nylon, TPU e até PLA de longa data. Filamento molhado causa bolhas e stringing!",
                    },
                    {
                      id: "diametro",
                      title: "Verificação do Diâmetro",
                      desc: "Meça com paquímetro em 3 pontos. O valor padrão deve estar próximo de 1.75 mm para consistência de fluxo.",
                    },
                    {
                      id: "carretel",
                      title: "Alimentação sem Resistência",
                      desc: "O carretel deve rodar livremente sobre rolamentos. Puxar o filamento com esforço gera linhas de sub-extrusão.",
                    },
                    {
                      id: "guias",
                      title: "Conexões PTFE",
                      desc: "Garante que o tubo de PTFE guie o material sem curvas acentuadas ou atrito exagerado.",
                    },
                  ].map((chk) => (
                    <button
                      key={chk.id}
                      onClick={() => toggleCheck("filament", chk.id)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer flex gap-2.5 items-start ${
                        filamentChecks[chk.id]
                          ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-100"
                          : "bg-[#111218]/55 border-gray-800/40 hover:border-gray-700/60"
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-3.5 h-3.5 rounded flex items-center justify-center transition-all ${
                          filamentChecks[chk.id]
                            ? "bg-yellow-400 text-gray-950"
                            : "border border-gray-700"
                        }`}
                      >
                        {filamentChecks[chk.id] && <Check size={10} strokeWidth={3} />}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`font-bold flex items-center gap-2 ${filamentChecks[chk.id] ? "text-yellow-300" : "text-gray-300"}`}
                        >
                          {chk.title}
                          {filamentChecks[chk.id] && <AlteradoTag />}
                        </div>
                        <div className="text-[10px] text-gray-500 font-medium leading-normal mt-0.5">
                          {chk.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Categoria C: Arquivos & Slicer Setup */}
              <div className="p-4 rounded-xl border border-gray-800 bg-[#16181f]/70 space-y-3.5">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-800/50">
                  <Shield size={15} className="text-[#00C896]" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-white font-mono">
                    3. Slicer e Firmware
                  </h3>
                </div>
                <div className="space-y-2 text-[11px] text-gray-400">
                  {[
                    {
                      id: "bico_medida",
                      title: "Bico Físico vs Diâmetro Slicer",
                      desc: "O tamanho do bico na impressora (ex: 0.4 mm) deve bater exatamente com as configurações de linha.",
                    },
                    {
                      id: "limites",
                      title: "Limites de Temperatura",
                      desc: "Garante que o bico está limpo sem entupimentos parciais (fazer cold-pull se necessário).",
                    },
                    {
                      id: "firmware",
                      title: "Tipos de Firmware Selecionado",
                      desc: "Configura Klipper ou Marlin corretamente nas opções de impressora para respeitar as acelerações corretas.",
                    },
                  ].map((chk) => (
                    <button
                      key={chk.id}
                      onClick={() => toggleCheck("file", chk.id)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer flex gap-2.5 items-start ${
                        fileChecks[chk.id]
                          ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-100"
                          : "bg-[#111218]/55 border-gray-800/40 hover:border-gray-700/60"
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-3.5 h-3.5 rounded flex items-center justify-center transition-all ${
                          fileChecks[chk.id]
                            ? "bg-yellow-400 text-gray-950"
                            : "border border-gray-700"
                        }`}
                      >
                        {fileChecks[chk.id] && <Check size={10} strokeWidth={3} />}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`font-bold flex items-center gap-2 ${fileChecks[chk.id] ? "text-yellow-300" : "text-gray-300"}`}
                        >
                          {chk.title}
                          {fileChecks[chk.id] && <AlteradoTag />}
                        </div>
                        <div className="text-[10px] text-gray-500 font-medium leading-normal mt-0.5">
                          {chk.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Overall progress card */}
            <div className="p-4 rounded-xl border border-gray-800 bg-[#12141a]/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-xs font-mono font-bold text-gray-400">
                  Progresso das Verificações Prévias:
                </div>
                <div className="w-48 h-2 bg-gray-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${checkAllPercent()}%` }}
                  />
                </div>
                <div className="text-xs font-mono font-black text-[#00C896]">
                  {checkAllPercent()}%
                </div>
              </div>

              {checkAllPercent() === 100 ? (
                <div className="flex items-center gap-1.5 text-xs text-[#00C896] font-bold">
                  <CheckCircle2 size={14} />
                  Sua impressora está apta! Prossiga para o Passo 2.
                </div>
              ) : (
                <div className="text-xs text-gray-500 font-medium">
                  Complete todas as checagens mecânicas para calibrações confiáveis.
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2 PANEL: CALIBRAÇÕES & CALCULADORAS */}
        {activeStep === 2 && (
          <div className="flex-1 flex min-h-0">
            {/* Left selector sidebar for calibrations */}
            <div className="w-56 border-r border-gray-800/80 bg-[#12141a]/65 flex flex-col p-3 gap-1 flex-shrink-0">
              <span className="text-[9px] uppercase tracking-widest text-gray-500 font-extrabold pl-2 mb-2 block">
                Escolha o Teste Físico
              </span>
              {[
                {
                  id: "flow",
                  label: "1. Vazão / Flow Rate",
                  active: activeCalibTab === "flow",
                  icon: <Sliders size={13} />,
                },
                {
                  id: "pa",
                  label: "2. Pressure Advance",
                  active: activeCalibTab === "pa",
                  icon: <LineChart size={13} />,
                },
                {
                  id: "temp",
                  label: "3. Temp Tower",
                  active: activeCalibTab === "temp",
                  icon: <Flame size={13} />,
                },
                {
                  id: "retraction",
                  label: "4. Retração / Retraction",
                  active: activeCalibTab === "retraction",
                  icon: <RotateCcw size={13} />,
                },
                {
                  id: "max_flow",
                  label: "5. Vazão Volumétrica Max",
                  active: activeCalibTab === "max_flow",
                  icon: <Zap size={13} />,
                },
                {
                  id: "vfa",
                  label: "6. VFA (Vibração / Resonância)",
                  active: activeCalibTab === "vfa",
                  icon: <Activity size={13} />,
                },
                {
                  id: "tolerance",
                  label: "7. Tolerância Dimensional",
                  active: activeCalibTab === "tolerance",
                  icon: <Grid size={13} />,
                },
                {
                  id: "ironing",
                  label: "8. Alisamento / Ironing",
                  active: activeCalibTab === "ironing",
                  icon: <Sparkles size={13} />,
                },
              ].map((cal) => (
                <button
                  key={cal.id}
                  onClick={() => setActiveCalibTab(cal.id as any)}
                  className={`w-full px-3 py-2.5 rounded-lg text-xs font-semibold text-left flex items-center gap-2 transition-all cursor-pointer ${
                    activeCalibTab === cal.id
                      ? "bg-[#00C896]/10 text-[#00C896] border border-[#00C896]/15 font-black"
                      : "text-gray-400 hover:bg-gray-800/20 hover:text-gray-300 border border-transparent"
                  }`}
                >
                  {cal.icon}
                  {cal.label}
                </button>
              ))}

              <div className="flex-1" />

              <div className="p-3 rounded-lg border border-gray-800/60 bg-[#16181f]/40 text-[10px] leading-relaxed text-gray-500 font-medium">
                <Info size={12} className="text-emerald-500 mb-1 inline mr-1" />
                Os testes podem ser gerados no OrcaSlicer clicando no menu superior{" "}
                <strong className="text-gray-400">Calibração</strong>. Imprima as peças e use as
                calculadoras ao lado para processar os resultados.
              </div>
            </div>

            {/* Right main panel with selected interactive calculator */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar-thin bg-[#0d0f14]">
              {/* 1. FLOW RATE CALCULATOR */}
              {activeCalibTab === "flow" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                      <Sliders size={15} className="text-[#00C896]" />
                      Calibração de Multiplicador de Vazão (Flow Rate)
                    </h2>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Controla o volume de filamento extrudado. No OrcaSlicer, este teste imprime 9
                      placas com superfícies de acabamento variadas de{" "}
                      <strong className="text-white">-10% a +9%</strong> (Passo 1). O objetivo é
                      encontrar o bloco mais suave ao toque.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Controls */}
                    <div className="p-4 rounded-xl border border-gray-800 bg-[#16181f]/80 space-y-4">
                      <div className="text-xs font-black uppercase tracking-wider text-white border-b border-gray-800/60 pb-1.5 font-mono flex justify-between">
                        <span>Fórmula & Parâmetros</span>
                        <span className="text-[10px] text-[#00C896]">Passo a Passo</span>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1 block">
                            Filamento Ativo
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={`${getFilamentName(currentFilament)} (Configurado no simulador)`}
                            className="w-full py-2 px-3 rounded-lg bg-gray-950 border border-gray-800/80 font-mono text-[11px] text-[#00C896] outline-none"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                              Multiplicador de Vazão Atual (Slicer)
                            </label>
                            <span className="font-mono font-bold text-gray-400">
                              {flowRateCurrent}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.80"
                            max="1.20"
                            step="0.01"
                            value={flowRateCurrent}
                            onChange={(e) => {
                              setFlowRateCurrent(parseFloat(e.target.value));
                              setFlowRateCalibrated(null);
                            }}
                            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00C896]"
                          />
                          <div className="flex justify-between text-[9px] text-gray-600 font-mono mt-0.5">
                            <span>0.80 (Sub-extrusão extrema)</span>
                            <span>1.00 (Padrão)</span>
                            <span>1.20 (Sobre-extrusão extrema)</span>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                              Modificador Selecionado (Melhor Superfície)
                            </label>
                            <span className="font-mono font-bold text-[#00C896] px-1.5 py-0.5 rounded bg-[#00C896]/10">
                              {flowRateModifier > 0 ? `+${flowRateModifier}` : flowRateModifier}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-15"
                            max="15"
                            step="1"
                            value={flowRateModifier}
                            onChange={(e) => {
                              setFlowRateModifier(parseInt(e.target.value));
                              setFlowRateCalibrated(null);
                            }}
                            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00C896]"
                          />
                          <div className="flex justify-between text-[9px] text-gray-600 font-mono mt-0.5">
                            <span>-15% (Buracos / Falhas)</span>
                            <span>0% (Sem Alteração)</span>
                            <span>+15% (Acúmulos / Caroços)</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={calculateFlowRate}
                          className="w-full py-2 px-3 rounded-lg text-xs font-bold text-gray-950 bg-[#00C896] hover:bg-[#00e2aa] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(0,200,150,0.15)]"
                        >
                          <Calculator size={12} />
                          Calcular Nova Vazão
                        </button>
                      </div>

                      {/* Display Calculation results */}
                      {flowRateCalibrated !== null && (
                        <div className="p-3.5 rounded-lg border border-[#00C896]/20 bg-[#00C896]/5 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 font-mono">
                              Fórmula Aplicada:
                            </span>
                            <span className="text-[9px] font-mono text-gray-500">
                              V_nova = V_atual * (1 + Mod / 100)
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-[10px] text-gray-500 font-medium">
                                Novo Multiplicador de Vazão:
                              </div>
                              <div className="text-xl font-mono font-black text-white">
                                {flowRateCalibrated}
                              </div>
                            </div>
                            <button
                              onClick={handleApplyFlow}
                              className="px-3 py-1.5 rounded bg-emerald-500 text-gray-950 font-bold text-xs hover:bg-emerald-400 transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Check size={11} strokeWidth={3} />
                              Aplicar Slicer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Interactive Grid Guide */}
                    <div className="p-4 rounded-xl border border-gray-800 bg-[#16181f]/40 space-y-4">
                      <div className="text-xs font-black uppercase tracking-wider text-white border-b border-gray-800/60 pb-1.5 font-mono">
                        Seletor Visual de Amostras (OrcaSlicer Pass 1)
                      </div>
                      <p className="text-[10px] text-gray-500 leading-normal">
                        Toque nos blocos abaixo correspondentes aos do seu teste de impressão
                        física. Verifique qual apresenta a face superior perfeitamente lisa (sem
                        ranhuras ásperas ou fendas de preenchimento).
                      </p>

                      {/* SVG Grid of blocks */}
                      <div className="flex items-center justify-center bg-gray-950/70 p-4 rounded-xl border border-gray-900">
                        <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
                          {[-10, -5, -3, -2, 0, 2, 3, 5, 10].map((v) => {
                            const isSelected = flowRateModifier === v;
                            return (
                              <button
                                key={v}
                                onClick={() => {
                                  setFlowRateModifier(v);
                                  setFlowRateCalibrated(null);
                                }}
                                className={`aspect-video rounded-lg border flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 cursor-pointer ${
                                  isSelected
                                    ? "bg-[#00C896]/10 border-[#00C896] text-[#00C896] shadow-[0_0_12px_rgba(0,200,150,0.15)]"
                                    : "bg-gray-900/60 border-gray-800 text-gray-400 hover:border-gray-700/80"
                                }`}
                              >
                                {/* Simulated Surface lines based on value */}
                                <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
                                  {v < 0
                                    ? // Under-extrusion: gaps
                                      Array.from({ length: 6 }).map((_, i) => (
                                        <line
                                          key={i}
                                          x1="0"
                                          y1={i * 8}
                                          x2="100%"
                                          y2={i * 8}
                                          stroke="currentColor"
                                          strokeWidth="1"
                                          strokeDasharray="3 3"
                                        />
                                      ))
                                    : v > 0
                                      ? // Over-extrusion: ridges
                                        Array.from({ length: 12 }).map((_, i) => (
                                          <line
                                            key={i}
                                            x1="0"
                                            y1={i * 4}
                                            x2="100%"
                                            y2={i * 4}
                                            stroke="currentColor"
                                            strokeWidth="2"
                                          />
                                        ))
                                      : // Smooth solid lines
                                        Array.from({ length: 9 }).map((_, i) => (
                                          <line
                                            key={i}
                                            x1="0"
                                            y1={i * 5}
                                            x2="100%"
                                            y2={i * 5}
                                            stroke="currentColor"
                                            strokeWidth="1.2"
                                          />
                                        ))}
                                </svg>
                                <span className="text-[11px] font-black font-mono relative z-10">
                                  {v > 0 ? `+${v}` : v}%
                                </span>
                                <span className="text-[8px] opacity-60 text-center font-bold tracking-wider scale-90 mt-0.5">
                                  {v < 0 ? "Fendas" : v > 0 ? "Áspero" : "Lisa ✓"}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="rounded-lg bg-gray-900/40 p-3 border border-gray-800/50 flex gap-2 items-start text-[10px] leading-relaxed text-gray-400">
                        <Info size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block mb-0.5">Passo 2 do teste:</strong>
                          Após aplicar o resultado do Pass 1 no Slicer, imprima o{" "}
                          <strong className="text-white">Pass 2 (-9% a +1%)</strong> para fazer o
                          ajuste fino definitivo de acabamento de superfície.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. PRESSURE ADVANCE (PA) CALCULATOR */}
              {activeCalibTab === "pa" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                      <LineChart size={15} className="text-[#00C896]" />
                      Calibração de Pressure Advance (PA)
                    </h2>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Compensa a inércia do filamento derretido na ponta do bico durante acelerações
                      e desacelerações nas curvas. Evita quinas gordinhas (sobre-extrusão) e buracos
                      no reinício das linhas (sub-extrusão).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Controls */}
                    <div className="p-4 rounded-xl border border-gray-800 bg-[#16181f]/80 space-y-4">
                      <div className="text-xs font-black uppercase tracking-wider text-white border-b border-gray-800/60 pb-1.5 font-mono">
                        Calculadora de Compensação de Pressão
                      </div>

                      {/* Mode selection */}
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1 block">
                          Método de Teste Utilizado
                        </label>
                        <div className="grid grid-cols-2 gap-1 bg-[#12141a] p-0.5 rounded-lg border border-gray-800">
                          <button
                            onClick={() => {
                              setPaMode("line");
                              setPaStart(0.0);
                              setPaFactor(0.005);
                              setPaHeight(15);
                              setPaCalibrated(null);
                            }}
                            className={`py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                              paMode === "line"
                                ? "bg-[#00C896] text-gray-950 font-bold"
                                : "text-gray-400"
                            }`}
                          >
                            Método de Linhas (Line)
                          </button>
                          <button
                            onClick={() => {
                              setPaMode("tower");
                              setPaStart(0.0);
                              setPaFactor(0.002);
                              setPaHeight(20);
                              setPaCalibrated(null);
                            }}
                            className={`py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                              paMode === "tower"
                                ? "bg-[#00C896] text-gray-950 font-bold"
                                : "text-gray-400"
                            }`}
                          >
                            Torre de Altura (Tower)
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3.5 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1 block">
                              PA Inicial
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={paStart}
                              onChange={(e) => {
                                setPaStart(parseFloat(e.target.value) || 0);
                                setPaCalibrated(null);
                              }}
                              className="w-full py-1.5 px-3 rounded bg-gray-950 border border-gray-800 font-mono text-[11px] text-gray-300 focus:border-[#00C896] outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1 block">
                              Multiplicador / Fator
                            </label>
                            <input
                              type="number"
                              step="0.0001"
                              value={paFactor}
                              onChange={(e) => {
                                setPaFactor(parseFloat(e.target.value) || 0);
                                setPaCalibrated(null);
                              }}
                              className="w-full py-1.5 px-3 rounded bg-gray-950 border border-gray-800 font-mono text-[11px] text-gray-300 focus:border-[#00C896] outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                              {paMode === "line"
                                ? "Número da Melhor Linha (Index)"
                                : "Altura do Melhor Acabamento (mm)"}
                            </label>
                            <span className="font-mono font-bold text-[#00C896] px-1.5 py-0.5 rounded bg-[#00C896]/10">
                              {paHeight} {paMode === "line" ? "" : "mm"}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max={paMode === "line" ? "40" : "50"}
                            step={paMode === "line" ? "1" : "0.5"}
                            value={paHeight}
                            onChange={(e) => {
                              setPaHeight(parseFloat(e.target.value));
                              setPaCalibrated(null);
                            }}
                            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00C896]"
                          />
                          <div className="flex justify-between text-[9px] text-gray-600 font-mono mt-0.5">
                            <span>0</span>
                            <span>{paMode === "line" ? "20" : "25mm"}</span>
                            <span>{paMode === "line" ? "40 (Extremo)" : "50mm"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={calculatePA}
                          className="w-full py-2 px-3 rounded-lg text-xs font-bold text-gray-950 bg-[#00C896] hover:bg-[#00e2aa] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Calculator size={12} />
                          Calcular Valor de PA
                        </button>
                      </div>

                      {/* Display Results */}
                      {paCalibrated !== null && (
                        <div className="p-3.5 rounded-lg border border-[#00C896]/20 bg-[#00C896]/5 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 font-mono">
                              Fórmula PA:
                            </span>
                            <span className="text-[9px] font-mono text-gray-500">
                              PA = Inicial + ({paMode === "line" ? "N_Linha" : "Altura"} * Fator)
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-[10px] text-gray-500 font-medium">
                                Novo Valor Pressure Advance:
                              </div>
                              <div className="text-xl font-mono font-black text-white">
                                {paCalibrated} s
                              </div>
                            </div>
                            <button
                              onClick={handleApplyPA}
                              className="px-3 py-1.5 rounded bg-emerald-500 text-gray-950 font-bold text-xs hover:bg-emerald-400 transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Check size={11} strokeWidth={3} />
                              Aplicar Slicer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SVG PA Line Visualizer */}
                    <div className="p-4 rounded-xl border border-gray-800 bg-[#16181f]/40 space-y-4 flex flex-col">
                      <div className="text-xs font-black uppercase tracking-wider text-white border-b border-gray-800/60 pb-1.5 font-mono">
                        Como identificar o PA ideal (Visual de Linhas)
                      </div>

                      <div className="flex-1 flex flex-col justify-center bg-gray-950 p-4 rounded-xl border border-gray-900 min-h-[180px]">
                        <div className="flex flex-col gap-2.5">
                          {/* Low PA line */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[8px] font-mono text-gray-500">
                              <span>Low PA (Under compensation)</span>
                              <span className="text-red-400">Cantos inchados</span>
                            </div>
                            <svg className="w-full h-4" viewBox="0 0 300 16">
                              <line
                                x1="10"
                                y1="8"
                                x2="290"
                                y2="8"
                                stroke="#374151"
                                strokeWidth="2"
                              />
                              <circle cx="10" cy="8" r="4.5" fill="#ef4444" />
                              <circle cx="290" cy="8" r="4.5" fill="#ef4444" />
                            </svg>
                          </div>

                          {/* Perfect PA line */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[8px] font-mono text-[#00C896]">
                              <span>PA Perfeito (Ideal)</span>
                              <span>Largura constante ✓</span>
                            </div>
                            <svg className="w-full h-4" viewBox="0 0 300 16">
                              <line
                                x1="10"
                                y1="8"
                                x2="290"
                                y2="8"
                                stroke="#00C896"
                                strokeWidth="2.5"
                              />
                              <circle cx="10" cy="8" r="2" fill="#00C896" />
                              <circle cx="290" cy="8" r="2" fill="#00C896" />
                            </svg>
                          </div>

                          {/* High PA line */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[8px] font-mono text-gray-500">
                              <span>High PA (Over compensation)</span>
                              <span className="text-yellow-400">Falhas e vazios nos cantos</span>
                            </div>
                            <svg className="w-full h-4" viewBox="0 0 300 16">
                              <line
                                x1="40"
                                y1="8"
                                x2="260"
                                y2="8"
                                stroke="#374151"
                                strokeWidth="2.5"
                              />
                              <line
                                x1="10"
                                y1="8"
                                x2="40"
                                y2="8"
                                stroke="#374151"
                                strokeWidth="1"
                                strokeDasharray="2 2"
                              />
                              <line
                                x1="260"
                                y1="8"
                                x2="290"
                                y2="8"
                                stroke="#374151"
                                strokeWidth="1"
                                strokeDasharray="2 2"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] leading-relaxed text-gray-400">
                        <span className="font-bold text-white">Instrução:</span> Procure a linha
                        onde as transições de velocidade (aceleração no início/fim e velocidade
                        constante no meio) mantêm a mesma espessura sem afinar no meio ou inchar nas
                        pontas.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. TEMPERATURE TOWER */}
              {activeCalibTab === "temp" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                      <Flame size={15} className="text-[#00C896]" />
                      Torre de Temperatura (Temp Tower)
                    </h2>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Determina a melhor temperatura de extrusão para o seu rolo específico de
                      filamento. Equilibra brilho, resistência estrutural de fusão, pontes
                      (bridging) e minimização de fiapos (stringing).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Controls */}
                    <div className="p-4 rounded-xl border border-gray-800 bg-[#16181f]/80 space-y-4">
                      <div className="text-xs font-black uppercase tracking-wider text-white border-b border-gray-800/60 pb-1.5 font-mono">
                        Ajuste Térmico do Material
                      </div>

                      <div className="space-y-3.5 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1 block">
                              Temperatura da Base (°C)
                            </label>
                            <input
                              type="number"
                              value={tempBase}
                              onChange={(e) => {
                                setTempBase(parseInt(e.target.value) || 220);
                                setTempCalibrated(null);
                              }}
                              className="w-full py-1.5 px-3 rounded bg-gray-950 border border-gray-800 font-mono text-[11px] text-gray-300"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1 block">
                              Passo de Redução por Bloco
                            </label>
                            <input
                              type="number"
                              value={tempStep}
                              onChange={(e) => {
                                setTempStep(parseInt(e.target.value) || 5);
                                setTempCalibrated(null);
                              }}
                              className="w-full py-1.5 px-3 rounded bg-gray-950 border border-gray-800 font-mono text-[11px] text-gray-300"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                              Segmento com melhor resultado (de baixo para cima)
                            </label>
                            <span className="font-mono font-bold text-[#00C896] px-1.5 py-0.5 rounded bg-[#00C896]/10">
                              Bloco {bestTempHeight} (reduzindo {bestTempHeight * tempStep}°C)
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="6"
                            step="1"
                            value={bestTempHeight}
                            onChange={(e) => {
                              setBestTempHeight(parseInt(e.target.value));
                              setTempCalibrated(null);
                            }}
                            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00C896]"
                          />
                          <div className="flex justify-between text-[9px] text-gray-600 font-mono mt-0.5">
                            <span>Base (Mais quente)</span>
                            <span>Bloco central</span>
                            <span>Topo (Mais frio)</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={calculateTemp}
                          className="w-full py-2 px-3 rounded-lg text-xs font-bold text-gray-950 bg-[#00C896] hover:bg-[#00e2aa] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Flame size={12} fill="currentColor" />
                          Calcular Temperatura Ideal
                        </button>
                      </div>

                      {/* Display Results */}
                      {tempCalibrated !== null && (
                        <div className="p-3.5 rounded-lg border border-[#00C896]/20 bg-[#00C896]/5 flex items-center justify-between">
                          <div>
                            <div className="text-[10px] text-gray-500 font-medium">
                              Temperatura Recomendada:
                            </div>
                            <div className="text-xl font-mono font-black text-[#00C896]">
                              {tempCalibrated} °C
                            </div>
                          </div>
                          <span className="text-[10px] bg-[#00C896]/10 text-[#00C896] px-2 py-1 rounded font-bold font-mono">
                            Insira nas Configs de Filamento
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Visual Tower Indicator */}
                    <div className="p-4 rounded-xl border border-gray-800 bg-[#16181f]/40 space-y-4 flex flex-col justify-between">
                      <div className="text-xs font-black uppercase tracking-wider text-white border-b border-gray-800/60 pb-1.5 font-mono">
                        Representação da Torre de Temperatura
                      </div>

                      <div className="flex justify-center items-center py-2 bg-gray-950 p-4 rounded-xl border border-gray-900">
                        <div className="flex flex-col-reverse w-24 border border-gray-800 rounded-md overflow-hidden font-mono font-bold text-[10px] text-center bg-[#15171e]/70 text-gray-500">
                          {[220, 215, 210, 205, 200, 195].map((temp, index) => {
                            const isCalib = tempCalibrated === temp;
                            return (
                              <div
                                key={temp}
                                className={`py-1.5 border-b border-gray-800/60 transition-all ${
                                  isCalib
                                    ? "bg-[#00C896]/10 text-[#00C896] font-black border-l-4 border-l-[#00C896]"
                                    : ""
                                }`}
                              >
                                {temp}°C {isCalib ? "★" : ""}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="text-[10px] leading-relaxed text-gray-400">
                        <span className="font-bold text-white">Inspeção:</span> Verifique as pontes
                        (pontes horizontais suspensas) quanto a descaimento, as quinas e quão fáceis
                        os fiapos são de remover de cada bloco. O bloco com menos fiapos e ótima
                        coesão é o vencedor.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. RETRACTION TOWER */}
              {activeCalibTab === "retraction" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                      <RotateCcw size={15} className="text-[#00C896]" />
                      Calibração de Distância de Retração
                    </h2>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Calibra a distância que o motor puxa o filamento de volta para o bico antes de
                      se deslocar. Reduz fiapos de cabelo-de-anjo (stringing) e vazamentos
                      indesejados nas superfícies.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Controls */}
                    <div className="p-4 rounded-xl border border-gray-800 bg-[#16181f]/80 space-y-4">
                      <div className="text-xs font-black uppercase tracking-wider text-white border-b border-gray-800/60 pb-1.5 font-mono">
                        Ajuste de Retração
                      </div>

                      <div className="space-y-3.5 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1 block">
                              Retração Inicial (mm)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={retrStart}
                              onChange={(e) => {
                                setRetrStart(parseFloat(e.target.value) || 0.4);
                                setRetrCalibrated(null);
                              }}
                              className="w-full py-1.5 px-3 rounded bg-gray-950 border border-gray-800 font-mono text-[11px] text-gray-300"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1 block">
                              Passo Incremental por mm
                            </label>
                            <input
                              type="number"
                              step="0.05"
                              value={retrStep}
                              onChange={(e) => {
                                setRetrStep(parseFloat(e.target.value) || 0.1);
                                setRetrCalibrated(null);
                              }}
                              className="w-full py-1.5 px-3 rounded bg-gray-950 border border-gray-800 font-mono text-[11px] text-gray-300"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                              Altura onde os fiapos sumiram (em mm)
                            </label>
                            <span className="font-mono font-bold text-[#00C896] px-1.5 py-0.5 rounded bg-[#00C896]/10">
                              {retrHeight} mm de altura
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="15"
                            step="0.5"
                            value={retrHeight}
                            onChange={(e) => {
                              setRetrHeight(parseFloat(e.target.value));
                              setRetrCalibrated(null);
                            }}
                            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00C896]"
                          />
                          <div className="flex justify-between text-[9px] text-gray-600 font-mono mt-0.5">
                            <span>0 mm (Base)</span>
                            <span>7.5 mm</span>
                            <span>15 mm (Topo)</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={calculateRetr}
                          className="w-full py-2 px-3 rounded-lg text-xs font-bold text-gray-950 bg-[#00C896] hover:bg-[#00e2aa] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <RotateCcw size={12} />
                          Calcular Retração Perfeita
                        </button>
                      </div>

                      {/* Display Results */}
                      {retrCalibrated !== null && (
                        <div className="p-3.5 rounded-lg border border-[#00C896]/20 bg-[#00C896]/5 flex items-center justify-between">
                          <div>
                            <div className="text-[10px] text-gray-500 font-medium">
                              Distância de Retração Recomendada:
                            </div>
                            <div className="text-xl font-mono font-black text-white">
                              {retrCalibrated} mm
                            </div>
                          </div>
                          <span className="text-[9px] bg-gray-800 text-gray-400 px-2 py-1 rounded font-bold font-mono">
                            Insira na aba Extrusora
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Interactive Retraction Visualizer */}
                    <div className="p-4 rounded-xl border border-gray-800 bg-[#16181f]/40 space-y-4 flex flex-col justify-between">
                      <div className="text-xs font-black uppercase tracking-wider text-white border-b border-gray-800/60 pb-1.5 font-mono">
                        Visualização de Torre de Stringing
                      </div>

                      <div className="flex-1 flex justify-center items-center py-2 bg-gray-950 p-4 rounded-xl border border-gray-900 min-h-[160px]">
                        <svg className="w-full max-w-[150px] h-32" viewBox="0 0 100 100">
                          {/* Left pole */}
                          <rect x="25" y="10" width="10" height="80" fill="#1f2937" rx="1" />
                          {/* Right pole */}
                          <rect x="65" y="10" width="10" height="80" fill="#1f2937" rx="1" />
                          {/* Base plat */}
                          <rect x="10" y="88" width="80" height="8" fill="#111827" rx="2" />

                          {/* Simulated Fiapos getting thinner as height increases */}
                          {/* Bottom part: heavy stringing */}
                          <line
                            x1="35"
                            y1="80"
                            x2="65"
                            y2="78"
                            stroke="#00C896"
                            strokeWidth="2.5"
                            opacity="0.8"
                          />
                          <line
                            x1="35"
                            y1="75"
                            x2="65"
                            y2="76"
                            stroke="#00C896"
                            strokeWidth="2"
                            opacity="0.75"
                          />
                          <line
                            x1="35"
                            y1="70"
                            x2="65"
                            y2="72"
                            stroke="#00C896"
                            strokeWidth="1.5"
                            opacity="0.7"
                          />

                          {/* Middle part: thin stringing */}
                          <line
                            x1="35"
                            y1="60"
                            x2="65"
                            y2="61"
                            stroke="#00C896"
                            strokeWidth="0.8"
                            opacity="0.5"
                          />
                          <line
                            x1="35"
                            y1="50"
                            x2="65"
                            y2="52"
                            stroke="#00C896"
                            strokeWidth="0.5"
                            strokeDasharray="1 1"
                            opacity="0.4"
                          />

                          {/* Top part: totally clean! */}
                          {/* Green indicator where stringing disappears */}
                          <line
                            x1="20"
                            y1="40"
                            x2="80"
                            y2="40"
                            stroke="#00C896"
                            strokeWidth="1"
                            strokeDasharray="3 2"
                            opacity="0.9"
                          />
                          <text
                            x="50"
                            y="36"
                            fill="#00C896"
                            fontSize="5"
                            textAnchor="middle"
                            fontWeight="bold"
                          >
                            RETRAÇÃO LIMPA ✓
                          </text>
                        </svg>
                      </div>

                      <div className="text-[10px] leading-relaxed text-gray-400">
                        <span className="font-bold text-white">Guia:</span> Meça com uma régua a
                        altura do início da peça até onde os fiapos somem completamente. Multiplique
                        pelo fator incremental para extrair a retração exata.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. MAX VOLUMETRIC FLOW RATE */}
              {activeCalibTab === "max_flow" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                      <Zap size={15} className="text-[#00C896]" />
                      Vazão Volumétrica Máxima (Max Volumetric Flow)
                    </h2>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Determina o limite físico de fusão do cabeçote quente da impressora (Hotend).
                      Evita pulos de motor (clashing) e sub-extrusão mecânica severa ao imprimir em
                      altas velocidades de fatiamento.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Controls */}
                    <div className="p-4 rounded-xl border border-gray-800 bg-[#16181f]/80 space-y-4">
                      <div className="text-xs font-black uppercase tracking-wider text-white border-b border-gray-800/60 pb-1.5 font-mono">
                        Limite Volumétrico de Extrusão
                      </div>

                      <div className="space-y-3.5 text-xs">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1 block">
                              Vazão Inicial (mm³/s)
                            </label>
                            <input
                              type="number"
                              value={maxFlowStart}
                              onChange={(e) => {
                                setMaxFlowStart(parseFloat(e.target.value) || 5);
                                setMaxFlowCalibrated(null);
                              }}
                              className="w-full py-1.5 px-3 rounded bg-gray-950 border border-gray-800 font-mono text-[11px] text-gray-300"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1 block">
                              Vazão Final (mm³/s)
                            </label>
                            <input
                              type="number"
                              value={maxFlowEnd}
                              onChange={(e) => {
                                setMaxFlowEnd(parseFloat(e.target.value) || 20);
                                setMaxFlowCalibrated(null);
                              }}
                              className="w-full py-1.5 px-3 rounded bg-gray-950 border border-gray-800 font-mono text-[11px] text-gray-300"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1 block">
                              Altura Total (mm)
                            </label>
                            <input
                              type="number"
                              value={maxFlowTotalHeight}
                              onChange={(e) => {
                                setMaxFlowTotalHeight(parseFloat(e.target.value) || 50);
                                setMaxFlowCalibrated(null);
                              }}
                              className="w-full py-1.5 px-3 rounded bg-gray-950 border border-gray-800 font-mono text-[11px] text-gray-300"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                              Altura onde a extrusão falhou / começou a falhar (mm)
                            </label>
                            <span className="font-mono font-bold text-[#00C896] px-1.5 py-0.5 rounded bg-[#00C896]/10">
                              {maxFlowHeight} mm de altura
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max={maxFlowTotalHeight}
                            step="1"
                            value={maxFlowHeight}
                            onChange={(e) => {
                              setMaxFlowHeight(parseFloat(e.target.value));
                              setMaxFlowCalibrated(null);
                            }}
                            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00C896]"
                          />
                          <div className="flex justify-between text-[9px] text-gray-600 font-mono mt-0.5">
                            <span>0 mm</span>
                            <span>{maxFlowTotalHeight / 2} mm</span>
                            <span>{maxFlowTotalHeight} mm</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={calculateMaxFlow}
                          className="w-full py-2 px-3 rounded-lg text-xs font-bold text-gray-950 bg-[#00C896] hover:bg-[#00e2aa] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Zap size={12} fill="currentColor" />
                          Calcular Vazão Limite
                        </button>
                      </div>

                      {/* Display Results */}
                      {maxFlowCalibrated !== null && (
                        <div className="p-3.5 rounded-lg border border-[#00C896]/20 bg-[#00C896]/5 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 font-mono font-bold">
                              Resumo Técnico:
                            </span>
                            <span className="text-[9px] font-mono text-gray-500">
                              V_max = Inicial + (Medido * (Fim - Inicial) / Altura_T)
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="text-[10px] text-gray-500 font-medium">
                                Vazão Máxima de Fusão:
                              </div>
                              <div className="text-lg font-mono font-black text-[#00C896]">
                                {maxFlowCalibrated} mm³/s
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] text-gray-500 font-medium">
                                Fator de Segurança (0.9):
                              </div>
                              <div className="text-lg font-mono font-black text-white">
                                {(maxFlowCalibrated * 0.9).toFixed(2)} mm³/s
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Interactive Max flow visualizer */}
                    <div className="p-4 rounded-xl border border-gray-800 bg-[#16181f]/40 space-y-4 flex flex-col justify-between">
                      <div className="text-xs font-black uppercase tracking-wider text-white border-b border-gray-800/60 pb-1.5 font-mono">
                        Como identificar o ponto de falha (Under-extrusion)
                      </div>

                      <div className="flex-1 flex justify-center items-center py-2 bg-gray-950 p-4 rounded-xl border border-gray-900 min-h-[160px]">
                        <svg className="w-full max-w-[140px] h-32" viewBox="0 0 100 120">
                          {/* Base block - perfect smooth extrusion */}
                          <polygon
                            points="20,110 80,110 80,80 20,80"
                            fill="#1f2937"
                            stroke="#111827"
                          />

                          {/* Mid block - slight under extrusion */}
                          <polygon
                            points="20,80 80,80 80,50 20,50"
                            fill="#1f2937"
                            stroke="#111827"
                          />
                          {/* Tiny diagonal patterns representing roughness */}
                          <path
                            d="M 22,65 L 30,73 M 40,55 L 55,70 M 65,60 L 78,73"
                            stroke="#374151"
                            strokeWidth="1"
                          />

                          {/* Top block - severe matte / failed extrusion */}
                          <polygon
                            points="20,50 80,50 80,20 20,20"
                            fill="#111827"
                            stroke="#ef4444"
                            strokeWidth="1"
                          />
                          {/* Gaps in extrusion */}
                          <path
                            d="M 22,30 L 40,30 M 55,30 L 78,30 M 22,40 L 45,40 M 60,40 L 78,40 M 22,25 L 35,25"
                            stroke="#ef4444"
                            strokeWidth="1.5"
                            strokeDasharray="2 3"
                          />

                          {/* Dimension height marker */}
                          <line x1="88" y1="110" x2="88" y2="20" stroke="#4b5563" strokeWidth="1" />
                          <line
                            x1="85"
                            y1="110"
                            x2="91"
                            y2="110"
                            stroke="#4b5563"
                            strokeWidth="1"
                          />
                          <line x1="85" y1="20" x2="91" y2="20" stroke="#4b5563" strokeWidth="1" />
                          <text
                            x="94"
                            y="65"
                            fill="#9ca3af"
                            fontSize="6"
                            writingMode="tb"
                            fontStyle="italic"
                          >
                            Velocidade e Vazão ↑
                          </text>

                          {/* Green safety line */}
                          <line
                            x1="15"
                            y1="65"
                            x2="85"
                            y2="65"
                            stroke="#00C896"
                            strokeWidth="1"
                            strokeDasharray="3 2"
                          />
                          <text
                            x="50"
                            y="61"
                            fill="#00C896"
                            fontSize="5"
                            textAnchor="middle"
                            fontWeight="bold"
                          >
                            PONTO DE LIMITAÇÃO ✓
                          </text>
                        </svg>
                      </div>

                      <div className="text-[10px] leading-relaxed text-gray-400">
                        <span className="font-bold text-white">Guia:</span> Conforme a altura
                        aumenta, a vazão sobe. Observe onde a superfície do filamento se torna
                        subitamente <strong className="text-white">fosca, falhada</strong> ou começa
                        a apresentar frestas. Meça essa altura para calcular o seu limite exato.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. VFA (VERTICAL FINE ARTIFACTS) */}
              {activeCalibTab === "vfa" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                      <Activity size={15} className="text-[#00C896]" />
                      Artefatos Finos Verticais (VFA - Vertical Fine Artifacts)
                    </h2>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Mede e isola imperfeições repetitivas nas paredes externas da impressão.
                      Vibrações induzidas pelos motores de passo e polias criam padrões verticais em
                      certas velocidades. O teste imprime uma torre com incremento gradual de
                      velocidade.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Controls */}
                    <div className="p-4 rounded-xl border border-gray-800 bg-[#16181f]/80 space-y-4">
                      <div className="text-xs font-black uppercase tracking-wider text-white border-b border-gray-800/60 pb-1.5 font-mono">
                        Calculadora de Velocidade Silenciosa
                      </div>

                      <div className="space-y-3.5 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1 block">
                              Velocidade Inicial (mm/s)
                            </label>
                            <input
                              type="number"
                              value={vfaStart}
                              onChange={(e) => {
                                setVfaStart(parseFloat(e.target.value) || 40);
                                setVfaSpeedCalibrated(null);
                              }}
                              className="w-full py-1.5 px-3 rounded bg-gray-950 border border-gray-800 font-mono text-[11px] text-gray-300 focus:border-[#00C896] outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1 block">
                              Velocidade Final (mm/s)
                            </label>
                            <input
                              type="number"
                              value={vfaEnd}
                              onChange={(e) => {
                                setVfaEnd(parseFloat(e.target.value) || 200);
                                setVfaSpeedCalibrated(null);
                              }}
                              className="w-full py-1.5 px-3 rounded bg-gray-950 border border-gray-800 font-mono text-[11px] text-gray-300 focus:border-[#00C896] outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1 block">
                              Altura Total da Torre (mm)
                            </label>
                            <input
                              type="number"
                              value={vfaTotalHeight}
                              onChange={(e) => {
                                setVfaTotalHeight(parseFloat(e.target.value) || 80);
                                setVfaSpeedCalibrated(null);
                              }}
                              className="w-full py-1.5 px-3 rounded bg-gray-950 border border-gray-800 font-mono text-[11px] text-gray-300 focus:border-[#00C896] outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1 block">
                              Altura com Menos Artefato (mm)
                            </label>
                            <input
                              type="number"
                              value={vfaHeight}
                              onChange={(e) => {
                                setVfaHeight(parseFloat(e.target.value) || 45);
                                setVfaSpeedCalibrated(null);
                              }}
                              className="w-full py-1.5 px-3 rounded bg-gray-950 border border-gray-800 font-mono text-[11px] text-gray-300 focus:border-[#00C896] outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                              Arrastar até a zona com parede perfeita
                            </label>
                            <span className="font-mono font-bold text-[#00C896] px-1.5 py-0.5 rounded bg-[#00C896]/10">
                              {vfaHeight} mm de altura
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max={vfaTotalHeight}
                            step="1"
                            value={vfaHeight}
                            onChange={(e) => {
                              setVfaHeight(parseFloat(e.target.value));
                              setVfaSpeedCalibrated(null);
                            }}
                            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00C896]"
                          />
                          <div className="flex justify-between text-[9px] text-gray-600 font-mono mt-0.5">
                            <span>0 mm (Lento)</span>
                            <span>{vfaTotalHeight / 2} mm</span>
                            <span>{vfaTotalHeight} mm (Rápido)</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={calculateVFA}
                          className="w-full py-2 px-3 rounded-lg text-xs font-bold text-gray-950 bg-[#00C896] hover:bg-[#00e2aa] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(0,200,150,0.15)] animate-pulse"
                        >
                          <Activity size={12} />
                          Calcular Velocidade Ideal sem VFA
                        </button>
                      </div>

                      {/* Display Results */}
                      {vfaSpeedCalibrated !== null && (
                        <div className="p-3.5 rounded-lg border border-[#00C896]/20 bg-[#00C896]/5 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono font-bold">
                              Velocidade Ótima do Motor:
                            </span>
                            <span className="text-[9px] font-mono text-gray-500">
                              Vel = Inicial + (Medido * (Fim - Inicial) / Altura_T)
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-[10px] text-gray-500 font-medium">
                                Velocidade Limpa Recomendada:
                              </div>
                              <div className="text-xl font-mono font-black text-[#00C896]">
                                {vfaSpeedCalibrated} mm/s
                              </div>
                            </div>
                            <span className="text-[10px] bg-[#00C896]/10 text-[#00C896] px-2 py-1 rounded font-bold font-mono">
                              Use nas paredes externas!
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Interactive VFA wall visualizer */}
                    <div className="p-4 rounded-xl border border-gray-800 bg-[#16181f]/40 space-y-4 flex flex-col justify-between">
                      <div className="text-xs font-black uppercase tracking-wider text-white border-b border-gray-800/60 pb-1.5 font-mono">
                        Visualizador de Linhas de Vibração (VFA)
                      </div>

                      <div className="flex-1 flex justify-center items-center py-2 bg-gray-950 p-4 rounded-xl border border-gray-900 min-h-[160px]">
                        <svg className="w-full max-w-[150px] h-32" viewBox="0 0 100 120">
                          {/* Main tower */}
                          <rect
                            x="25"
                            y="10"
                            width="50"
                            height="100"
                            fill="#1b1d24"
                            stroke="#2e3340"
                            strokeWidth="1"
                          />

                          {/* Waves of vibration */}
                          {/* Bottom part (e.g. height 0 to 40) - slow speeds often show heavy resonance ripples */}
                          <path
                            d="M 25,110 Q 30,108 35,110 T 45,110 T 55,110 T 65,110 T 75,110"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="1"
                            opacity="0.6"
                          />
                          <path
                            d="M 25,100 Q 30,98 35,100 T 45,100 T 55,100 T 65,100 T 75,100"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="1"
                            opacity="0.6"
                          />
                          <path
                            d="M 25,90 Q 30,88 35,90 T 45,90 T 55,90 T 65,90 T 75,90"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="1"
                            opacity="0.6"
                          />
                          <path
                            d="M 25,80 Q 30,78 35,80 T 45,80 T 55,80 T 65,80 T 75,80"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="0.8"
                            opacity="0.5"
                          />

                          {/* Middle part - smoothest wall around best height */}
                          {/* Representing clean straight lines */}
                          <line
                            x1="25"
                            y1="70"
                            x2="75"
                            y2="70"
                            stroke="#00C896"
                            strokeWidth="0.4"
                            opacity="0.3"
                          />
                          <line
                            x1="25"
                            y1="60"
                            x2="75"
                            y2="60"
                            stroke="#00C896"
                            strokeWidth="0.4"
                            opacity="0.3"
                          />
                          <line
                            x1="25"
                            y1="50"
                            x2="75"
                            y2="50"
                            stroke="#00C896"
                            strokeWidth="0.4"
                            opacity="0.3"
                          />

                          {/* Top part - fast speeds where resonance changes or gets better */}
                          <path
                            d="M 25,40 Q 30,39 35,40 T 45,40 T 55,40 T 65,40 T 75,40"
                            fill="none"
                            stroke="#374151"
                            strokeWidth="0.6"
                            opacity="0.4"
                          />
                          <path
                            d="M 25,30 Q 30,29 35,30 T 45,30 T 55,30 T 65,30 T 75,30"
                            fill="none"
                            stroke="#374151"
                            strokeWidth="0.6"
                            opacity="0.4"
                          />
                          <path
                            d="M 25,20 Q 30,19 35,20 T 45,20 T 55,20 T 65,20 T 75,20"
                            fill="none"
                            stroke="#374151"
                            strokeWidth="0.6"
                            opacity="0.4"
                          />

                          {/* Best selection indicator overlay */}
                          {(() => {
                            const pct = vfaHeight / vfaTotalHeight;
                            const y = 110 - pct * 100;
                            return (
                              <>
                                <line
                                  x1="20"
                                  y1={y}
                                  x2="80"
                                  y2={y}
                                  stroke="#00C896"
                                  strokeWidth="1.2"
                                />
                                <circle cx="20" cy={y} r="2.5" fill="#00C896" />
                                <circle cx="80" cy={y} r="2.5" fill="#00C896" />
                                <rect
                                  x="30"
                                  y={y - 7}
                                  width="40"
                                  height="6"
                                  fill="#00C896"
                                  rx="1.5"
                                />
                                <text
                                  x="50"
                                  y={y - 3}
                                  fill="#12141a"
                                  fontSize="4.5"
                                  textAnchor="middle"
                                  fontWeight="bold"
                                >
                                  MELHOR SEÇÃO ✓
                                </text>
                              </>
                            );
                          })()}
                        </svg>
                      </div>

                      <div className="text-[10px] leading-relaxed text-gray-400">
                        <span className="font-bold text-white">Guia de Análise:</span> Coloque a
                        torre impressa sob uma lâmpada lateral ou luz solar rasante. Passe o dedo
                        pelas paredes. Haverá uma faixa de altura onde o padrão de ondulações quase
                        some, restando uma parede super lisa. Meça essa altura.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. DIMENSIONAL TOLERANCE */}
              {activeCalibTab === "tolerance" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                      <Grid size={15} className="text-[#00C896]" />
                      Tolerância Dimensional e Encaixes (Tolerance Test)
                    </h2>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Avalia a folga radial necessária entre partes móveis (parafusos, engrenagens,
                      rolamentos de plástico) para que eles não se fundam durante a impressão. O
                      teste padrão do OrcaSlicer possui 6 pinos com folgas de{" "}
                      <strong className="text-white">0,5 mm down to 0,1 mm</strong>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Controls */}
                    <div className="p-4 rounded-xl border border-gray-800 bg-[#16181f]/80 space-y-4">
                      <div className="text-xs font-black uppercase tracking-wider text-white border-b border-gray-800/60 pb-1.5 font-mono">
                        Calculadora & Diagnóstico de Folga
                      </div>

                      <div className="space-y-3.5 text-xs">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2 block">
                            Qual o menor pino que você conseguiu remover/girar livremente?
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { val: 0.5, label: "0.5 mm", desc: "Folga Larga" },
                              { val: 0.4, label: "0.4 mm", desc: "Médio-Largo" },
                              { val: 0.3, label: "0.3 mm", desc: "Padrão Aceitável" },
                              { val: 0.2, label: "0.2 mm", desc: "Excelente" },
                              { val: 0.15, label: "0.15 mm", desc: "Quase Mestre" },
                              { val: 0.1, label: "0.1 mm", desc: "Nível Divino" },
                            ].map((opt) => {
                              const isSelected = toleranceVal === opt.val;
                              return (
                                <button
                                  key={opt.val}
                                  onClick={() => setToleranceVal(opt.val)}
                                  className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                    isSelected
                                      ? "bg-[#00C896]/10 border-[#00C896] text-[#00C896] shadow-[0_0_8px_rgba(0,200,150,0.1)]"
                                      : "bg-gray-950 border-gray-800/70 text-gray-400 hover:border-gray-700/60"
                                  }`}
                                >
                                  <span className="font-mono font-black text-xs block">
                                    {opt.label}
                                  </span>
                                  <span className="text-[8px] opacity-60 font-bold mt-1 uppercase tracking-tight truncate">
                                    {opt.desc}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Diagnostic result */}
                        <div className="p-3.5 rounded-lg border border-gray-800 bg-gray-950/60 space-y-2">
                          <span className="text-[9px] uppercase tracking-wider text-gray-500 font-extrabold font-mono block">
                            DIAGNÓSTICO DA IMPRESSORA:
                          </span>
                          {toleranceVal >= 0.4 ? (
                            <div className="space-y-1.5">
                              <div className="text-xs font-bold text-yellow-400">
                                Requer Ajustes Urgentes
                              </div>
                              <p className="text-[10px] text-gray-400 leading-relaxed">
                                Seus eixos estão vibrando, ou há sobre-extrusão considerável fazendo
                                com que os perímetros invadam a folga livre.{" "}
                                <strong>Recomendação:</strong> Refaça o teste de Vazão/Flow (Módulo
                                1) e diminua em 1% a 2% para testar novamente, ou ative "Compensação
                                de furos XY" (XY Hole Compensation) com{" "}
                                <code className="text-white font-mono bg-gray-900 px-1 rounded">
                                  0.1 mm
                                </code>
                                .
                              </p>
                            </div>
                          ) : toleranceVal === 0.3 ? (
                            <div className="space-y-1.5">
                              <div className="text-xs font-bold text-blue-400">
                                Precisão Standard
                              </div>
                              <p className="text-[10px] text-gray-400 leading-relaxed">
                                Sua impressora está com uma calibração normal comum. Encaixes
                                simples e dobradiças com folgas padrão de 0.3mm funcionarão
                                perfeitamente. Para descer para 0.2mm, certifique-se de que o
                                recurso <strong className="text-white">Outer wall speed</strong> não
                                está rápido demais, evitando arrasto plástico nas esquinas.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <div className="text-xs font-bold text-[#00C896]">
                                Super Precisão Mecânica!
                              </div>
                              <p className="text-[10px] text-gray-400 leading-relaxed">
                                Fantástico! Sua máquina está perfeitamente ajustada. Perímetros
                                lisos, sem "ghosting" e com fluxo preciso. Você pode fatiar e
                                imprimir mecanismos complexos que giram diretamente da mesa
                                (Print-in-place) com folgas de 0.2mm sem risco de soldar as peças.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Interactive Tolerance visualizer */}
                    <div className="p-4 rounded-xl border border-gray-800 bg-[#16181f]/40 space-y-4 flex flex-col justify-between">
                      <div className="text-xs font-black uppercase tracking-wider text-white border-b border-gray-800/60 pb-1.5 font-mono">
                        Esquema Visual do Encaixe (Folga Radial)
                      </div>

                      <div className="flex-1 flex justify-center items-center py-2 bg-gray-950 p-4 rounded-xl border border-gray-900 min-h-[160px]">
                        <svg className="w-full max-w-[150px] h-32" viewBox="0 0 100 100">
                          {/* Outer block (hole) */}
                          <rect
                            x="20"
                            y="20"
                            width="60"
                            height="60"
                            rx="6"
                            fill="#1b1d24"
                            stroke="#2e3340"
                            strokeWidth="2"
                          />

                          {/* Inner peg circle inside hole */}
                          {(() => {
                            const holeR = 24;
                            const pegR = holeR - toleranceVal * 16;
                            return (
                              <>
                                {/* Hole boundary line */}
                                <circle
                                  cx="50"
                                  cy="50"
                                  r={holeR}
                                  fill="#0d0f14"
                                  stroke="#374151"
                                  strokeWidth="1"
                                  strokeDasharray="2 2"
                                />

                                {/* Gap visualizer highlights */}
                                <circle
                                  cx="50"
                                  cy="50"
                                  r={(holeR + pegR) / 2}
                                  fill="none"
                                  stroke="#00C896"
                                  strokeWidth={holeR - pegR}
                                  opacity="0.15"
                                />

                                {/* Peg (the circular rotative pin) */}
                                <circle
                                  cx="50"
                                  cy="50"
                                  r={pegR}
                                  fill="#111827"
                                  stroke={toleranceVal <= 0.2 ? "#00C896" : "#4b5563"}
                                  strokeWidth="1.8"
                                />
                                <line
                                  x1="50"
                                  y1="50"
                                  x2="50"
                                  y2={50 - pegR + 4}
                                  stroke="#00C896"
                                  strokeWidth="1.5"
                                />
                                <circle cx="50" cy="50" r="3" fill="#00C896" />

                                {/* Clearance callout labels */}
                                <text
                                  x="50"
                                  y="94"
                                  fill="#9ca3af"
                                  fontSize="6.5"
                                  textAnchor="middle"
                                  fontWeight="bold"
                                >
                                  Folga Radial: {toleranceVal}mm
                                </text>
                              </>
                            );
                          })()}
                        </svg>
                      </div>

                      <div className="text-[10px] leading-relaxed text-gray-400">
                        <span className="font-bold text-white">Como realizar o teste físico:</span>{" "}
                        Insira uma chave de fenda sextavada nos eixos dos pinos hexagonais da peça
                        impressa e tente girar. Se soltar fácil, aquela tolerância é garantida na
                        sua máquina!
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 8. IRONING (ALISAMENTO DA CAMADA SUPERIOR) */}
              {activeCalibTab === "ironing" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                      <Sparkles size={15} className="text-[#00C896]" />
                      Alisamento de Camada Superior (Ironing Test)
                    </h2>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Transforma a superfície áspera das linhas de preenchimento de topo em uma
                      chapa ultra-lisa parecida com metal injetado. O bico quente passa repassando
                      calor e extrudando uma quantidade microscópica de filamento extra para
                      calafetar frestas.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Controls */}
                    <div className="p-4 rounded-xl border border-gray-800 bg-[#16181f]/80 space-y-4">
                      <div className="text-xs font-black uppercase tracking-wider text-white border-b border-gray-800/60 pb-1.5 font-mono">
                        Ajuste de Fluxo de Alisamento
                      </div>

                      <div className="space-y-3.5 text-xs">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                              Fluxo de Alisamento (Ironing Flow %)
                            </label>
                            <span className="font-mono font-bold text-[#00C896] px-1.5 py-0.5 rounded bg-[#00C896]/10">
                              {ironingFlow}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="35"
                            step="2"
                            value={ironingFlow}
                            onChange={(e) => {
                              setIroningFlow(parseInt(e.target.value));
                              setIroningCalibrated(false);
                            }}
                            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00C896]"
                          />
                          <div className="flex justify-between text-[9px] text-gray-600 font-mono mt-0.5">
                            <span>5% (Pouco plástico)</span>
                            <span>15% (Recomendado)</span>
                            <span>35% (Risco de raspar/entupir)</span>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                              Velocidade de Alisamento (Ironing Speed)
                            </label>
                            <span className="font-mono font-bold text-white">
                              {ironingSpeed} mm/s
                            </span>
                          </div>
                          <input
                            type="range"
                            min="15"
                            max="100"
                            step="5"
                            value={ironingSpeed}
                            onChange={(e) => {
                              setIroningSpeed(parseInt(e.target.value));
                              setIroningCalibrated(false);
                            }}
                            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00C896]"
                          />
                          <div className="flex justify-between text-[9px] text-gray-600 font-mono mt-0.5">
                            <span>15 mm/s (Lento e preciso)</span>
                            <span>50 mm/s (Normal)</span>
                            <span>100 mm/s (Rápido demais)</span>
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            onClick={() => {
                              setIroningCalibrated(true);
                              showToast(
                                `Configuração de Alisamento (Vazão: ${ironingFlow}%, Vel: ${ironingSpeed}mm/s) pré-calculada!`,
                              );
                            }}
                            className="w-full py-2 px-3 rounded-lg text-xs font-bold text-gray-950 bg-[#00C896] hover:bg-[#00e2aa] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(0,200,150,0.15)]"
                          >
                            <Sparkles size={12} fill="currentColor" />
                            Aprovar Ajuste de Alisamento
                          </button>
                        </div>

                        {/* Results display */}
                        {ironingCalibrated && (
                          <div className="p-3.5 rounded-lg border border-[#00C896]/20 bg-[#00C896]/5 space-y-2.5">
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono font-bold block">
                              Resumo Técnico:
                            </span>
                            <div className="text-[11px] text-gray-300 leading-normal">
                              Insira os parâmetros abaixo na aba{" "}
                              <strong className="text-white">Qualidade / Camada Superior</strong> do
                              OrcaSlicer para habilitar o acabamento de metal polido:
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                              <div className="p-1.5 rounded bg-gray-900 border border-gray-800 text-center">
                                <span className="text-[8px] text-gray-500 block uppercase font-sans">
                                  Tipo de Alisamento
                                </span>
                                <strong className="text-white">Todas Sup. de Topo</strong>
                              </div>
                              <div className="p-1.5 rounded bg-gray-900 border border-gray-800 text-center">
                                <span className="text-[8px] text-gray-500 block uppercase font-sans">
                                  Fluxo de Alisamento
                                </span>
                                <strong className="text-[#00C896]">{ironingFlow}%</strong>
                              </div>
                              <div className="p-1.5 rounded bg-gray-900 border border-gray-800 text-center col-span-2">
                                <span className="text-[8px] text-gray-500 block uppercase font-sans">
                                  Velocidade de Alisamento
                                </span>
                                <strong className="text-white">{ironingSpeed} mm/s</strong>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Interactive Ironing visualizer */}
                    <div className="p-4 rounded-xl border border-gray-800 bg-[#16181f]/40 space-y-4 flex flex-col justify-between">
                      <div className="text-xs font-black uppercase tracking-wider text-white border-b border-gray-800/60 pb-1.5 font-mono">
                        Visualizador de Textura Superior (Efeito Ironing)
                      </div>

                      <div className="relative w-full max-w-[140px] aspect-video rounded-xl overflow-hidden border border-gray-800 shadow-inner flex items-center justify-center">
                        {/* Left side: normal lines */}
                        <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#1b1d24] flex flex-col justify-between p-1 opacity-90 border-r border-gray-800">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="h-0.5 bg-[#2a2e3a]" />
                          ))}
                          <span className="absolute bottom-1 left-2 text-[7px] font-mono uppercase tracking-widest text-gray-500 font-bold bg-[#111218]/80 px-1 rounded">
                            Sem Ironing
                          </span>
                        </div>

                        {/* Right side: ironed surface based on flow */}
                        <div
                          className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center transition-all duration-300"
                          style={{
                            background:
                              ironingFlow < 12
                                ? "#1a1c23" // dull with slight gaps
                                : ironingFlow > 22
                                  ? "#2a2d36" // rough overflow scratches
                                  : "#1f222b", // beautiful velvet metallic smooth
                          }}
                        >
                          {/* Visual effect overlay based on flow */}
                          {ironingFlow < 12 ? (
                            // Gaps between lines
                            <div className="w-full h-full flex flex-col justify-between p-1 opacity-30">
                              {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-0.5 bg-black" />
                              ))}
                            </div>
                          ) : ironingFlow > 22 ? (
                            // Rough scratch marks from too much plastic pushing around the nozzle
                            <div className="w-full h-full relative opacity-50">
                              <svg className="w-full h-full" viewBox="0 0 50 50">
                                <path
                                  d="M 5,5 L 45,45 M 10,2 L 48,40 M 2,15 L 35,48 M 15,10 L 40,35"
                                  stroke="#ef4444"
                                  strokeWidth="1"
                                />
                                <path
                                  d="M 45,5 L 5,45 M 48,15 L 15,48"
                                  stroke="#ffffff"
                                  strokeWidth="0.5"
                                  opacity="0.3"
                                />
                              </svg>
                            </div>
                          ) : (
                            // Smooth highlight reflection
                            <div className="w-full h-full bg-gradient-to-tr from-[#1f222b] via-[#35433f] to-[#1f222b] opacity-80 animate-pulse" />
                          )}

                          <span className="absolute bottom-1 right-2 text-[7px] font-mono uppercase tracking-widest text-[#00C896] font-black bg-[#111218]/80 px-1 rounded">
                            {ironingFlow < 12
                              ? "Sub-Fluxo"
                              : ironingFlow > 22
                                ? "Caroços / Riscado"
                                : "Liso Espelho ✓"}
                          </span>
                        </div>
                      </div>

                      <div className="text-[10px] leading-relaxed text-gray-400">
                        <span className="font-bold text-white">Como escolher:</span> O teste do
                        OrcaSlicer imprime 5 a 6 placas menores com fluxos crescentes. Passe as
                        pontas dos dedos e escolha aquela que apresenta toque aveludado sem sulcos
                        ásperos e sem rebarbas nas bordas.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3 PANEL: FLUXO DE FATIAMENTO */}
        {activeStep === 3 && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar-thin">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                <Layers size={15} className="text-[#00C896]" />
                Aplicação Prática no Fatiamento Profissional
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                Agora que você obteve as constantes físicas perfeitas do seu filamento
                (Multiplicador de Vazão, PA e Temperatura), saiba como organizar e carregar essas
                calibrações no fatiador para produzir os melhores perfis com base na aplicação
                desejada.
              </p>
            </div>

            {/* Slicing flow guide cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl border border-gray-800 bg-[#16181f]/70 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-white border-b border-gray-800/60 pb-1.5 font-mono flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#00C896]" />
                  Fluxo Recomendado de Fatiamento (3 Passos)
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded bg-[#00C896]/15 text-[#00C896] flex items-center justify-center font-mono font-black text-xs flex-shrink-0">
                      1
                    </div>
                    <div>
                      <strong className="text-white block mb-0.5">
                        Criar Perfil Personalizado de Filamento
                      </strong>
                      <span className="text-gray-400 leading-relaxed block text-[10.5px]">
                        Vá nas configurações de Filamento do OrcaSlicer, salve como uma nova
                        predefinição (ex:{" "}
                        <em className="text-[#00C896] not-italic font-bold font-mono">
                          Meu PLA Premium Calibrado
                        </em>
                        ) e preencha o{" "}
                        <strong className="text-gray-300">Multiplicador de Extrusão</strong> e a{" "}
                        <strong className="text-gray-300">Temperatura do Bico</strong> que você
                        calculou no Passo 2.
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded bg-[#00C896]/15 text-[#00C896] flex items-center justify-center font-mono font-black text-xs flex-shrink-0">
                      2
                    </div>
                    <div>
                      <strong className="text-white block mb-0.5">
                        Inserir as Configurações de Compensação (PA)
                      </strong>
                      <span className="text-gray-400 leading-relaxed block text-[10.5px]">
                        Ative a opção <strong className="text-gray-300">Pressure Advance</strong> no
                        Slicer (dentro do perfil de filamento ou de filamento de engenharia) e
                        insira o valor exato calculado (ex:{" "}
                        <em className="text-[#00C896] not-italic font-bold font-mono">0.024s</em>{" "}
                        para Direct-drive ou{" "}
                        <em className="text-[#00C896] not-italic font-bold font-mono">0.45s</em>{" "}
                        para Bowden).
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded bg-[#00C896]/15 text-[#00C896] flex items-center justify-center font-mono font-black text-xs flex-shrink-0">
                      3
                    </div>
                    <div>
                      <strong className="text-white block mb-0.5">
                        Ajustar os Parâmetros pelo Uso da Peça
                      </strong>
                      <span className="text-gray-400 leading-relaxed block text-[10.5px]">
                        Ao fatiar, adapte os parâmetros do simulador dependendo do seu objetivo.
                        Peças funcionais carregam mais paredes (loops) e giroide, enquanto peças
                        decorativas usam lightning infill de baixa densidade para economizar
                        filamento!
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slicer Settings Cheat-Sheet */}
              <div className="p-4 rounded-xl border border-gray-800 bg-[#16181f]/70 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-white border-b border-gray-800/60 pb-1.5 font-mono flex items-center gap-1.5">
                  <Shield size={13} className="text-blue-400" />
                  Parâmetros de Slicing Rápidos (Mestre do Fatiador)
                </h3>

                <div className="space-y-2.5 text-[10.5px]">
                  <div className="p-2 rounded-lg bg-gray-900/50 border border-gray-800/50">
                    <strong className="text-[#00C896] block mb-0.5 uppercase tracking-wider text-[9px] font-black">
                      Peças Estruturais / Mecânicas:
                    </strong>
                    <span className="text-gray-400 leading-relaxed">
                      Altura de camada maior (0.20 mm a 0.28 mm) aumenta a adesão mecânica. Loops de
                      parede elevados (4 a 5 loops) e preenchimento{" "}
                      <strong className="text-white">Giroide (30% a 40%)</strong> garantem rigidez
                      em todas as direções físicas.
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-gray-900/50 border border-gray-800/50">
                    <strong className="text-blue-400 block mb-0.5 uppercase tracking-wider text-[9px] font-black">
                      Modelos Decorativos / Miniaturas:
                    </strong>
                    <span className="text-gray-400 leading-relaxed">
                      Altura de camada mínima (0.08 mm a 0.12 mm) para remover a textura de escada.
                      2 loops de parede são suficientes, com preenchimento tipo{" "}
                      <strong className="text-white">Relâmpago (Lightning) a 8% ou 10%</strong> para
                      suporte interno apenas na cúpula.
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-gray-900/50 border border-gray-800/50">
                    <strong className="text-purple-400 block mb-0.5 uppercase tracking-wider text-[9px] font-black">
                      Filamentos Flexíveis (TPU):
                    </strong>
                    <span className="text-gray-400 leading-relaxed">
                      Velocidade lenta (&lt; 30mm/s), retração mínima ou desligada para evitar
                      engasgos, ventilação de resfriamento constante a 100% e preenchimento Giroide
                      para manter compressão elástica uniforme.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt Action banner */}
            <div className="p-4 rounded-xl border border-[#00C896]/20 bg-emerald-950/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase font-mono">
                  <Sparkles size={14} className="text-[#00C896]" />
                  Pronto para criar sua obra de arte impressa?
                </h4>
                <p className="text-[10px] text-gray-400 font-medium max-w-xl">
                  Seus parâmetros físicos estão perfeitamente calculados. Volte ao simulador de
                  fatiamento para explorar as explicações detalhadas de cada parâmetro do módulo 10
                  e fatiar seu modelo com precisão cirúrgica.
                </p>
              </div>

              <button
                onClick={onBackToSlicer}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-gray-950 bg-[#00C896] hover:bg-[#00e2aa] transition-all cursor-pointer shadow-md shadow-emerald-950/20 active:scale-95 whitespace-nowrap"
              >
                Retornar para o Simulador
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AlteradoTag() {
  return (
    <span
      className="inline-flex items-center px-1.5 h-4 rounded-full text-[9px] font-black uppercase tracking-widest"
      style={{
        background: "#facc15",
        color: "#111",
        letterSpacing: "0.1em",
      }}
    >
      Alterado
    </span>
  );
}
