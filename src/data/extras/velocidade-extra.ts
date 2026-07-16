import { CourseGroup } from "../courseData";

export const primeiraCamadaVelGroup: CourseGroup = {
  id: "primeira-camada-vel",
  label: "Velocidade da primeira camada",
  items: [
    {
      id: "first-layer-speed",
      label: "Primeira camada",
      value: "50 mm/s",
      type: "number",
      content: {
        oQueE:
          "Define a velocidade com que o bico se move ao imprimir a primeira camada da peça. É uma das configurações mais críticas: a primeira camada é a base de toda a impressão — se falhar, toda a peça falha. Analogia: é a fundação de uma casa — precisa ser feita com calma; uma fundação rápida e mal feita compromete toda a construção.",
        porQueAjustar:
          "Velocidade lenta garante adesão e precisão. A primeira camada deve ser 50–70% mais lenta que as outras camadas: se a normal é 200 mm/s (como neste perfil), a primeira fica em torno de 50 mm/s. Essa redução compensa irregularidades da mesa e dá tempo do plástico 'esmagar' contra a superfície.",
        options: [
          {
            value: "10–15 mm/s",
            uso: "Mesas irregulares, materiais difíceis",
            resultado: "Muito lenta",
          },
          { value: "20–30 mm/s", uso: "Uso geral, boa adesão", resultado: "Lenta e segura" },
          {
            value: "50 mm/s — PADRÃO DA TELA",
            uso: "Perfil rápido, mesa bem calibrada",
            resultado: "Equilíbrio adesão/tempo",
          },
          { value: "60+ mm/s", uso: "Não recomendado", resultado: "Risco de falha na adesão" },
        ],
        oQueInfluencia:
          "Tipo de superfície da mesa (PEI lisa 30–40, vidro 20–30), material (PLA 30–50, PETG 20–30, ABS 15–25, TPU 15–20), tamanho da peça e nivelamento da mesa.",
        oQueGera:
          "Velocidade lenta = adesão excelente e linha uniforme. Adesão é inversamente proporcional à velocidade; lenta dá tempo do plástico esmagar e selar contra a mesa.",
        regraDeOuro:
          "Primeira camada lenta = sucesso garantido. Reduza para 20–30 mm/s em casos de adesão difícil; mantenha 50 mm/s apenas em mesas bem niveladas.",
        comoConfigurar: "Processo → Velocidade → Velocidade da primeira camada → Primeira camada.",
      },
    },
    {
      id: "first-layer-infill-speed",
      label: "Preenchimento da primeira camada",
      value: "100 mm/s",
      type: "number",
      content: {
        oQueE:
          "Define a velocidade do infill (preenchimento) na primeira camada. Geralmente é mais rápido que a parede da primeira camada, pois por ser interno não precisa do mesmo cuidado estético.",
        porQueAjustar:
          "O infill da primeira camada não é visível, então pode ir mais rápido — mas ainda precisa aderir bem à mesa. Regra prática: 1,5–2× a velocidade da parede da primeira camada.",
        options: [
          {
            value: "40–60 mm/s",
            uso: "Materiais difíceis, mesas irregulares",
            resultado: "Lenta e segura",
          },
          {
            value: "100 mm/s — PADRÃO DA TELA",
            uso: "Uso geral, mesa bem calibrada",
            resultado: "Velocidade equilibrada",
          },
          { value: "120+ mm/s", uso: "Mesas perfeitas", resultado: "Rápida" },
        ],
        oQueInfluencia:
          "Adesão do infill da primeira camada, tempo total da camada inicial e qualidade da base interna.",
        oQueGera:
          "Infill da base bem aderido e firme, servindo como apoio estável para as camadas seguintes.",
        regraDeOuro: "1,5–2× a velocidade da parede da primeira camada.",
        comoConfigurar:
          "Processo → Velocidade → Velocidade da primeira camada → Preenchimento da primeira camada.",
      },
    },
    {
      id: "first-layer-travel-speed",
      label: "Velocidade de deslocamento da primeira camada",
      value: "100%",
      type: "percent",
      content: {
        oQueE:
          "Define a velocidade dos movimentos aéreos (travel) durante a primeira camada, em porcentagem da velocidade de deslocamento padrão. Como a primeira camada ainda está mole, deslocamentos rápidos podem arrastar plástico ou derrubar partes recém-impressas.",
        porQueAjustar:
          "Travel alto na primeira camada cria marcas, arranca linhas e pode descolar trechos recém-depositados. Manter próximo de 100% (equivalente a 50–80 mm/s na prática) evita esses problemas.",
        options: [
          {
            value: "50–80 mm/s (≈50–80%)",
            uso: "Uso geral, mesas sensíveis",
            resultado: "Seguro, sem marcas",
          },
          {
            value: "100% — PADRÃO DA TELA",
            uso: "Perfil equilibrado",
            resultado: "Bom compromisso",
          },
          { value: "120%+", uso: "Peças pequenas, mesas ótimas", resultado: "Risco de marcas" },
        ],
        oQueInfluencia:
          "Marcas na primeira camada, risco de arrancar trechos recém-impressos e tempo total da camada inicial.",
        oQueGera: "Travel moderado gera primeira camada limpa, sem marcas de deslocamento.",
        regraDeOuro:
          "Mantenha o deslocamento da primeira camada moderado — evite ultrapassar 100–120 mm/s reais.",
        comoConfigurar:
          "Processo → Velocidade → Velocidade da primeira camada → Velocidade de deslocamento da primeira camada.",
      },
    },
    {
      id: "initial-layer-slow-count",
      label: "Número de camadas lentas",
      value: "1 camadas",
      type: "number",
      content: {
        oQueE:
          "Define quantas camadas iniciais são impressas na velocidade reduzida da primeira camada antes de acelerar para a velocidade normal das outras camadas.",
        porQueAjustar:
          "A transição gradual melhora a adesão, evita mudanças bruscas de velocidade e reduz o risco de warping — fundamental em materiais que contraem muito (ABS, ASA, Nylon).",
        options: [
          { value: "1 — PADRÃO", uso: "PLA, uso geral", resultado: "Transição padrão" },
          { value: "2–3", uso: "Peças grandes, ABS", resultado: "Transição suave" },
          { value: "4–5", uso: "Materiais que contraem muito", resultado: "Transição muito suave" },
        ],
        oQueInfluencia: "Risco de warping, qualidade das primeiras camadas e tempo total inicial.",
        oQueGera:
          "Mais camadas lentas geram uma base mais firme e menos warping em materiais difíceis.",
        regraDeOuro: "1 camada para PLA. 2–3 para ABS. A transição gradual reduz o warping.",
        comoConfigurar:
          "Processo → Velocidade → Velocidade da primeira camada → Número de camadas lentas.",
      },
    },
  ],
};

export const outrasCamadasVelGroup: CourseGroup = {
  id: "outras-camadas-vel",
  label: "Velocidade de outras camadas",
  items: [
    {
      id: "outer-wall-speed",
      label: "Parede externa",
      value: "200 mm/s",
      type: "number",
      content: {
        oQueE:
          "Velocidade de impressão das paredes externas — a superfície visível da peça. É o parâmetro que mais afeta a qualidade estética da impressão. Analogia: é como pintar um quadro — pintar rápido deixa a tinta irregular; pintar devagar dá acabamento perfeito.",
        porQueAjustar:
          "Velocidades altas causam vibrações que aparecem como ghosting/ringing (marcas onduladas) na superfície. Este perfil usa 200 mm/s — típico de impressoras rápidas (Bambu Lab, Voron) com Input Shaping calibrado, que tolera velocidades muito maiores que impressoras convencionais.",
        options: [
          {
            value: "30–50 mm/s",
            uso: "Alta qualidade visual, impressoras sem IS",
            resultado: "Superfície muito lisa",
          },
          {
            value: "50–80 mm/s",
            uso: "Uso geral em impressoras convencionais",
            resultado: "Boa qualidade",
          },
          {
            value: "150–200 mm/s — PADRÃO DA TELA",
            uso: "Impressoras CoreXY rápidas com Input Shaping",
            resultado: "Qualidade boa em alta velocidade",
          },
          {
            value: ">220 mm/s",
            uso: "Protótipos, sem requisito visual",
            resultado: "Risco de ghosting",
          },
        ],
        oQueInfluencia:
          "Material, aceleração (baixa permite mais velocidade útil; alta exige menos), temperatura e altura da camada.",
        oQueGera:
          "Em máquinas sem Input Shaping, 200 mm/s geraria ghosting severo. Com IS calibrado, a parede fica lisa mesmo nessa velocidade.",
        regraDeOuro:
          "Só use velocidades de parede externa acima de 150 mm/s se a impressora tiver Input Shaping calibrado e estrutura rígida (CoreXY).",
        comoConfigurar: "Processo → Velocidade → Velocidade de outras camadas → Parede externa.",
      },
    },
    {
      id: "inner-wall-speed",
      label: "Parede interna",
      value: "300 mm/s",
      type: "number",
      content: {
        oQueE:
          "Velocidade das paredes internas — estruturais e não visíveis externamente. Como ficam atrás da parede externa, não precisam de acabamento estético perfeito, apenas resistência e boa coesão.",
        porQueAjustar:
          "Pode ir muito mais rápido que a externa porque não é visível. Regra prática: 1,5–2× a velocidade da parede externa. Neste perfil, 300 mm/s é 1,5× os 200 mm/s da externa.",
        options: [
          {
            value: "80–120 mm/s",
            uso: "Eficiência em impressoras convencionais",
            resultado: "Rápida",
          },
          { value: "150–250 mm/s", uso: "Impressoras médias/rápidas", resultado: "Muito rápida" },
          {
            value: "300 mm/s — PADRÃO DA TELA",
            uso: "Impressoras rápidas com IS",
            resultado: "Extrema, sem custo visual",
          },
        ],
        oQueInfluencia:
          "Tempo total de impressão, coesão entre paredes internas e externas e capacidade do hotend.",
        oQueGera:
          "Tempo total reduzido sem comprometer a qualidade visível. Limite prático: fluxo máximo do hotend (mm³/s) — hotend padrão ~12 mm³/s, hotend de alto fluxo (Bambu, Rapido, Dragon HF) ~25–35 mm³/s. Fluxo = velocidade × altura da camada × largura da linha.",
        regraDeOuro:
          "1,5–2× a velocidade da parede externa, respeitando o teto de fluxo do hotend. Rode o teste Max Volumetric Speed do OrcaSlicer para descobrir seu limite real.",
        comoConfigurar: "Processo → Velocidade → Velocidade de outras camadas → Parede interna.",
      },
    },
    {
      id: "small-perimeter-speed",
      label: "Pequenos perímetros",
      value: "50%",
      type: "percent",
      content: {
        oQueE:
          "Define uma velocidade reduzida (como porcentagem da velocidade normal) para áreas pequenas — detalhes finos, pontas, recortes pequenos. Áreas pequenas exigem mais precisão; reduzir a velocidade evita 'blobs' e perda de definição.",
        porQueAjustar:
          "Em detalhes finos, a velocidade normal é alta demais para o material esfriar entre passes próximos, gerando blobs. Reduzir para 50% compensa esse efeito.",
        options: [
          {
            value: "50% — PADRÃO DA TELA",
            uso: "Detalhes muito finos",
            resultado: "Metade da velocidade normal",
          },
          { value: "75%", uso: "Uso geral", resultado: "Redução moderada" },
          { value: "100%", uso: "Peças sem detalhes finos", resultado: "Velocidade normal" },
        ],
        oQueInfluencia:
          "Definição de detalhes finos, presença de blobs e qualidade em pontas e recortes.",
        oQueGera: "Detalhes pequenos com definição preservada, sem blobs.",
        regraDeOuro: "50% é o sweet spot para detalhes finos.",
        comoConfigurar:
          "Processo → Velocidade → Velocidade de outras camadas → Pequenos perímetros.",
      },
    },
    {
      id: "small-perimeter-threshold",
      label: "Limiar de pequenos perímetros",
      value: "0 mm",
      type: "number",
      content: {
        oQueE:
          "Define o tamanho máximo (em mm) de uma área para ser considerada 'pequena' e receber a velocidade reduzida configurada acima. Acima desse limiar, mesmo perímetros curtos usam velocidade normal.",
        porQueAjustar:
          "Aumentar o valor faz mais áreas se beneficiarem da velocidade reduzida; deixar em 0 mm (padrão desta tela) mantém a velocidade normal na maioria dos perímetros, exceto os classificados internamente como muito pequenos.",
        options: [
          {
            value: "0 mm — PADRÃO DA TELA",
            uso: "Comportamento padrão do slicer",
            resultado: "Poucas áreas afetadas",
          },
          {
            value: "5–10 mm",
            uso: "Peças com muitos detalhes finos",
            resultado: "Mais áreas com velocidade reduzida",
          },
        ],
        oQueInfluencia:
          "Quais perímetros recebem velocidade reduzida, qualidade em detalhes e tempo total.",
        oQueGera: "Definição preservada em áreas curtas quando ajustado para 5–10 mm.",
        regraDeOuro: "5–10 mm para peças com muitos detalhes finos; 0 mm para uso geral.",
        comoConfigurar:
          "Processo → Velocidade → Velocidade de outras camadas → Limiar de pequenos perímetros.",
      },
    },
    {
      id: "infill-speed",
      label: "Preenchimento esparso",
      value: "300 mm/s",
      type: "number",
      content: {
        oQueE:
          "Velocidade do infill esparso (padrão interno). Por ser completamente invisível, pode usar a velocidade máxima da impressora sem impacto visual. É onde se ganha mais tempo.",
        porQueAjustar:
          "O infill representa 30–60% do tempo total de impressão. Maximizar a velocidade aqui é o ganho mais eficiente sem sacrificar qualidade. Regra prática: 1,5× a velocidade da parede interna.",
        options: [
          {
            value: "100–150 mm/s",
            uso: "Velocidade moderada, impressoras convencionais",
            resultado: "Mais conservador",
          },
          { value: "150–250 mm/s", uso: "Uso geral", resultado: "Bom equilíbrio" },
          {
            value: "300 mm/s — PADRÃO DA TELA",
            uso: "Impressoras rápidas (Bambu, Voron)",
            resultado: "Velocidade máxima",
          },
        ],
        oQueInfluencia:
          "Tempo total de impressão (impacto enorme), qualidade interna e estabilidade do fluxo.",
        oQueGera:
          "Infill rápido = impressão muito mais curta. Não afeta qualidade visual se as paredes estiverem mais lentas. Se aparecerem gaps/underextrusion no infill, o gargalo é fluxo volumétrico do hotend, não velocidade em si.",
        regraDeOuro:
          "Use a velocidade máxima confortável da impressora para o infill, limitada pelo Max Volumetric Speed do filamento (PLA típico 15–25 mm³/s, PETG 10–18, ABS 12–20, TPU 4–8).",
        comoConfigurar:
          "Processo → Velocidade → Velocidade de outras camadas → Preenchimento esparso.",
      },
    },
    {
      id: "solid-infill-speed",
      label: "Preenchimento sólido",
      value: "250 mm/s",
      type: "number",
      content: {
        oQueE:
          "Velocidade do infill denso (100%) que conecta o infill esparso às paredes — a 'cola' estrutural entre regiões. Precisa de boa adesão para garantir transferência de carga entre infill e paredes.",
        porQueAjustar:
          "Sólido demais rápido gera adesão fraca entre regiões. Deve ser um pouco mais lento que o infill esparso, mas ainda rápido, pois também é invisível.",
        options: [
          {
            value: "100–150 mm/s",
            uso: "Uso geral em impressoras convencionais",
            resultado: "Moderada",
          },
          { value: "150–200 mm/s", uso: "Impressoras rápidas", resultado: "Rápida" },
          {
            value: "250 mm/s — PADRÃO DA TELA",
            uso: "Impressoras rápidas com IS",
            resultado: "Muito rápida, seguro por não ser visível",
          },
        ],
        oQueInfluencia: "Adesão entre infill e paredes e resistência mecânica da peça.",
        oQueGera: "Conexão firme entre regiões internas e paredes externas.",
        regraDeOuro: "Mantenha entre a velocidade da parede interna e a do infill esparso.",
        comoConfigurar:
          "Processo → Velocidade → Velocidade de outras camadas → Preenchimento sólido.",
      },
    },
    {
      id: "top-surface-speed",
      label: "Superfície superior",
      value: "200 mm/s",
      type: "number",
      content: {
        oQueE:
          "Velocidade da última camada superior — a face de topo visível da peça. Como é uma superfície estética crítica, exige velocidade reduzida (em relação ao infill) para acabamento liso. Pode ser combinada com Alisamento (Ironing).",
        porQueAjustar:
          "Velocidade alta no topo deixa textura visível, linhas tortas e cantos mal fechados. Deve ficar próxima da velocidade da parede externa, já que ambas são visíveis.",
        options: [
          {
            value: "30–50 mm/s",
            uso: "Máxima qualidade em impressoras convencionais",
            resultado: "Superfície lisa",
          },
          { value: "50–80 mm/s", uso: "Uso geral", resultado: "Equilíbrio" },
          {
            value: "200 mm/s — PADRÃO DA TELA",
            uso: "Impressoras rápidas com IS, mesma faixa da parede externa",
            resultado: "Rápido sem perder acabamento",
          },
        ],
        oQueInfluencia:
          "Acabamento da face superior, eficácia do Alisamento (Ironing) e presença de pinholes.",
        oQueGera: "Topo liso e uniforme, especialmente com Alisamento ativo.",
        regraDeOuro:
          "Trate a superfície superior como a parede externa: mantenha as duas na mesma faixa de velocidade.",
        comoConfigurar:
          "Processo → Velocidade → Velocidade de outras camadas → Superfície superior.",
      },
    },
    {
      id: "gap-fill-speed",
      label: "Preenchimento de vão",
      value: "250 mm/s",
      type: "number",
      content: {
        oQueE:
          "Velocidade das linhas que preenchem vãos pequenos entre paredes (gap fill) — usadas quando a geometria deixa espaços que não cabem uma linha inteira mas precisam ser preenchidos.",
        porQueAjustar:
          "O gap fill geralmente é feito de linhas curtas e irregulares — velocidade muito alta gera blobs e cantos sujos. Mantenha próximo à velocidade do preenchimento sólido.",
        options: [
          {
            value: "100–150 mm/s",
            uso: "Uso geral em impressoras convencionais",
            resultado: "Moderada",
          },
          {
            value: "150–250 mm/s — PADRÃO DA TELA",
            uso: "Impressoras rápidas",
            resultado: "Rápida, alinhada ao sólido",
          },
        ],
        oQueInfluencia:
          "Qualidade visual em transições parede-vão e presença de blobs em geometrias finas.",
        oQueGera: "Vãos preenchidos com firmeza, sem blobs.",
        regraDeOuro: "Mantenha próximo à velocidade do preenchimento sólido.",
        comoConfigurar:
          "Processo → Velocidade → Velocidade de outras camadas → Preenchimento de vão.",
      },
    },
    {
      id: "support-speed",
      label: "Suporte",
      value: "150 mm/s",
      type: "number",
      content: {
        oQueE:
          "Velocidade das estruturas de suporte. Como suportes são descartáveis e não fazem parte da peça final, podem ser impressos rápido — a qualidade visual do suporte não importa.",
        porQueAjustar:
          "Ganho de tempo direto. O único limite é não derrubar a estrutura por vibração excessiva causada por velocidade alta demais.",
        options: [
          { value: "80–150 mm/s — PADRÃO DA TELA", uso: "Uso geral", resultado: "Rápida" },
          {
            value: "150–200 mm/s",
            uso: "Impressoras rápidas e rígidas",
            resultado: "Muito rápida",
          },
        ],
        oQueInfluencia: "Tempo total de impressão e estabilidade do suporte durante a impressão.",
        oQueGera: "Suportes rápidos sem comprometer a estabilidade da peça.",
        regraDeOuro: "Rápido — suporte vai para o lixo depois.",
        comoConfigurar: "Processo → Velocidade → Velocidade de outras camadas → Suporte.",
      },
    },
    {
      id: "support-interface-speed",
      label: "Interface de suporte",
      value: "80 mm/s",
      type: "number",
      content: {
        oQueE:
          "Velocidade da camada de interface do suporte — a parte que toca diretamente a face inferior da peça. Define a qualidade da superfície suportada e a facilidade de remoção.",
        porQueAjustar:
          "Velocidade lenta na interface resulta em face inferior lisa e suporte que solta limpo. Velocidade alta deixa a face áspera e o suporte fundido à peça.",
        options: [
          {
            value: "30–50 mm/s",
            uso: "Máxima qualidade da face suportada",
            resultado: "Interface limpa",
          },
          { value: "80 mm/s — PADRÃO DA TELA", uso: "Uso geral", resultado: "Equilíbrio" },
          { value: "80–120 mm/s", uso: "Prioridade em velocidade", resultado: "Rápida" },
        ],
        oQueInfluencia: "Acabamento da face suportada e facilidade de remoção do suporte.",
        oQueGera: "Face inferior da peça lisa e suporte que solta com puxão limpo.",
        regraDeOuro: "Trate como parede externa — lenta = face suportada bonita.",
        comoConfigurar:
          "Processo → Velocidade → Velocidade de outras camadas → Interface de suporte.",
      },
    },
    {
      id: "ironing-speed",
      label: "Velocidade do alisamento",
      value: "30 mm/s",
      type: "number",
      content: {
        oQueE:
          "Velocidade do passe de Alisamento (Ironing) — o movimento extra que 're-derrete' a superfície superior para deixá-la espelhada. É intencionalmente muito mais lento que qualquer outra velocidade da tela.",
        porQueAjustar:
          "O alisamento precisa de tempo para o bico 'passar a ferro' sobre a camada já depositada, redistribuindo o plástico excedente. Velocidade alta anula o efeito e deixa listras visíveis.",
        options: [
          {
            value: "10–20 mm/s",
            uso: "Máximo brilho, peças pequenas",
            resultado: "Acabamento espelhado",
          },
          {
            value: "30 mm/s — PADRÃO DA TELA",
            uso: "Uso geral",
            resultado: "Bom equilíbrio brilho/tempo",
          },
          { value: "40+ mm/s", uso: "Peças grandes, menos crítico", resultado: "Menos brilho" },
        ],
        oQueInfluencia:
          "Brilho e planicidade da superfície superior, tempo extra de impressão e risco de pinholes.",
        oQueGera:
          "Alisamento lento gera topo espelhado e uniforme; rápido demais deixa listras visíveis.",
        regraDeOuro:
          "Mantenha o alisamento sempre bem mais lento que a superfície superior — 20–30 mm/s é o padrão.",
        comoConfigurar:
          "Processo → Velocidade → Velocidade de outras camadas → Velocidade do alisamento.",
      },
    },
  ],
};

export const saliaciasVelGroup: CourseGroup = {
  id: "saliencias-vel",
  label: "Velocidade em saliências",
  items: [
    {
      id: "slow-down-overhangs-vel",
      label: "Reduzir velocidade em saliências",
      value: "Ativado",
      type: "checkbox",
      content: {
        oQueE:
          "Reduz automaticamente a velocidade quando o bico imprime sobre overhangs (saliências). Permite que o cooling solidifique o plástico antes que ele caia, evitando droop (queda) e stringing.",
        porQueAjustar:
          "Velocidade normal em saliência faz o plástico ainda mole cair, gerando droop e 'cabelos'. Velocidade reduzida combinada com cooling a 100% mantém overhangs limpos até 60–70° em PLA.",
        options: [
          {
            value: "Ativado — PADRÃO",
            uso: "Peças com saliências",
            resultado: "Reduz velocidade em overhangs automaticamente",
          },
          {
            value: "Desativado",
            uso: "Peças totalmente suportadas ou sem saliências",
            resultado: "Mantém velocidade normal",
          },
        ],
        oQueInfluencia:
          "Qualidade de overhangs sem suporte, necessidade de árvores de suporte e acabamento de faces inclinadas.",
        oQueGera: "Overhangs limpos, sem droop ou stringing, especialmente em PLA.",
        regraDeOuro:
          "Ative sempre para peças com overhangs. Saliências precisam de velocidade reduzida.",
        comoConfigurar:
          "Processo → Velocidade → Velocidade em saliências → Reduzir velocidade em saliências.",
      },
    },
    {
      id: "slow-down-curled-perimeters",
      label: "Reduzir vel. para perímetros encurvados",
      value: "Desativado",
      type: "checkbox",
      content: {
        oQueE:
          "Função que reduz automaticamente a velocidade do bico em áreas onde as paredes podem se curvar ou enrolar (saliências severas e pontes), evitando que o filamento recém-depositado seja arrastado pelo bico.",
        porQueAjustar:
          "Em saliências severas, o filamento não adere bem ao ar; velocidades altas pioram o problema. Reduzir automaticamente melhora a adesão e a integridade da camada — especialmente útil em overhangs acima de 45°.",
        options: [
          {
            value: "Ativado",
            uso: "Peças com saliências > 45°",
            resultado: "Reduz velocidade em áreas críticas",
          },
          {
            value: "Desativado — PADRÃO DA TELA",
            uso: "Peças sem saliências severas",
            resultado: "Mantém velocidade normal",
          },
        ],
        oQueInfluencia:
          "Qualidade de overhangs, adesão entre camadas em áreas críticas e risco de curling (enrolamento das bordas).",
        oQueGera:
          "Saliências mais limpas e estáveis, com menos defeitos visíveis na face inferior das áreas suspensas.",
        regraDeOuro:
          "Ative para peças com overhangs muito severos (>60°). Para geometrias moderadas, o controle padrão de saliências já é suficiente.",
        comoConfigurar:
          "Processo → Velocidade → Velocidade em saliências → Reduzir vel. para perímetros encurvados.",
      },
    },
    {
      id: "overhang-speed-10",
      label: "Velocidade em saliências › 10%",
      value: "0 mm/s",
      type: "number",
      content: {
        oQueE:
          "Velocidade aplicada quando 0–10% da linha está pendurada no ar (saliência muito leve, próxima de 0° de overhang). É a primeira faixa da tabela de velocidade escalonada por saliência.",
        porQueAjustar:
          "Com apenas 10% de saliência, o risco é mínimo — normalmente esse campo é deixado em 0, o que significa 'usar a velocidade normal da parede' em vez de uma velocidade fixa reduzida.",
        options: [
          {
            value: "0 mm/s — PADRÃO DA TELA",
            uso: "Saliência quase inexistente",
            resultado: "Usa a velocidade normal da parede",
          },
          {
            value: "100–150 mm/s",
            uso: "Definir velocidade fixa para essa faixa",
            resultado: "Controle explícito",
          },
        ],
        oQueInfluencia:
          "Consistência de velocidade em transições suaves entre parede vertical e leve saliência.",
        oQueGera: "Ao deixar em 0, a impressora não reduz velocidade para saliências muito leves.",
        regraDeOuro:
          "Deixe em 0 para a faixa de 10% — a redução real deve começar nas faixas de 25% a 75%.",
        comoConfigurar:
          "Processo → Velocidade → Velocidade em saliências → tabela de Velocidade em saliências (coluna 10%).",
      },
    },
    {
      id: "overhang-speed-25",
      label: "Velocidade em saliências › 25%",
      value: "50 mm/s",
      type: "number",
      content: {
        oQueE:
          "Velocidade aplicada quando cerca de 25% da linha está pendurada no ar. Corresponde aproximadamente a ângulos de saliência de 25–45°, uma zona onde o filamento já começa a precisar de mais tempo de resfriamento.",
        porQueAjustar:
          "Saliências nessa faixa ainda são moderadas, mas já se beneficiam de uma redução de velocidade para não derrubar a linha antes de solidificar.",
        options: [
          {
            value: "40–60 mm/s — PADRÃO DA TELA",
            uso: "Ângulos de 25–45°",
            resultado: "Boa adesão sem sacrificar muito tempo",
          },
          {
            value: "20–30 mm/s",
            uso: "Materiais mais sensíveis a droop",
            resultado: "Mais seguro, mais lento",
          },
        ],
        oQueInfluencia:
          "Adesão da saliência, droop (queda do filamento) e acabamento da face inclinada.",
        oQueGera: "Saliências moderadas ficam limpas sem grande perda de tempo de impressão.",
        regraDeOuro: "40–60 mm/s atende a maioria dos casos com saliência moderada.",
        comoConfigurar:
          "Processo → Velocidade → Velocidade em saliências → tabela de Velocidade em saliências (coluna 25%).",
      },
    },
    {
      id: "overhang-speed-50",
      label: "Velocidade em saliências › 50%",
      value: "30 mm/s",
      type: "number",
      content: {
        oQueE:
          "Velocidade aplicada quando cerca de 50% da linha está pendurada no ar — saliências severas, próximas de 45–60° de ângulo. É a faixa clássica de 'overhang speed' citada na maioria dos perfis.",
        porQueAjustar:
          "Saliências são as áreas mais frágeis da camada — velocidade baixa dá tempo para o cooling solidificar a linha antes que ela caia. Quanto maior o ângulo de saliência, menor deve ser a velocidade.",
        options: [
          {
            value: "20–30 mm/s — PADRÃO DA TELA",
            uso: "Ângulos de 45–60°",
            resultado: "Overhangs limpos até 70° com cooling 100%",
          },
          { value: "10–20 mm/s", uso: "Saliências extremas (60–75°)", resultado: "Mais seguro" },
        ],
        oQueInfluencia:
          "Adesão da saliência, droop (queda do filamento) e acabamento da face inferior em áreas inclinadas.",
        oQueGera:
          "Em PLA com cooling 100%, overhangs até 70° ficam limpos com 20–30 mm/s. Acima de 60 mm/s as bordas começam a cair.",
        regraDeOuro:
          "Saliências severas pedem velocidade baixa. 30 mm/s atende a maioria dos casos em PLA/PETG.",
        comoConfigurar:
          "Processo → Velocidade → Velocidade em saliências → tabela de Velocidade em saliências (coluna 50%).",
      },
    },
    {
      id: "overhang-speed-75",
      label: "Velocidade em saliências › 75%",
      value: "10 mm/s",
      type: "number",
      content: {
        oQueE:
          "Velocidade aplicada quando cerca de 75% da linha está pendurada no ar — saliências extremas, próximas de 75–90° (quase horizontal, como uma ponte curta sem suporte).",
        porQueAjustar:
          "Nessa faixa o filamento está quase totalmente no ar. Somente velocidades muito baixas dão tempo suficiente de resfriamento para evitar que a linha caia ou se rompa.",
        options: [
          {
            value: "5–10 mm/s — PADRÃO DA TELA",
            uso: "Ângulos de 75–90°",
            resultado: "Última linha de defesa contra droop",
          },
        ],
        oQueInfluencia:
          "Sucesso ou falha total da saliência extrema, tempo de impressão localizado na área.",
        oQueGera:
          "Saliências quase horizontais que sobrevivem sem suporte, ao custo de tempo extra localizado.",
        regraDeOuro:
          "Não reduza abaixo de 5 mm/s — o material pode superaquecer localmente sem ganho adicional.",
        comoConfigurar:
          "Processo → Velocidade → Velocidade em saliências → tabela de Velocidade em saliências (coluna 75%).",
      },
    },
    {
      id: "bridge-speed-external",
      label: "Ponte › Externo",
      value: "30 mm/s",
      type: "number",
      content: {
        oQueE:
          "Velocidade das pontes externas — trechos onde o filamento atravessa um vão sem apoio embaixo, formando uma 'ponte' entre duas paredes. É a velocidade da camada de ponte visível.",
        porQueAjustar:
          "Pontes precisam de velocidade baixa e cooling máximo para que o filamento não afunde no meio do vão antes de esfriar. Velocidade alta em pontes gera afundamento (sagging) e falhas.",
        options: [
          {
            value: "20–30 mm/s — PADRÃO DA TELA",
            uso: "Vãos curtos a médios",
            resultado: "Ponte reta e firme",
          },
          {
            value: "10–20 mm/s",
            uso: "Vãos longos, materiais difíceis",
            resultado: "Máxima segurança",
          },
        ],
        oQueInfluencia:
          "Reta e resistência da ponte, presença de sagging (afundamento) e acabamento visual do vão.",
        oQueGera:
          "Ponte lenta com cooling 100% resulta em linhas retas e firmes mesmo em vãos de vários centímetros.",
        regraDeOuro: "Ponte sempre lenta. 20–30 mm/s cobre a maioria dos casos com PLA e PETG.",
        comoConfigurar:
          "Processo → Velocidade → Velocidade em saliências → Ponte (coluna Externo).",
      },
    },
    {
      id: "bridge-speed-internal",
      label: "Ponte › Interno",
      value: "150%",
      type: "percent",
      content: {
        oQueE:
          "Velocidade das pontes internas (dentro do infill, entre paredes internas), definida como porcentagem da velocidade de infill. Pontes internas não são visíveis, então podem ir mais rápido que as externas.",
        porQueAjustar:
          "Como pontes internas ficam escondidas dentro da peça, um pequeno afundamento não compromete a estética — por isso podem rodar mais rápido (150% da velocidade de referência) sem risco visual.",
        options: [
          {
            value: "100%",
            uso: "Máxima segurança estrutural",
            resultado: "Ponte interna mais firme",
          },
          {
            value: "150% — PADRÃO DA TELA",
            uso: "Uso geral",
            resultado: "Ganho de tempo sem risco visual",
          },
        ],
        oQueInfluencia:
          "Tempo de impressão do infill e integridade estrutural de vãos internos (ninhos de abelha, canais).",
        oQueGera:
          "Pontes internas mais rápidas sem impacto estético, já que ficam escondidas dentro da peça.",
        regraDeOuro:
          "Pontes internas podem ser mais rápidas que as externas — a estética não está em jogo.",
        comoConfigurar:
          "Processo → Velocidade → Velocidade em saliências → Ponte (coluna Interno).",
      },
    },
  ],
};

export const deslocamentoVelGroup: CourseGroup = {
  id: "deslocamento-vel",
  label: "Velocidade de deslocamento",
  items: [
    {
      id: "travel-speed",
      label: "Deslocamento",
      value: "300 mm/s",
      type: "number",
      content: {
        oQueE:
          "Velocidade dos movimentos aéreos (travel) — quando o bico se move sem extrudar, entre uma região impressa e outra. Maior velocidade de travel = menos tempo gasto em deslocamentos = menos stringing.",
        porQueAjustar:
          "Travel rápido reduz o tempo que o plástico vazante tem para 'esticar' e criar fiapos (stringing). Paradoxalmente, travel mais rápido tende a reduzir esse problema, não causá-lo — desde que a estrutura da máquina aguente.",
        options: [
          {
            value: "150–200 mm/s",
            uso: "Impressoras cartesianas, estrutura leve",
            resultado: "Travel seguro",
          },
          {
            value: "300 mm/s — PADRÃO DA TELA",
            uso: "Uso geral em impressoras CoreXY",
            resultado: "Boa velocidade",
          },
          {
            value: "500–600 mm/s",
            uso: "Impressoras rápidas com Input Shaping calibrado",
            resultado: "Travel muito rápido",
          },
        ],
        oQueInfluencia:
          "Stringing, tempo entre regiões, vibração e estabilidade mecânica da impressora.",
        oQueGera:
          "Travel bem ajustado economiza 15–25% do tempo total em peças com muitas ilhas ou detalhes espalhados.",
        regraDeOuro:
          "Velocidade baixa onde a qualidade conta (saliências, primeira camada). Velocidade alta onde o bico está no ar — é onde se ganha tempo sem perder qualidade.",
        comoConfigurar: "Processo → Velocidade → Velocidade de deslocamento → Deslocamento.",
      },
    },
  ],
};

export const aceleracaoVelGroup: CourseGroup = {
  id: "aceleracao",
  label: "Aceleração",
  items: [
    {
      id: "default-acceleration",
      label: "Impressão normal",
      value: "6000 mm/s²",
      type: "number",
      content: {
        oQueE:
          "Valor base de aceleração usado quando nenhuma aceleração específica está definida para uma região. Funciona como teto geral para os movimentos de impressão da máquina.",
        porQueAjustar:
          "Se a aceleração padrão for muito alta para a estrutura da impressora, ela vibra mesmo em movimentos genéricos, gerando ghosting. Muito baixa e a impressão fica lenta sem necessidade.",
        options: [
          {
            value: "2000–3000 mm/s²",
            uso: "Ender, Anycubic (estrutura leve)",
            resultado: "Conservador",
          },
          {
            value: "3000–5000 mm/s²",
            uso: "Prusa, Creality K1 (estrutura média)",
            resultado: "Padrão",
          },
          {
            value: "6000 mm/s² — PADRÃO DA TELA",
            uso: "Voron, Bambu Lab (estrutura robusta com IS)",
            resultado: "Agressivo",
          },
          { value: "8000+ mm/s²", uso: "CoreXY com Input Shaping calibrado", resultado: "Extremo" },
        ],
        oQueInfluencia: "Teto de todas as demais acelerações e vibração geral da máquina.",
        oQueGera:
          "6000 mm/s² sem Input Shaping geraria ringing forte; com IS calibrado, é velocidade real sem perda visual. Valores reais medidos: Ender 3 estoque ~1500, Prusa MK3S ~2500, Voron 2.4 com IS ~7000–10000, Bambu X1C ~10000, Voron Trident/2.4 tuned ~12000+.",
        regraDeOuro:
          "A aceleração padrão define o teto da sua impressora. Rode o teste Input Shaping do OrcaSlicer e use ~70% da aceleração máxima antes de aparecer ringing.",
        comoConfigurar: "Processo → Velocidade → Aceleração → Impressão normal.",
      },
    },
    {
      id: "outer-wall-accel",
      label: "Parede externa",
      value: "2000 mm/s²",
      type: "number",
      content: {
        oQueE:
          "Aceleração da linha visível da peça. É o valor mais crítico para a qualidade estética: define se cantos e curvas terão ghosting ou ficarão limpos.",
        porQueAjustar:
          "A parede externa é a 'cara' da peça. Toda vibração aqui aparece como ondulação (ringing) ou fantasma da geometria. Este perfil usa aceleração reduzida (2000 mm/s², um terço da padrão) justamente para proteger essa superfície.",
        options: [
          {
            value: "300–500 mm/s²",
            uso: "Máxima qualidade, sem Input Shaping",
            resultado: "Zero ghosting",
          },
          {
            value: "2000 mm/s² — PADRÃO DA TELA",
            uso: "Impressoras rápidas com IS",
            resultado: "Qualidade boa em alta velocidade",
          },
          {
            value: "3000+ mm/s²",
            uso: "Protótipos, sem requisito estético",
            resultado: "Risco de ghosting",
          },
        ],
        oQueInfluencia: "Ghosting, ringing, definição de cantos e brilho da superfície.",
        oQueGera:
          "Aceleração reduzida na parede externa gera cantos limpos mesmo com velocidade alta (200 mm/s).",
        regraDeOuro:
          "Parede externa sempre com a menor aceleração do perfil — é a superfície que define a qualidade visual.",
        comoConfigurar: "Processo → Velocidade → Aceleração → Parede externa.",
      },
    },
    {
      id: "inner-wall-accel",
      label: "Parede interna",
      value: "4000 mm/s²",
      type: "number",
      content: {
        oQueE:
          "Aceleração das paredes estruturais internas, escondidas pela parede externa. Pode ser maior pois não impacta o acabamento visual.",
        porQueAjustar:
          "Aumentar a aceleração aqui acelera a impressão sem prejuízo estético, já que a interna fica coberta pela externa. Neste perfil é o dobro da aceleração da externa.",
        options: [
          {
            value: "800–1200 mm/s²",
            uso: "Uso geral em impressoras convencionais",
            resultado: "Recomendado",
          },
          {
            value: "4000 mm/s² — PADRÃO DA TELA",
            uso: "Impressoras rápidas com IS",
            resultado: "Mais rápido, sem custo visual",
          },
        ],
        oQueInfluencia: "Tempo de impressão e vibração transmitida à parede externa.",
        oQueGera:
          "Interna com aceleração alta + externa com aceleração baixa = tempo reduzido sem perda visual.",
        regraDeOuro: "Parede interna sempre maior que a externa e menor ou igual ao preenchimento.",
        comoConfigurar: "Processo → Velocidade → Aceleração → Parede interna.",
      },
    },
    {
      id: "bridge-accel",
      label: "Ponte",
      value: "5000 mm/s²",
      type: "number",
      content: {
        oQueE:
          "Aceleração aplicada durante a impressão de pontes. Controla o quão suavemente o bico entra e sai do trecho suspenso, evitando solavancos que rompem a linha ainda mole.",
        porQueAjustar:
          "Uma aceleração muito alta em ponte pode causar um 'chicote' no filamento recém-extrudado antes que ele esfrie, comprometendo a reta da ponte.",
        options: [
          {
            value: "1000–2000 mm/s²",
            uso: "Pontes longas e críticas",
            resultado: "Movimento mais suave",
          },
          { value: "5000 mm/s² — PADRÃO DA TELA", uso: "Uso geral", resultado: "Bom equilíbrio" },
        ],
        oQueInfluencia: "Reta da ponte, vibração no início/fim do vão e qualidade do acabamento.",
        oQueGera: "Aceleração moderada em ponte preserva a linha reta mesmo em vãos maiores.",
        regraDeOuro:
          "Reduza a aceleração de ponte se notar ondulação no início ou fim de vãos longos.",
        comoConfigurar: "Processo → Velocidade → Aceleração → Ponte.",
      },
    },
    {
      id: "sparse-infill-accel",
      label: "Preenchimento esparso",
      value: "5000 mm/s²",
      type: "number",
      content: {
        oQueE:
          "Aceleração do infill esparso. Como não é visível, aceita os valores mais altos da tabela de aceleração.",
        porQueAjustar:
          "O infill é o grande consumidor de tempo da impressão. Subir a aceleração aqui reduz o tempo total sem qualquer perda estética.",
        options: [
          {
            value: "1500–2000 mm/s²",
            uso: "Uso geral em impressoras convencionais",
            resultado: "Recomendado",
          },
          {
            value: "5000 mm/s² — PADRÃO DA TELA",
            uso: "Impressoras rápidas, print farms",
            resultado: "Máxima velocidade",
          },
        ],
        oQueInfluencia: "Tempo total de impressão.",
        oQueGera:
          "Infill com aceleração alta reduz de 15–25% o tempo do miolo da peça, sem efeito visual.",
        regraDeOuro:
          "O infill pode ter a aceleração mais alta do perfil. Economize tempo onde ninguém vê.",
        comoConfigurar: "Processo → Velocidade → Aceleração → Preenchimento esparso.",
      },
    },
    {
      id: "solid-infill-accel",
      label: "Preenchimento sólido",
      value: "0 mm/s²",
      type: "number",
      content: {
        oQueE:
          "Aceleração específica para o preenchimento sólido (100%). Um valor 0 significa 'sem override' — o slicer usa a aceleração padrão da impressão (Impressão normal) para essa região.",
        porQueAjustar:
          "Deixar em 0 é uma forma de simplificar o perfil quando não há necessidade de um valor dedicado diferente do padrão geral da máquina.",
        options: [
          {
            value: "0 mm/s² — PADRÃO DA TELA",
            uso: "Usa a aceleração padrão da impressão",
            resultado: "Simplifica o perfil",
          },
          {
            value: "2000–4000 mm/s²",
            uso: "Controle fino e independente",
            resultado: "Ajuste dedicado",
          },
        ],
        oQueInfluencia: "Consistência entre o preenchimento sólido e o restante da impressão.",
        oQueGera:
          "Com 0, o preenchimento sólido herda o comportamento de 'Impressão normal' (6000 mm/s²).",
        regraDeOuro: "Deixe em 0 a menos que perceba necessidade de isolar esse valor dos demais.",
        comoConfigurar: "Processo → Velocidade → Aceleração → Preenchimento sólido.",
      },
    },
    {
      id: "first-layer-accel",
      label: "Primeira camada",
      value: "500 mm/s²",
      type: "number",
      content: {
        oQueE:
          "Aceleração específica da primeira camada. Mantida baixa para garantir adesão e evitar deslocar a peça da mesa logo no início da impressão.",
        porQueAjustar:
          "Aceleração alta na primeira camada arranca cantos da mesa e gera warping imediato. Um valor baixo garante adesão segura enquanto o plástico ainda está se firmando.",
        options: [
          {
            value: "300–500 mm/s² — PADRÃO DA TELA",
            uso: "Uso geral",
            resultado: "Adesão garantida",
          },
          { value: "500–1000 mm/s²", uso: "Mesas com excelente adesão", resultado: "Mais rápido" },
        ],
        oQueInfluencia: "Adesão à mesa e risco de descolamento/warping.",
        oQueGera:
          "Primeira camada com aceleração baixa garante adesão segura em qualquer material.",
        regraDeOuro: "Primeira camada lenta = adesão garantida. Use 500 mm/s² ou menos.",
        comoConfigurar: "Processo → Velocidade → Aceleração → Primeira camada.",
      },
    },
    {
      id: "first-layer-travel-accel",
      label: "Deslocamento para primeira camada",
      value: "100%",
      type: "percent",
      content: {
        oQueE:
          "Aceleração dos movimentos de deslocamento (travel) durante a primeira camada, em porcentagem da aceleração de deslocamento padrão.",
        porQueAjustar:
          "Deslocamentos bruscos na primeira camada podem sacudir a peça ainda mal aderida. Manter em 100% (sem redução extra) já é seguro na maioria dos perfis bem calibrados.",
        options: [
          { value: "100% — PADRÃO DA TELA", uso: "Uso geral", resultado: "Comportamento padrão" },
          {
            value: "50–80%",
            uso: "Mesas sensíveis, peças altas e finas",
            resultado: "Mais seguro",
          },
        ],
        oQueInfluencia: "Estabilidade da peça durante deslocamentos na primeira camada.",
        oQueGera: "Deslocamento consistente sem sacudir a peça recém-impressa.",
        regraDeOuro:
          "Reduza abaixo de 100% apenas se notar peças finas se soltando durante a primeira camada.",
        comoConfigurar: "Processo → Velocidade → Aceleração → Deslocamento para primeira camada.",
      },
    },
    {
      id: "top-surface-accel",
      label: "Superfície superior",
      value: "2000 mm/s²",
      type: "number",
      content: {
        oQueE:
          "Aceleração das camadas sólidas do topo. Visível, portanto merece valores moderados — mas pode ser um pouco maior que a da parede externa.",
        porQueAjustar:
          "Topo com aceleração alta gera ondulações na superfície sólida. Baixa demais aumenta o tempo desnecessariamente.",
        options: [
          {
            value: "800–1200 mm/s²",
            uso: "Máxima qualidade com ironing",
            resultado: "Recomendado",
          },
          {
            value: "2000 mm/s² — PADRÃO DA TELA",
            uso: "Uso geral em impressoras rápidas",
            resultado: "Bom equilíbrio",
          },
        ],
        oQueInfluencia: "Acabamento do topo, brilho e planicidade.",
        oQueGera:
          "Topo com aceleração moderada + alisamento resulta em superfície quase espelhada.",
        regraDeOuro: "O topo merece quase o mesmo cuidado da parede externa. Mantenha moderado.",
        comoConfigurar: "Processo → Velocidade → Aceleração → Superfície superior.",
      },
    },
    {
      id: "travel-accel",
      label: "Deslocamento",
      value: "10000 mm/s²",
      type: "number",
      content: {
        oQueE:
          "Aceleração dos movimentos aéreos, sem extrusão. Pode ser a maior aceleração da tabela, pois não afeta nenhuma superfície impressa.",
        porQueAjustar:
          "Travel é tempo morto — o bico só está se deslocando. Aceleração alta aqui reduz drasticamente o tempo total da impressão sem qualquer custo de qualidade.",
        options: [
          { value: "5000–8000 mm/s²", uso: "Impressoras médias", resultado: "Rápido" },
          {
            value: "10000 mm/s² — PADRÃO DA TELA",
            uso: "Uso geral em impressoras com IS",
            resultado: "Recomendado",
          },
          {
            value: "12000–20000 mm/s²",
            uso: "Máquinas com Input Shaping calibrado",
            resultado: "Máxima velocidade",
          },
        ],
        oQueInfluencia: "Tempo total de impressão e ruído da máquina.",
        oQueGera:
          "Aceleração de travel máxima gera redução visível no tempo em peças com muitas ilhas.",
        regraDeOuro: "Travel = máximo. Acelere ao máximo onde não há extrusão.",
        comoConfigurar: "Processo → Velocidade → Aceleração → Deslocamento.",
      },
    },
    {
      id: "accel-to-decel-enable",
      label: "Habilitar accel_to_decel",
      value: "Ativado",
      type: "checkbox",
      content: {
        oQueE:
          "Ativa um limite adicional que restringe a desaceleração como uma porcentagem da aceleração máxima do eixo, prevenindo transições bruscas demais entre acelerar e frear.",
        porQueAjustar:
          "Em firmwares Klipper, desaceleração descontrolada pode gerar vibração equivalente a uma aceleração muito maior que a configurada. Ativar essa trava mantém o movimento mais previsível.",
        options: [
          {
            value: "Ativado — PADRÃO DA TELA",
            uso: "Firmware Klipper, impressoras com IS",
            resultado: "Movimento controlado",
          },
          {
            value: "Desativado",
            uso: "Firmwares que não suportam o recurso",
            resultado: "Usa comportamento padrão do firmware",
          },
        ],
        oQueInfluencia: "Suavidade das transições de velocidade e vibração mecânica.",
        oQueGera: "Movimentos mais previsíveis e menor vibração em curvas e paradas.",
        regraDeOuro:
          "Mantenha ativado em impressoras Klipper modernas com Input Shaping calibrado.",
        comoConfigurar: "Processo → Velocidade → Aceleração → Habilitar accel_to_decel.",
      },
    },
    {
      id: "accel-to-decel-value",
      label: "accel_to_decel",
      value: "50%",
      type: "percent",
      content: {
        oQueE:
          "Porcentagem da aceleração máxima que é permitida como taxa de desaceleração. Um valor de 50% significa que a máquina desacelera na metade da força com que acelera.",
        porQueAjustar:
          "Limitar a desaceleração evita frenagens bruscas que geram vibração e ringing, especialmente em cantos e no fim de linhas retas rápidas.",
        options: [
          {
            value: "50% — PADRÃO DA TELA",
            uso: "Uso geral",
            resultado: "Equilíbrio entre suavidade e resposta",
          },
          {
            value: "30–40%",
            uso: "Máxima suavidade, estrutura mais flexível",
            resultado: "Menos vibração",
          },
          { value: "60–100%", uso: "Estruturas muito rígidas", resultado: "Resposta mais rápida" },
        ],
        oQueInfluencia: "Vibração no fim de movimentos rápidos e qualidade em cantos.",
        oQueGera: "Valor de 50% mantém a máquina responsiva sem gerar frenagens agressivas.",
        regraDeOuro:
          "50% é um bom ponto de partida; reduza se notar vibração ao final de trechos rápidos.",
        comoConfigurar: "Processo → Velocidade → Aceleração → accel_to_decel.",
      },
    },
  ],
};

export const jerkXYGroup: CourseGroup = {
  id: "jerk-xy",
  label: "Jerk (XY)",
  items: [
    {
      id: "jerk-default",
      label: "Padrão",
      value: "9 mm/s",
      type: "number",
      content: {
        oQueE:
          "Define a taxa de mudança da aceleração — a 'brusquidão' com que a impressora inicia e para movimentos nos eixos X e Y — usada quando nenhum valor específico é definido para uma região.",
        porQueAjustar:
          "Jerk alto melhora a qualidade em cantos pequenos (o bico não desacelera tanto antes da curva) mas gera vibração. Jerk baixo elimina vibração mas arredonda cantos. Input Shaping permite jerk mais alto sem ghosting.",
        options: [
          {
            value: "3–5 mm/s",
            uso: "Máxima precisão, sem Input Shaping",
            resultado: "Cantos cirúrgicos",
          },
          {
            value: "9 mm/s — PADRÃO DA TELA",
            uso: "Uso geral com Input Shaping",
            resultado: "Base de suavidade equilibrada",
          },
          {
            value: "12–15 mm/s",
            uso: "Impressoras rígidas rápidas",
            resultado: "Rápido, com IS calibrado",
          },
        ],
        oQueInfluencia: "Definição de cantos, ressonância da máquina, ghosting e ruído.",
        oQueGera:
          "Jerk alto sem IS = cantos arredondados e ringing. Jerk baixo = cantos cirúrgicos, porém mais lentos.",
        regraDeOuro:
          "Jerk baixo = precisão. Jerk alto = velocidade. O jerk define a suavidade dos movimentos.",
        comoConfigurar: "Processo → Velocidade → Jerk (XY) → Padrão.",
      },
    },
    {
      id: "jerk-outer-wall",
      label: "Parede externa",
      value: "9 mm/s",
      type: "number",
      content: {
        oQueE:
          "Jerk específico da linha visível (perímetro externo). Idealmente mantido baixo para garantir cantos nítidos e sem ghosting.",
        porQueAjustar:
          "É a linha que o olho enxerga — qualquer vibração aqui arruína o acabamento. Em impressoras sem Input Shaping vale sacrificar tempo por nitidez, reduzindo esse valor.",
        options: [
          { value: "2–3 mm/s", uso: "Máxima precisão, sem IS", resultado: "Cantos perfeitos" },
          {
            value: "3–5 mm/s",
            uso: "Uso geral em impressoras convencionais",
            resultado: "Recomendado",
          },
          {
            value: "9 mm/s — PADRÃO DA TELA",
            uso: "Impressoras com Input Shaping calibrado",
            resultado: "Boa qualidade em alta velocidade",
          },
        ],
        oQueInfluencia: "Qualidade de cantos retos e nitidez de chanfros e arestas.",
        oQueGera: "Jerk baixo + aceleração baixa na parede externa = canto perfeito.",
        regraDeOuro: "Se notar ghosting em cantos, este é o primeiro valor a reduzir.",
        comoConfigurar: "Processo → Velocidade → Jerk (XY) → Parede externa.",
      },
    },
    {
      id: "jerk-inner-wall",
      label: "Parede interna",
      value: "9 mm/s",
      type: "number",
      content: {
        oQueE:
          "Jerk dos perímetros internos. Pode ser igual ou ligeiramente maior que o da externa, pois eventual vibração fica escondida atrás da parede visível.",
        porQueAjustar:
          "Aumentar esse valor acelera a impressão sem prejuízo estético, já que a parede interna é coberta pela externa.",
        options: [
          {
            value: "5–7 mm/s",
            uso: "Uso geral em impressoras convencionais",
            resultado: "Estrutura sólida",
          },
          {
            value: "9 mm/s — PADRÃO DA TELA",
            uso: "Impressoras com IS",
            resultado: "Tempo reduzido sem comprometer a face visível",
          },
        ],
        oQueInfluencia: "Tempo de impressão e vibração transmitida à parede externa.",
        oQueGera: "Interna com jerk mais alto reduz tempo sem comprometer a face visível.",
        regraDeOuro: "A parede interna pode ficar um pouco acima da externa. Não exagere.",
        comoConfigurar: "Processo → Velocidade → Jerk (XY) → Parede interna.",
      },
    },
    {
      id: "jerk-infill",
      label: "Preenchimento",
      value: "9 mm/s",
      type: "number",
      content: {
        oQueE:
          "Jerk do infill. Não é visível, então aceita valores mais altos para reduzir o tempo de impressão.",
        porQueAjustar:
          "O infill é o grande consumidor de tempo. Jerk alto aqui acelera bastante a impressão sem qualquer perda visível.",
        options: [
          { value: "6–8 mm/s", uso: "Uso geral", resultado: "Recomendado" },
          {
            value: "9–12 mm/s — PADRÃO DA TELA",
            uso: "Peças estruturais, impressoras rápidas",
            resultado: "Mais rápido",
          },
        ],
        oQueInfluencia: "Tempo total de impressão.",
        oQueGera:
          "Jerk de infill alto + aceleração alta gera redução significativa no tempo do miolo da peça.",
        regraDeOuro:
          "O infill pode usar o jerk mais alto do perfil — economize tempo onde ninguém vê.",
        comoConfigurar: "Processo → Velocidade → Jerk (XY) → Preenchimento.",
      },
    },
    {
      id: "jerk-top-surface",
      label: "Superfície superior",
      value: "9 mm/s",
      type: "number",
      content: {
        oQueE:
          "Jerk das camadas sólidas do topo. Idealmente mantido baixo para garantir acabamento liso, sem ondulações.",
        porQueAjustar:
          "O topo é tão visível quanto a parede externa. Jerk alto gera ondulações; jerk baixo produz um topo mais espelhado.",
        options: [
          { value: "4–6 mm/s", uso: "Máxima qualidade com ironing", resultado: "Topo espelhado" },
          {
            value: "9 mm/s — PADRÃO DA TELA",
            uso: "Impressoras com IS",
            resultado: "Boa qualidade em alta velocidade",
          },
        ],
        oQueInfluencia: "Acabamento do topo, brilho e planicidade.",
        oQueGera: "Topo com jerk baixo + alisamento resulta em superfície espelhada.",
        regraDeOuro:
          "O topo merece o mesmo cuidado da parede externa — jerk baixo sempre que possível.",
        comoConfigurar: "Processo → Velocidade → Jerk (XY) → Superfície superior.",
      },
    },
    {
      id: "jerk-first-layer",
      label: "Primeira camada",
      value: "9 mm/s",
      type: "number",
      content: {
        oQueE:
          "Jerk da primeira camada. Idealmente muito baixo para garantir estabilidade máxima e evitar deslocar a peça da mesa.",
        porQueAjustar:
          "Jerk alto na primeira camada pode descolar cantos da mesa. Jerk muito baixo lentifica desnecessariamente a impressão.",
        options: [
          { value: "1–2 mm/s", uso: "Máxima estabilidade", resultado: "Adesão segura" },
          { value: "2–4 mm/s", uso: "Mesas perfeitas", resultado: "Recomendado" },
          {
            value: "9 mm/s — PADRÃO DA TELA",
            uso: "Impressoras com boa adesão e IS",
            resultado: "Mais rápido, ainda seguro",
          },
        ],
        oQueInfluencia: "Adesão à mesa e risco de descolamento.",
        oQueGera: "Jerk baixo na primeira camada garante adesão segura em qualquer material.",
        regraDeOuro: "Reduza este valor se notar cantos descolando na primeira camada.",
        comoConfigurar: "Processo → Velocidade → Jerk (XY) → Primeira camada.",
      },
    },
    {
      id: "jerk-first-layer-travel",
      label: "Deslocamento para primeira camada",
      value: "100%",
      type: "percent",
      content: {
        oQueE:
          "Jerk dos movimentos de deslocamento (travel) durante a primeira camada, em porcentagem do jerk de deslocamento padrão.",
        porQueAjustar:
          "Movimentos aéreos bruscos na primeira camada podem sacudir a peça ainda mal aderida à mesa. Manter em 100% já é seguro na maioria dos perfis bem calibrados.",
        options: [
          { value: "100% — PADRÃO DA TELA", uso: "Uso geral", resultado: "Comportamento padrão" },
          {
            value: "50–80%",
            uso: "Mesas sensíveis, peças altas e finas",
            resultado: "Mais seguro",
          },
        ],
        oQueInfluencia: "Estabilidade da peça durante deslocamentos na primeira camada.",
        oQueGera: "Deslocamento consistente sem sacudir a peça recém-impressa.",
        regraDeOuro:
          "Reduza abaixo de 100% apenas se notar peças finas se soltando na primeira camada.",
        comoConfigurar: "Processo → Velocidade → Jerk (XY) → Deslocamento para primeira camada.",
      },
    },
    {
      id: "jerk-travel",
      label: "Deslocamento",
      value: "9 mm/s",
      type: "number",
      content: {
        oQueE:
          "Jerk em movimentos sem extrusão (travel). Pode ser mais alto pois não há plástico saindo do bico durante esse movimento.",
        porQueAjustar:
          "Travel é tempo morto — jerk alto reduz esse tempo sem afetar a qualidade da peça impressa.",
        options: [
          {
            value: "8–12 mm/s — PADRÃO DA TELA",
            uso: "Uso geral",
            resultado: "Menos tempo entre ilhas, sem stringing extra",
          },
        ],
        oQueInfluencia: "Tempo total de impressão e ruído da máquina.",
        oQueGera:
          "Jerk de travel alto reduz o tempo entre regiões impressas sem gerar stringing adicional.",
        regraDeOuro: "O deslocamento pode usar o jerk mais alto da tabela.",
        comoConfigurar: "Processo → Velocidade → Jerk (XY) → Deslocamento.",
      },
    },
  ],
};

export const avancadoVelGroup: CourseGroup = {
  id: "avancado-vel",
  label: "Avançado",
  items: [
    {
      id: "extrusion-smoothing",
      label: "Suavização da extrusão",
      value: "0 mm³/s²",
      type: "number",
      content: {
        oQueE:
          "Parâmetro avançado que suaviza variações de fluxo durante a extrusão, reduzindo picos quando o bico desacelera/acelera. Funciona em conjunto com o Pressure Advance no firmware Klipper.",
        porQueAjustar:
          "Suaviza transições de fluxo e reduz marcas em curvas e cantos. Ativar sem o Pressure Advance calibrado piora a qualidade — sempre calibre o PA primeiro. Com 0, a função está desativada.",
        options: [
          {
            value: "0 mm³/s² — PADRÃO DA TELA",
            uso: "Sem Pressure Advance calibrado",
            resultado: "Função desativada",
          },
          { value: "0,1–0,3", uso: "Uso geral, com PA calibrado", resultado: "Recomendado" },
          {
            value: "0,3–0,5",
            uso: "Peças com muitas curvas e cantos",
            resultado: "Muita suavização",
          },
          { value: ">0,5", uso: "Não recomendado", resultado: "Pode borrar detalhes" },
        ],
        oQueInfluencia:
          "Bleeding (vazamento) em cantos e qualidade em zonas de variação rápida de fluxo.",
        oQueGera: "Com PA calibrado e suavização em 0,2: cantos sem 'gota' de excesso de plástico.",
        regraDeOuro:
          "Calibre o Pressure Advance primeiro. Só depois ative a suavização em 0,1–0,3.",
        comoConfigurar: "Processo → Velocidade → Avançado → Suavização da extrusão.",
      },
    },
  ],
};
