import { CourseGroup } from "../courseData";

export const suporteBasicoGroup: CourseGroup = {
  id: "suporte-basico",
  label: "Suporte — Básico",
  items: [
    {
      id: "support-type",
      label: "Tipo de Suporte",
      value: "Normal",
      type: "dropdown",
      content: {
        oQueE: "Define o estilo estrutural do suporte: Normal (grades verticais tradicionais) ou Árvore (Tree - galhos orgânicos).",
        porQueAjustar: "Suportes normais são ótimos para bases planas grandes. Suportes em árvore economizam muito material, são mais fáceis de remover e deixam menos marcas em superfícies orgânicas ou detalhadas.",
        options: [
          { value: "Normal", uso: "Peças geométricas simples e grandes áreas planas", resultado: "Suporte rígido e uniforme" },
          { value: "Árvore (Slim)", uso: "Miniaturas, estátuas e peças com muitos detalhes flutuantes", resultado: "Remoção extremamente fácil, poucas marcas" }
        ],
        oQueInfluencia: "Facilidade de remoção, tempo de impressão, economia de filamento e acabamento da superfície apoiada.",
        oQueGera: "Árvore: menos lixo e maior velocidade. Normal: mais firmeza mecânica.",
        regraDeOuro: "Use suporte em árvore (Tree) para estátuas e peças complexas; use normal para peças industriais planas."
      }
    }
  ]
};

export const jangadaSupGroup: CourseGroup = {
  id: "jangada-sup",
  label: "Jangada (Raft)",
  items: [
    {
      id: "raft-layers",
      label: "Camadas de Jangada",
      value: "0 (Nenhuma)",
      type: "dropdown",
      content: {
        oQueE: "Cria uma base espessa de plástico (jangada ou raft) abaixo da peça original para garantir aderência absoluta na mesa.",
        porQueAjustar: "Evita que peças com bases minúsculas descolem da mesa durante impressões longas, mas consome bastante material e cria marcas na base da peça.",
        options: [
          { value: "0", uso: "Uso geral com mesa bem nivelada e limpa", resultado: "Base da peça lisa e sem desperdício" },
          { value: "2 camadas", uso: "Peças altas com base estreita ou mesa irregular", resultado: "Aderência mecânica reforçada" }
        ],
        oQueInfluencia: "Adesão à mesa, acabamento da parte inferior da peça e consumo de filamento.",
        oQueGera: "Jangada ativa: elimina warping, mas exige lixamento posterior da base.",
        regraDeOuro: "Mantenha em 0. Só use raft se a peça for extremamente instável e o brim (borda) não for suficiente."
      }
    }
  ]
};

export const filamentoSuporteSupGroup: CourseGroup = {
  id: "filamento-suporte-sup",
  label: "Filamento de Suporte",
  items: [
    {
      id: "support-material",
      label: "Material do Suporte",
      value: "Mesmo filamento",
      type: "dropdown",
      content: {
        oQueE: "Define qual filamento usar para o corpo do suporte e para a interface de suporte (a camada que toca na peça).",
        porQueAjustar: "Impressoras com multimaterial (como AMS ou MMU) podem usar materiais solúveis (PVA) ou materiais de interface fáceis de destacar (como PETG como interface para PLA), gerando superfícies inferiores perfeitas.",
        options: [
          { value: "Mesmo filamento", uso: "Impressão mono-extrusora", resultado: "Suporte convencional econômico" },
          { value: "Interface dedicada", uso: "PLA com interface de PETG ou PVA", resultado: "Acabamento de teto perfeito e remoção sem esforço" }
        ],
        oQueInfluencia: "Qualidade do acabamento do teto de suporte, facilidade de destaque e tempo de troca de filamento.",
        oQueGera: "Interface solúvel: permite overhangs horizontais perfeitos a 0 mm de distância.",
        regraDeOuro: "Para PLA, se tiver AMS/multimaterial, use PETG apenas nas camadas de interface de suporte para remoção mágica."
      }
    }
  ]
};

export const alisamentoSuporteSupGroup: CourseGroup = {
  id: "alisamento-suporte-sup",
  label: "Alisamento da Interface de Suporte",
  items: [
    {
      id: "support-interface-pattern",
      label: "Padrão de Interface",
      value: "Retilíneo",
      type: "dropdown",
      content: {
        oQueE: "Padrão geométrico das camadas densas de interface que ficam entre o suporte e a peça original.",
        porQueAjustar: "Garante que o teto do suporte seja denso e liso, agindo como uma mesa provisória para o filamento que será depositado acima.",
        options: [
          { value: "Retilíneo", uso: "Suportes normais e remoção fácil", resultado: "Superfície reta estável" },
          { value: "Círculos Concentricos", uso: "Modelos redondos ou orgânicos", resultado: "Suporte perfeito para esferas" }
        ],
        oQueInfluencia: "Qualidade de superfícies horizontais flutuantes e esforço de remoção.",
        oQueGera: "Interface densa: superfícies inferiores muito mais limpas.",
        regraDeOuro: "Mantenha em Retilíneo para a maioria das aplicações."
      }
    }
  ]
};

export const suporteAvancadoGroup: CourseGroup = {
  id: "suporte-avancado",
  label: "Suporte — Avançado",
  items: [
    {
      id: "support-z-distance",
      label: "Distância Z do Suporte",
      value: "0.2 mm",
      type: "number",
      content: {
        oQueE: "Distância vertical entre o teto do suporte e a primeira camada real da peça.",
        porQueAjustar: "É o parâmetro mais crítico dos suportes. Perto demais funde o suporte na peça; longe demais faz a base da peça cair no vazio, saindo feia e descabelada.",
        options: [
          { value: "0.1 mm", uso: "Impressões com alta ventilação de resfriamento", resultado: "Apoio preciso mas difícil remoção" },
          { value: "0.2 mm", uso: "Uso geral para PLA standard", resultado: "Remoção equilibrada e acabamento aceitável" },
          { value: "0.25 mm", uso: "Filamentos que colam muito entre si (PETG)", resultado: "Destaque fácil garantido" }
        ],
        oQueInfluencia: "Facilidade de destaque e acabamento visual do fundo das pontes/overhangs.",
        oQueGera: "Ajuste correto: suporte sai inteiro com as mãos deixando marcas mínimas.",
        regraDeOuro: "Sempre use distância Z múltipla da altura de camada. Para camada de 0.2 mm, use Z-distance de 0.2 mm."
      }
    }
  ]
};
