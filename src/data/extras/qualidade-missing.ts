import { CourseItem } from "../courseData";

export const elephantFootExtraItems: CourseItem[] = [
  {
    id: "qual-elephant-foot-radius",
    label: "Raio de encolhimento do pé de elefante",
    value: "0.15 mm",
    type: "number",
    content: {
      oQueE: "Especifica o raio de compensação aplicado às primeiras camadas para contrabalançar a expansão do plástico gerada pelo peso da peça e o calor da mesa.",
      porQueAjustar: "Ajustar este valor evita que a base da peça fique mais larga que o restante do corpo (efeito pé de elefante), o que é crítico para peças mecânicas funcionais que exigem encaixe preciso na base.",
      options: [
        { value: "0.05 mm", uso: "Impressão de alta resolução e mesa fria", resultado: "Ajuste fino sutil" },
        { value: "0.15 mm", uso: "Uso geral, filamento PLA ou PETG em mesa de 60°C", resultado: "Compensação equilibrada" },
        { value: "0.30 mm", uso: "Peças de engenharia pesadas com grande área de base", resultado: "Correção forte" }
      ],
      oQueInfluencia: "Adesão da primeira camada, precisão dimensional do pé da peça e aparência estética da base.",
      oQueGera: "Valor alto demais: a base da peça encolhe em excesso e pode perder adesão. Valor baixo demais: o pé de elefante continua visível.",
      regraDeOuro: "Use 0.15 mm como valor inicial. Se a base ainda estiver larga, aumente de 0.05 em 0.05 mm.",
      comoConfigurar: "Processo -> Qualidade -> Precisão -> Compensação de pé de elefante."
    }
  }
];

export const paredesSuperficiesMissingItems: CourseItem[] = [
  {
    id: "qual-precise-z",
    label: "Precisão do Eixo Z",
    value: "Ativado",
    type: "checkbox",
    content: {
      oQueE: "Ajuste dinâmico que recalcula as coordenadas Z de cada camada para se adequarem às tolerâncias mais estritas, reduzindo o efeito de 'camadas fantasmas' (ghosting vertical).",
      porQueAjustar: "Garante que a altura total do modelo e das camadas individuais seja perfeitamente fiel ao arquivo CAD original.",
      oQueInfluencia: "Precisão de encaixe vertical e estabilidade mecânica das camadas.",
      oQueGera: "Camadas lisas e sem variações de relevo microscópicas.",
      regraDeOuro: "Mantenha sempre ativado ao imprimir peças técnicas ou mecânicas montáveis."
    }
  }
];

export const ponteMissingItems: CourseItem[] = [
  {
    id: "qual-bridge-flow",
    label: "Fluxo de ponte",
    value: "0.95",
    type: "number",
    content: {
      oQueE: "Fator multiplicador do fluxo de extrusão usado especificamente durante a criação de pontes (bridges) no ar.",
      porQueAjustar: "Controla a tensão e o diâmetro do filamento enquanto ele está sendo esticado entre dois suportes para evitar que o fio se rompa ou caia (sagging).",
      options: [
        { value: "0.85", uso: "Materiais que tendem a escorrer muito, como PETG", resultado: "Filamentos mais finos e esticados" },
        { value: "0.95", uso: "PLA padrão em alta velocidade", resultado: "Pontes estáveis e sem barriga" },
        { value: "1.00", uso: "Materiais flexíveis (TPU)", resultado: "Fluxo original sem estiramento" }
      ],
      oQueInfluencia: "Qualidade estética da parte inferior das pontes e ausência de filamentos pendurados.",
      oQueGera: "Baixo demais: o filamento estica tanto que se rompe. Alto demais: a ponte fica pesada e deforma para baixo.",
      regraDeOuro: "Use 0.95 para PLA e 0.90 para PETG."
    }
  },
  {
    id: "qual-detect-overhangs",
    label: "Detecção automática de saliências",
    value: "Ativado",
    type: "checkbox",
    content: {
      oQueE: "Identifica inclinações agressivas e saliências no modelo 3D para aplicar regras especiais de fluxo e velocidade automáticas.",
      porQueAjustar: "Evita que saliências sem suporte caiam ou criem rebarbas por falta de resfriamento ou excesso de material.",
      oQueInfluencia: "Acabamento de overhangs e redução da necessidade de suportes manuais.",
      oQueGera: "Zonas inclinadas limpas e com excelente transição visual.",
      regraDeOuro: "Mantenha sempre ativado para maximizar a capacidade da impressora de imprimir sem suportes."
    }
  },
  {
    id: "qual-extra-overhang",
    label: "Fluxo de Saliência Extra",
    value: "0.85",
    type: "number",
    content: {
      oQueE: "Redução específica de fluxo de filamento quando a impressora está depositando plástico em cantos flutuantes ou saliências acentuadas.",
      porQueAjustar: "Plástico extra em balanço tende a acumular calor e deformar para cima, batendo no bico e estragando a impressão.",
      oQueInfluencia: "Qualidade de ângulos extremos e estabilidade da impressão de saliências.",
      oQueGera: "Menos material acumulado nas bordas inclinadas.",
      regraDeOuro: "Use entre 0.80 e 0.90 para evitar rebarbas levantadas."
    }
  }
];

export const salienciasMissingItems: CourseItem[] = [
  {
    id: "qual-slice-gap",
    label: "Tolerância de vãos de fatiamento",
    value: "0.05 mm",
    type: "number",
    content: {
      oQueE: "Zera o fatiamento de vãos menores do que o valor determinado para evitar geração de caminhos de bico inúteis e barulhentos em espaços vazios microscópicos.",
      porQueAjustar: "Melhora a velocidade de fatiamento e elimina trepidações desnecessárias da impressora ao tentar preencher micro-vãos.",
      oQueInfluencia: "Estabilidade do percurso do bico e consistência interna das paredes.",
      oQueGera: "Trajetórias de bico mais contínuas e fluidas.",
      regraDeOuro: "Mantenha em 0.05 mm."
    }
  }
];
