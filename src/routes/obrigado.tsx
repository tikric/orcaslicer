import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Sparkles, Rocket, ShieldCheck, Mail } from "lucide-react";

/** URL de acesso ao curso (área do aluno). */
const ACCESS_URL = "/curso";

export const Route = createFileRoute("/obrigado")({
  head: () => ({
    meta: [
      { title: "Obrigado pela compra — OrcaSlicer Pro" },
      {
        name: "description",
        content:
          "Sua compra foi confirmada. Acesse o curso e aproveite uma oferta exclusiva de upgrade disponível apenas nesta página.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ObrigadoPage,
});

function ObrigadoPage() {
  return (
    <div
      className="min-h-screen w-full overflow-x-hidden text-gray-100"
      style={{
        background:
          "radial-gradient(1200px 600px at 20% -10%, rgba(0,200,150,0.10), transparent 60%), radial-gradient(900px 500px at 90% 100%, rgba(96,165,250,0.10), transparent 60%), #0a0c10",
      }}
    >
      {/* Header */}
      <header className="px-4 sm:px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "#00C89622", border: "1px solid #00C89655" }}
          >
            <Sparkles size={16} style={{ color: "#00C896" }} />
          </div>
          <span className="font-bold tracking-tight">
            OrcaSlicer <span style={{ color: "#00C896" }}>Pro</span>
          </span>
        </div>
        <Link to="/" className="text-xs text-gray-400 hover:text-white">
          Início
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
        {/* Confirmação */}
        <section className="text-center pt-6 sm:pt-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6"
            style={{ background: "#00C89614", color: "#6ee7b7", border: "1px solid #00C89655" }}
          >
            <CheckCircle2 size={12} /> Pagamento confirmado
          </div>

          <h1 className="text-[2rem] sm:text-5xl font-black tracking-tight text-white break-words">
            Bem-vindo ao <span style={{ color: "#00C896" }}>OrcaSlicer Pro</span> 🎉
          </h1>
          <p className="mt-4 text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Sua compra foi confirmada. Enviamos os dados de acesso para o seu email — confira também
            a caixa de <strong className="text-white">spam/promoções</strong>.
          </p>

          <div className="mt-8 flex justify-center">
            <a
              href={ACCESS_URL}
              className="w-full sm:w-auto h-12 px-6 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition"
              style={{ background: "#00C896", color: "#0a0c10" }}
            >
              <Rocket size={16} /> Acessar o curso agora
            </a>
          </div>
        </section>

        {/* Próximos passos */}
        <section className="mt-14 grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: <Mail size={18} />,
              title: "1. Confira seu email",
              text: "Você receberá o link de acesso e o comprovante em minutos.",
            },
            {
              icon: <Rocket size={18} />,
              title: "2. Entre no curso",
              text: "Acesse a área do aluno e comece pelo módulo de qualidade.",
            },
            {
              icon: <ShieldCheck size={18} />,
              title: "3. Garantia de 7 dias",
              text: "Se não gostar, devolvemos 100% do valor. Sem perguntas.",
            },
          ].map((s) => (
            <div
              key={s.title}
              className="p-5 rounded-2xl"
              style={{ background: "#10131a", border: "1px solid #1f2430" }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ background: "#00C89622", color: "#00C896" }}
              >
                {s.icon}
              </div>
              <h3 className="font-bold text-white text-sm">{s.title}</h3>
              <p className="text-gray-400 text-sm mt-1.5">{s.text}</p>
            </div>
          ))}
        </section>

        {/* Suporte */}
        <section className="mt-14 text-center text-sm text-gray-400">
          Dúvidas? Fale com a gente pelo email{" "}
          <a href="mailto:suporte@orcaslicerpro.com" className="text-[#00C896] font-bold">
            suporte@orcaslicerpro.com
          </a>
        </section>
      </main>
    </div>
  );
}
