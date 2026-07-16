import { useState } from "react";
import { Lightbulb, X, Send, CheckCircle2 } from "lucide-react";
import { createSuggestion } from "@/lib/suggestions.functions";

export function SuggestionsButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (message.trim().length < 3) {
      setError("Escreva pelo menos 3 caracteres.");
      return;
    }
    setSending(true);
    setError(null);
    try {
      await createSuggestion({
        data: { message: message.trim(), category: category.trim() || null },
      });
      setSent(true);
      setMessage("");
      setCategory("");
      setTimeout(() => {
        setSent(false);
        setOpen(false);
      }, 1800);
    } catch (e) {
      setError((e as Error).message || "Erro ao enviar. Tente novamente.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 h-11 rounded-full font-bold text-[12px] uppercase tracking-wider shadow-2xl transition-transform hover:scale-105"
        style={{
          background: "linear-gradient(135deg, #facc15 0%, #f59e0b 100%)",
          color: "#0a0c10",
          boxShadow: "0 10px 30px -8px rgba(250,204,21,0.55)",
        }}
        title="Enviar sugestão para o instrutor"
      >
        <Lightbulb size={16} />
        Sugestão
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => !sending && setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: "#10131a", border: "1px solid #2a2e3a" }}
            onClick={(e) => e.stopPropagation()}
          >
            <header
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid #1f2430" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "#facc1522", border: "1px solid #facc1555" }}
                >
                  <Lightbulb size={14} style={{ color: "#facc15" }} />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-bold text-white">Enviar sugestão</span>
                  <span className="text-[11px] text-gray-500">
                    Sua ideia chega direto no painel do instrutor.
                  </span>
                </div>
              </div>
              <button
                onClick={() => !sending && setOpen(false)}
                className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-white/5"
              >
                <X size={16} />
              </button>
            </header>

            <div className="p-5 space-y-3">
              {sent ? (
                <div className="flex flex-col items-center py-6 gap-2 text-center">
                  <CheckCircle2 size={38} style={{ color: "#00C896" }} />
                  <div className="text-white font-bold">Obrigado!</div>
                  <div className="text-gray-400 text-sm">Sua sugestão foi enviada.</div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1 block">
                      Categoria (opcional)
                    </label>
                    <input
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Ex.: Calibração, Curso, Bug, Melhoria…"
                      className="w-full px-3 h-10 rounded-lg bg-[#0a0c10] border border-[#1f2430] text-sm text-white outline-none focus:border-[#facc15]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1 block">
                      Sua sugestão
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      maxLength={4000}
                      placeholder="Conte o que gostaria de ver, o que pode melhorar, dúvidas recorrentes…"
                      className="w-full px-3 py-2 rounded-lg bg-[#0a0c10] border border-[#1f2430] text-sm text-white outline-none focus:border-[#facc15] resize-none"
                    />
                    <div className="text-[10px] text-gray-600 mt-1 text-right">
                      {message.length}/4000
                    </div>
                  </div>
                  {error && (
                    <div className="text-xs text-red-400 bg-red-900/20 border border-red-900/40 rounded-md px-3 py-2">
                      {error}
                    </div>
                  )}
                  <button
                    onClick={submit}
                    disabled={sending}
                    className="w-full h-11 rounded-lg font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-transform hover:scale-[1.01]"
                    style={{
                      background: "linear-gradient(135deg, #facc15 0%, #f59e0b 100%)",
                      color: "#0a0c10",
                    }}
                  >
                    <Send size={14} />
                    {sending ? "Enviando…" : "Enviar sugestão"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
