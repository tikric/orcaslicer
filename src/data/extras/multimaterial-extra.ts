import { CourseGroup } from "../courseData";

export const torrePreparoMMGroup: CourseGroup = {
  id: "torre-preparo-mm",
  label: "Torre de Preparo (Prime Tower)",
  items: [
    {
      id: "mm-enable-prime-tower",
      label: "Habilitar Torre de Preparo",
      value: "Ativado",
      type: "checkbox",
      content: {
        oQueE: "Cria uma estrutura quadrada ao lado da peça (torre) onde o bico limpa e estabiliza a pressão interna após cada troca de filamento.",
        porQueAjustar: "Sem a torre, os primeiros centímetros de extrusão após a troca de cor podem falhar, apresentar cores misturadas (underextrusion/bleeding) ou acumular pressão que estoura a parede externa.",
        oQueInfluencia: "Qualidade de transição de cor, consistência de extrusão após trocas e tempo total de fatiamento/impressão.",
        oQueGera: "Mantém o fluxo perfeito nas paredes externas após trocas de cor.",
        regraDeOuro: "Sempre ativado para trocas de cor no mesmo nível de camada. Desative apenas se estiver usando purga no infill ou lixeira dedicada."
      }
    }
  ]
};

export const filamentoRecursosMMGroup: CourseGroup = {
  id: "filamento-recursos-mm",
  label: "Recursos do Filamento Multimaterial",
  items: [
    {
      id: "mm-no-sparse-layers",
      label: "Pular Camadas Vazias na Torre",
      value: "Ativado",
      type: "checkbox",
      content: {
        oQueE: "Faz com que a impressora imprima a torre de preparo apenas nas camadas que efetivamente têm trocas de filamento.",
        porQueAjustar: "Evita desperdício maciço de filamento, imprimindo a torre somente quando ela é útil para preparar o bico quente.",
        oQueInfluencia: "Consumo de filamento e tempo total da torre.",
        oQueGera: "Economia de material ao não imprimir blocos de torre vazios.",
        regraDeOuro: "Ative sempre para economizar material, a menos que sua impressora tenha problemas de altura na torre."
      }
    }
  ]
};

export const prevencaoVazamentoMMGroup: CourseGroup = {
  id: "prevencao-vazamento-mm",
  label: "Prevenção de Vazamento (Ooze Prevention)",
  items: [
    {
      id: "mm-enable-ooze-prevention",
      label: "Habilitar Prevenção de Vazamento",
      value: "Desativado",
      type: "checkbox",
      content: {
        oQueE: "Reduz a temperatura do hotend em standby durante trocas longas para evitar que o plástico parado escorra por gravidade.",
        porQueAjustar: "Evita 'cabelos' ou fiapos pretos misturando nas partes brancas da peça devido a plástico que escorreu do bico inativo.",
        oQueInfluencia: "Limpeza de cores claras e tempo de ciclo (espera aquecimento/resfriamento).",
        oQueGera: "Ativo: cores sem contaminação, mas adiciona de 10 a 25 segundos por troca.",
        regraDeOuro: "Mantenha desativado se estiver usando torre de preparo moderna com limpador mecânico (wiper). Ative para trocas extremamente lentas sem AMS."
      }
    }
  ]
};

export const opcoesPurgaMMGroup: CourseGroup = {
  id: "opcoes-purga-mm",
  label: "Opções de Purga (Flushing)",
  items: [
    {
      id: "mm-purge-into-infill",
      label: "Purgar no Preenchimento (Infill)",
      value: "Desativado",
      type: "checkbox",
      content: {
        oQueE: "Direciona o plástico residual da transição de cor para dentro do preenchimento da peça, em vez de jogá-lo na lixeira ou na torre.",
        porQueAjustar: "Economiza filamento e tempo de impressão ao usar a transição de cor como material de estrutura interna invisível.",
        oQueInfluencia: "Economia de material e peso do descarte.",
        oQueGera: "Reduz o tamanho do 'totó' (descarte de purga) gerado atrás da máquina.",
        regraDeOuro: "Ative sempre, exceto quando estiver imprimindo com paredes externas translúcidas ou brancas onde a cor escura interna possa 'vazar' visualmente."
      }
    }
  ]
};

export const avancadoMMGroup: CourseGroup = {
  id: "avancado-mm",
  label: "Multimaterial — Avançado",
  items: [
    {
      id: "mm-beam-interlocking",
      label: "Intertravamento de Filamento (Interlocking)",
      value: "Desativado",
      type: "checkbox",
      content: {
        oQueE: "Recurso revolucionário que mescla as bordas de dois filamentos diferentes com dentes mecânicos microscópicos tridimensionais (como peças de quebra-cabeça).",
        porQueAjustar: "Permite colar materiais incompatíveis (como PLA e TPU) criando peças híbridas flexíveis/rígidas que não descolam na emenda mecânica.",
        oQueInfluencia: "Resistência de juntas multimaterial e adesão entre polímeros diferentes.",
        oQueGera: "Peças multimaterial inseparáveis mesmo sob alta torção mecânica.",
        regraDeOuro: "Ative somente ao misturar filamentos incompatíveis que precisam resistir a esforços físicos intensos."
      }
    }
  ]
};
