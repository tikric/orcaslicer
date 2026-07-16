import { CourseGroup } from "../courseData";

export const saiaOutGroup: CourseGroup = {
  id: "saia-out",
  label: "Saia (Skirt)",
  items: [
    {
      id: "skirt-enable",
      label: "Habilitar Saia (Skirt)",
      value: "Ativado",
      type: "checkbox",
      content: {
        oQueE: "Imprime uma linha fechada ao redor de todo o modelo, sem encostar nele, antes de iniciar o desenho real da peça.",
        porQueAjustar: "Serve para purgar o bico, remover bolhas de ar e garantir que o fluxo de filamento esteja 100% estabilizado antes de começar a primeira camada crítica da peça.",
        oQueInfluencia: "Purga do bico, verificação visual do nivelamento da mesa e aquecimento uniforme do bico.",
        oQueGera: "Bico perfeitamente limpo e cheio de plástico antes de tocar na peça real.",
        regraDeOuro: "Use sempre ativado com 2 voltas para garantir a limpeza inicial do bico. Desative apenas se estiver usando brim (borda) ou se a peça ocupar toda a área útil da mesa."
      }
    }
  ]
};

export const bordaOutGroup: CourseGroup = {
  id: "borda-out",
  label: "Borda (Brim)",
  items: [
    {
      id: "brim-type",
      label: "Tipo de Borda (Brim)",
      value: "Apenas externa",
      type: "dropdown",
      content: {
        oQueE: "Cria uma aba ou aba achatada conectada diretamente às bordas inferiores da peça para expandir a área de contato com a mesa.",
        porQueAjustar: "É o maior aliado contra o warping (descolamento de cantos). Evita que o encolhimento térmico puxe a peça para cima e estragua toda a impressão.",
        options: [
          { value: "Desativado", uso: "Peças grandes com muita área de base em PLA", resultado: "Fundo limpo sem rebarba" },
          { value: "Apenas externa", uso: "Peças estreitas, cantos vivos e materiais sensíveis (ABS)", resultado: "Adesão reforçada e fácil remoção" },
          { value: "Externa e interna", uso: "Tubos finos verticais ou cilindros", resultado: "Adesão interna e externa máxima" }
        ],
        oQueInfluencia: "Adesão geral à mesa de impressão, prevenção de warping e acabamento dos cantos inferiores.",
        oQueGera: "Ativo: canto grudado na mesa durante toda a impressão, mas exige remoção manual com estilete/rebarbador.",
        regraDeOuro: "Use brim de 5 a 10 mm para ABS/ASA. Para PLA, desative, exceto em peças muito altas e finas."
      }
    }
  ]
};

export const modoEspecialOutGroup: CourseGroup = {
  id: "modo-especial-out",
  label: "Modo Especial (Vase Mode / Sequencial)",
  items: [
    {
      id: "vase-mode",
      label: "Modo Vaso (Spiralize Outer Contour)",
      value: "Desativado",
      type: "checkbox",
      content: {
        oQueE: "Imprime o modelo em uma única linha contínua em formato espiral ascendente constante, sem costuras (seams) e sem retração.",
        porQueAjustar: "Cria peças cilíndricas ou ocas (copos, vasos, luminárias) de forma incrivelmente rápida, sem marcas visíveis na parede e com acabamento visual perfeito.",
        oQueInfluencia: "Velocidade de impressão, impermeabilidade de recipientes e total ausência de costura Z.",
        oQueGera: "Peça vazada com uma única parede perfeita e sem marcas.",
        regraDeOuro: "Ao ativar o Modo Vaso, configure a largura de linha para 150% do diâmetro do bico (ex: linha de 0.6 mm para bico de 0.4 mm) para obter paredes fortes."
      }
    }
  ]
};

export const texturaDifusaOutGroup: CourseGroup = {
  id: "textura-difusa-out",
  label: "Textura Difusa (Fuzzy Skin)",
  items: [
    {
      id: "fuzzy-skin-mode",
      label: "Textura Difusa",
      value: "Desativado",
      type: "dropdown",
      content: {
        oQueE: "Fará com que o bico vibre rapidamente para as laterais enquanto desenha a parede externa, criando uma textura rugosa aleatória na peça.",
        porQueAjustar: "Excelente para esconder totalmente as linhas de camada, dar pegada antiderrapante (grips) e conferir um acabamento fosco profissional que parece injeção de plástico em molde de areia.",
        options: [
          { value: "Desativado", uso: "Peças mecânicas funcionais ou de encaixe liso", resultado: "Paredes lisas convencionais" },
          { value: "Apenas paredes externas", uso: "Cabos de ferramentas, controles e cases estéticos", resultado: "Textura rugosa fosca profissional" }
        ],
        oQueInfluencia: "Aparência estética, ocultação de linhas de camada e aderência ao toque.",
        oQueGera: "Acabamento granulado de alta fricção que esconde imperfeições de impressão.",
        regraDeOuro: "Use espessura de fuzzy de 0.1 mm e ponto de 0.3 mm para um efeito sutil e elegante. Nunca use em roscas ou superfícies de encaixe preciso."
      }
    }
  ]
};

export const opcoesGcodeOutGroup: CourseGroup = {
  id: "opcoes-gcode-out",
  label: "Opções G-code Customizadas",
  items: [
    {
      id: "exclude-object",
      label: "Exclusão de Objetos no G-code",
      value: "Ativado",
      type: "checkbox",
      content: {
        oQueE: "Insere marcações especiais no arquivo G-code que permitem à impressora cancelar um objeto específico da mesa sem interromper a impressão dos outros.",
        porQueAjustar: "Se você estiver imprimindo 10 peças na mesma mesa e uma delas se soltar ou falhar, você pode pará-la pelo painel da impressora (Klipper/Bambu) e salvar as outras 9.",
        oQueInfluencia: "Segurança de impressões em lote e tamanho de arquivo G-code.",
        oQueGera: "Evita perder uma mesa inteira de peças por falha em apenas um objeto.",
        regraDeOuro: "Sempre ativado! É o recurso de segurança número um para produção de peças em larga escala."
      }
    }
  ]
};
