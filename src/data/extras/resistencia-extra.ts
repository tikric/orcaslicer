import { CourseGroup, CourseItem } from "../courseData";

export const geradorParedesArachneGroup: CourseGroup = {
  id: "gerador-paredes-arachne",
  label: "Gerador de Paredes (Arachne)",
  items: [
    {
      id: "wall-generator-type",
      label: "Tipo de Gerador de Paredes",
      value: "Arachne",
      type: "dropdown",
      content: {
        oQueE:
          "Algoritmo que define como as trajetórias das paredes são geradas. O Clássico usa largura de linha fixa, enquanto o Arachne ajusta a largura dinamicamente (largura variável) para preencher espaços e detalhes finos.",
        porQueAjustar:
          "Define a qualidade de detalhes finos e a resistência de paredes delgadas. Arachne elimina lacunas em textos e paredes com menos de 1mm, adaptando o 'pincel' ao espaço disponível.",
        options: [
          {
            value: "Arachne — PADRÃO",
            uso: "Detalhes finos, textos, engrenagens",
            resultado: "Evita lacunas, adapta largura",
          },
          {
            value: "Clássico (Classic)",
            uso: "Peças simples, furos precisos",
            resultado: "Largura fixa, previsível",
          },
        ],
        oQueInfluencia:
          "Espessura mínima de paredes, fidelidade de detalhes, velocidade de fatiamento e visual das camadas.",
        oQueGera:
          "Arachne gera paredes sem lacunas mas com largura variável; Clássico gera paredes uniformes mas pode deixar espaços vazios em regiões finas.",
        regraDeOuro:
          "Arachne para 90% dos casos. Use Clássico se precisar de controle absoluto sobre a largura da linha em peças mecânicas simples.",
        comoConfigurar:
          "Prepare → Qualidade → Gerador de paredes → Selecionar Clássico ou Arachne.",
      },
    },
    {
      id: "wall-transition-angle",
      label: "Ângulo limite de transição de parede",
      value: "10°",
      type: "number",
      content: {
        oQueE:
          "Ângulo mínimo para que o Arachne crie uma transição entre números pares e ímpares de paredes em geometrias afuniladas (cunhas).",
        porQueAjustar:
          "Evita a criação de paredes centrais desnecessárias em ângulos muito agudos, o que pode causar sobre-extrusão ou movimentos frenéticos do bico.",
        oQueInfluencia: "Número de paredes centrais em cantos vivos e fluidez do movimento.",
        oQueGera:
          "Valores baixos reduzem paredes centrais; valores altos permitem mais transições em ângulos abertos.",
        regraDeOuro:
          "10° é o padrão ideal. Ajuste apenas se notar excesso de material em pontas afiadas.",
        comoConfigurar:
          "Modo Avançado → Qualidade → Gerador de paredes (Arachne) → Ângulo limite de transição de parede.",
      },
    },
    {
      id: "wall-transition-filter-margin",
      label: "Margem do filtro de transição",
      value: "25%",
      type: "percent",
      content: {
        oQueE:
          "Tolerância ao redor da largura mínima da parede para evitar que o Arachne mude constantemente o número de paredes (oscilação).",
        porQueAjustar:
          "Reduz retrações e paradas/partidas do bico ao permitir que a largura da linha varie um pouco mais antes de decidir adicionar ou remover uma parede.",
        oQueInfluencia:
          "Quantidade de viagens (travel), paradas de extrusão e uniformidade da parede.",
        oQueGera: "Margem alta = menos transições e viagens, mas largura de linha mais variável.",
        regraDeOuro: "25% é o equilíbrio entre qualidade e eficiência de movimento.",
        comoConfigurar:
          "Modo Avançado → Qualidade → Gerador de paredes (Arachne) → Margem do filtro de transição.",
      },
    },
    {
      id: "min-bead-width",
      label: "Largura mínima do filete",
      value: "85%",
      type: "percent",
      content: {
        oQueE:
          "A menor largura de linha que o Arachne pode usar para tentar imprimir detalhes muito finos.",
        porQueAjustar:
          "Define o limite físico do que o bico consegue 'espremer'. Muito baixo pode causar subextrusão; muito alto impede a impressão de detalhes finos.",
        oQueInfluencia: "Impressão de detalhes pequenos, fidelidade de textos e paredes delgadas.",
        oQueGera: "Define se um detalhe fino será ignorado ou tentado com uma linha mais magra.",
        regraDeOuro:
          "85% do diâmetro do bico é o limite seguro. Para bico 0.4 mm → 0.34 mm; bico 0.6 mm → 0.51 mm; bico 0.2 mm → 0.17 mm. Abaixo de 75% aparece underextrusion.",
        comoConfigurar:
          "Modo Avançado → Qualidade → Gerador de paredes (Arachne) → Largura mínima do filete.",
      },
    },
    {
      id: "min-feature-size",
      label: "Tamanho mínimo do recurso",
      value: "25%",
      type: "percent",
      content: {
        oQueE:
          "Tamanho mínimo de uma geometria no modelo para que o slicer tente imprimi-la. Recursos menores que isso são ignorados.",
        porQueAjustar:
          "Evita que o bico tente imprimir pontos minúsculos que resultariam apenas em 'caroços' de plástico sem forma.",
        oQueInfluencia: "Visibilidade de detalhes microscópicos e tempo de processamento.",
        oQueGera: "Filtra geometrias irrelevantes ou impossíveis para o diâmetro do bico atual.",
        regraDeOuro:
          "25% para detalhes normais. Aumente se a peça tiver muitos 'ruídos' ou pontas inúteis.",
        comoConfigurar:
          "Modo Avançado → Qualidade → Gerador de paredes (Arachne) → Tamanho mínimo do recurso.",
      },
    },
    {
      id: "wall-transition-length",
      label: "Comprimento da transição da parede",
      value: "0.4 mm",
      type: "number",
      content: {
        oQueE:
          "Controla a distância que a transição entre números de paredes se estende para dentro do modelo.",
        porQueAjustar:
          "Valores baixos encurtam ou removem paredes centrais finas, melhorando o tempo de impressão mas reduzindo a cobertura em áreas apertadas.",
        oQueInfluencia: "Tempo de impressão e preenchimento de áreas estreitas.",
        oQueGera:
          "Transições mais curtas e eficientes (valor baixo) ou preenchimento máximo (valor alto).",
        regraDeOuro:
          "Padrão de 0.4 mm atende a maioria. Aumente se notar buracos no fatiamento de pontas finas.",
        comoConfigurar:
          "Modo Avançado → Qualidade → Gerador de paredes (Arachne) → Comprimento da transição da parede.",
      },
    },
    {
      id: "wall-distribution-count",
      label: "Contagem de distribuição de parede",
      value: "1",
      type: "number",
      content: {
        oQueE:
          "Define quantas paredes (contadas de fora para dentro) podem ter sua largura variada pelo Arachne.",
        porQueAjustar:
          "Manter as paredes externas com largura constante (valor 1) garante a melhor qualidade visual, deixando as variações de largura para as paredes internas.",
        oQueInfluencia: "Qualidade da superfície externa e uniformidade das camadas.",
        oQueGera: "Parede externa uniforme, com variações escondidas internamente.",
        regraDeOuro:
          "Mantenha em 1 para priorizar estética. Aumente apenas em peças puramente funcionais.",
        comoConfigurar:
          "Modo Avançado → Qualidade → Gerador de paredes (Arachne) → Contagem de distribuição de parede.",
      },
    },
    {
      id: "wall-max-deviation",
      label: "Desvio máximo da parede",
      value: "0.05 mm",
      type: "number",
      content: {
        oQueE: "Erro geométrico máximo permitido ao simplificar os caminhos das paredes.",
        porQueAjustar:
          "Equilibra a fidelidade à forma original do modelo com a necessidade de simplificar o G-code. O desvio tem precedência sobre a resolução.",
        oQueInfluencia: "Precisão dimensional e complexidade do G-code.",
        oQueGera:
          "Paredes extremamente fiéis ao CAD (valor baixo) ou G-code simplificado (valor alto).",
        regraDeOuro: "0.05 mm é o padrão de alta precisão. Não costuma ser necessário alterar.",
        comoConfigurar:
          "Modo Expert → Qualidade → Gerador de paredes (Arachne) → Desvio máximo da parede.",
      },
    },
    {
      id: "wall-max-resolution",
      label: "Resolução máxima da parede",
      value: "0.5 mm",
      type: "number",
      content: {
        oQueE:
          "Define o comprimento mínimo de um segmento de parede. O Arachne simplifica caminhos removendo pontos muito próximos.",
        porQueAjustar:
          "Reduz o tamanho do G-code e a carga de processamento da impressora. Valores muito baixos podem travar impressoras antigas com excesso de dados.",
        oQueInfluencia: "Tamanho do arquivo G-code, fluidez de movimento e precisão geométrica.",
        oQueGera:
          "G-code mais leve e movimentos mais limpos (valores altos) ou detalhes máximos (valores baixos).",
        regraDeOuro:
          "0.5 mm para a maioria. Reduza para 0.1 mm apenas em peças minúsculas com curvas complexas.",
        comoConfigurar:
          "Modo Expert → Qualidade → Gerador de paredes (Arachne) → Resolução máxima da parede.",
      },
    },
  ],
};

export const wallLoopDirectionItem: CourseItem[] = [
  {
    id: "wall-loop-direction",
    label: "Direção da volta da parede",
    value: "Anti-horário",
    type: "dropdown",
    content: {
      oQueE:
        "Define o sentido (horário ou anti-horário) em que o bico percorre o contorno da peça.",
      porQueAjustar:
        "Afeta a textura visual e o brilho das paredes devido à forma como o plástico é puxado pelo bico.",
      options: [
        {
          value: "Anti-horário — PADRÃO",
          uso: "Uso geral",
          resultado: "Calibrado para melhor visual",
        },
        { value: "Horário", uso: "Testes direcionais", resultado: "Inverte marcas de textura" },
      ],
      oQueInfluencia: "Aparência sutil das camadas e consistência visual.",
      oQueGera: "Mudança mínima no brilho da peça conforme a luz incide nas camadas.",
      regraDeOuro:
        "Mantenha em Anti-horário. Só altere se notar artefatos direcionais consistentes.",
      comoConfigurar: "Prepare → Qualidade → Paredes e superfícies → Direção da volta da parede.",
    },
  },
];

export const paredesSuperficiesTailItems: CourseItem[] = [
  {
    id: "one-wall-top-surface",
    label: "Parede única em superfícies superiores",
    value: "Desativado",
    type: "checkbox",
    content: {
      oQueE:
        "Força o uso de apenas uma parede ao redor do topo da peça, independente do número global de paredes.",
      porQueAjustar:
        "Melhora o fechamento do teto (top surface) ao evitar que múltiplas paredes deixem marcas ou lacunas na transição para o preenchimento sólido.",
      oQueInfluencia: "Qualidade do acabamento superior e 'pillowing'.",
      oQueGera:
        "Topo visivelmente mais limpo e uniforme, sem a linha visível de junção entre paredes múltiplas.",
      regraDeOuro:
        "Ative em peças com preenchimento baixo (<25%) e topos planos grandes. Combine com 4+ camadas superiores sólidas e Ironing para eliminar pillowing por completo.",
      comoConfigurar:
        "Prepare → Qualidade → Paredes e superfícies → Parede única em superfícies superiores.",
    },
  },
  {
    id: "one-wall-threshold",
    label: "Limiar de parede única",
    value: "300%",
    type: "percent",
    content: {
      oQueE:
        "Espessura máxima (em % da largura da linha) para que uma região fina seja impressa com uma única linha em vez de duas paredes paralelas.",
      porQueAjustar:
        "Evita a 'fenda' central que ocorre quando o slicer tenta espremer duas paredes onde só cabe uma e meia.",
      oQueInfluencia: "Solidez de paredes finas e tempo de impressão.",
      oQueGera:
        "Paredes finas sólidas (valor correto) ou paredes com lacunas internas (valor baixo).",
      regraDeOuro: "300% é o padrão. Aumente para 400-500% em peças muito finas ou decorativas.",
      comoConfigurar: "Prepare → Qualidade → Paredes e superfícies → Limiar de parede única.",
    },
  },
  {
    id: "avoid-crossing-walls",
    label: "Evitar atravessar paredes",
    value: "Desativado",
    type: "checkbox",
    content: {
      oQueE:
        "Faz o bico contornar paredes já impressas durante os movimentos de viagem (travel), em vez de passar por cima delas.",
      porQueAjustar:
        "Evita que o bico quente risque ou derrube paredes finas já depositadas, preservando o acabamento superficial.",
      oQueInfluencia: "Qualidade estética, integridade de paredes delgadas e tempo de impressão.",
      oQueGera: "Superfície sem marcas de arraste (ativado) ou impressão mais rápida (desativado).",
      regraDeOuro:
        "Ative para peças estéticas ou com paredes <1mm. Desative para velocidade em peças brutas.",
      comoConfigurar:
        "Modo Avançado → Qualidade → Paredes e superfícies → Evitar atravessar paredes.",
    },
  },
  {
    id: "small-area-flow-comp",
    label: "Compensação de fluxo de área pequena",
    value: "Desativado",
    type: "checkbox",
    content: {
      oQueE:
        "Recurso que reduz o fluxo em áreas minúsculas (<1mm²) para evitar o acúmulo excessivo de plástico (blobs).",
      porQueAjustar:
        "Em detalhes muito pequenos, a pressão do bico tende a depositar material demais, criando bolhas que estragam a definição.",
      oQueInfluencia: "Definição de pontas finas, miniaturas e textos minúsculos.",
      oQueGera:
        "Detalhes limpos e pontiagudos (ativado) ou pontas arredondadas/com caroço (desativado).",
      regraDeOuro: "Essencial para miniaturas e estatuetas. Desnecessário para peças grandes.",
      comoConfigurar:
        "Modo Avançado (Beta) → Qualidade → Paredes e superfícies → Compensação de fluxo de área pequena (beta).",
    },
  },
];

export const internalBridgeFlowItem: CourseItem[] = [
  {
    id: "internal-bridge-flow",
    label: "Taxa de fluxo em ponte interna",
    value: "1,00",
    type: "number",
    content: {
      oQueE:
        "Multiplicador de fluxo para pontes não visíveis (internas), geralmente usadas para apoiar o teto sobre o preenchimento.",
      porQueAjustar:
        "Permite reforçar a estrutura interna sem se preocupar com a estética, garantindo que o topo da peça não afunde.",
      oQueInfluencia: "Solidez da base do topo e prevenção de 'pillowing'.",
      oQueGera:
        "Teto firme e sem buracos quando o fluxo está bem calibrado. Valor padrão da comunidade OrcaSlicer para eliminar pillowing é 1.05–1.15 (padrão do slicer clássico é 1.00).",
      regraDeOuro:
        "Comece em 1.00; suba para 1.05–1.10 se o topo apresentar afundamento sobre o infill. Não passe de 1.20 — gera bumps visíveis.",
      comoConfigurar: "Prepare → Qualidade → Ponte → Taxa de fluxo em ponte interna.",
    },
  },
];

export const extraBridgeLayersItem: CourseItem[] = [
  {
    id: "extra-bridge-layers-extra",
    label: "Camadas extras de ponte",
    value: "Desativado",
    type: "dropdown",
    content: {
      oQueE:
        "Adiciona camadas de reforço sobre a ponte original antes de retomar as camadas normais.",
      porQueAjustar:
        "Em vãos críticos, uma só camada pode ser frágil. Camadas extras criam uma 'laje' rígida que suporta melhor o resto da peça.",
      options: [
        { value: "Desativado", uso: "Uso geral", resultado: "Apenas uma camada de ponte" },
        { value: "1 camada", uso: "Vãos médios críticos", resultado: "Reforço moderado" },
        { value: "2–3 camadas", uso: "Vãos longos, peças mecânicas", resultado: "Reforço máximo" },
      ],
      oQueInfluencia: "Resistência estrutural da ponte, peso e tempo de impressão.",
      oQueGera: "Pontes indestrutíveis ao custo de tempo extra no fatiamento.",
      regraDeOuro: "Use 1 camada extra para vãos longos e peças que sofrerão carga.",
      comoConfigurar: "Modo Avançado → Qualidade → Ponte → Camadas extras de ponte (beta).",
    },
  },
];

export const filterInternalBridgesItem: CourseItem[] = [
  {
    id: "filter-internal-bridges",
    label: "Filtrar pontes internas pequenas",
    value: "Filtrar",
    type: "dropdown",
    content: {
      oQueE:
        "Remove pontes internas em regiões minúsculas onde elas não teriam utilidade estrutural.",
      porQueAjustar:
        "Economiza tempo e evita que o bico faça movimentos desnecessários em buracos muito pequenos onde o plástico já se sustenta sozinho.",
      oQueInfluencia: "Tempo de impressão e fluidez do G-code.",
      oQueGera: "G-code mais limpo e menos blobs em áreas pequenas.",
      regraDeOuro:
        "Mantenha em 'Filtrar'. Só altere para 'Não filtrar' se notar buracos internos indesejados.",
      comoConfigurar: "Prepare → Qualidade → Ponte → Filtrar pontes internas pequenas.",
    },
  },
];

export const ponteAdvancedItems: CourseItem[] = [
  {
    id: "bridge-angle",
    label: "Ângulo da ponte",
    value: "0° (Automático)",
    type: "number",
    content: {
      oQueE:
        "Define a direção das linhas de extrusão que formam a ponte. O padrão 0° faz o OrcaSlicer detectar automaticamente o melhor ângulo (geralmente o caminho mais curto entre duas paredes).",
      porQueAjustar:
        "O ângulo correto garante que a ponte se apoie firmemente nas paredes. Um ângulo errado pode fazer a ponte tentar 'flutuar' no ar sem ancoragem, resultando em falha total.",
      oQueInfluencia: "Sucesso da ponte, ancoragem e acabamento inferior.",
      oQueGera:
        "Ponte perfeitamente ancorada (automático) ou ponte que falha por falta de apoio (ângulo incorreto).",
      regraDeOuro:
        "Mantenha em 0° para detecção automática. Só altere manualmente se o slicer escolher um caminho ineficiente.",
      comoConfigurar: "Prepare → Qualidade → Ponte → Ângulo da ponte.",
    },
  },
  {
    id: "relative-bridge-angle",
    label: "Ângulo relativo de ponte",
    value: "Desativado",
    type: "checkbox",
    content: {
      oQueE:
        "Quando ativado, os ângulos das pontes são interpretados em relação à geometria local da ponte, em vez de um ângulo absoluto em relação à mesa.",
      porQueAjustar:
        "Útil para peças complexas onde diferentes pontes estão em direções variadas. Permite que cada ponte seja otimizada individualmente conforme sua própria orientação.",
      oQueInfluencia: "Otimização local de cada ponte em peças complexas.",
      oQueGera:
        "Cada ponte recebe o melhor ângulo individualmente (ativado) ou um ângulo global único (desativado).",
      regraDeOuro: "Ative para peças orgânicas ou complexas com pontes em várias direções.",
      comoConfigurar: "Modo Avançado → Qualidade → Ponte → Ângulo relativo de ponte.",
    },
  },
];

export const overhangReversePairItem: CourseItem[] = [
  {
    id: "overhang-reverse-pair",
    label: "Reversão em par (Overhang)",
    value: "Desativado",
    type: "checkbox",
    content: {
      oQueE:
        "Alterna a direção de impressão (horário/anti-horário) entre camadas consecutivas apenas nas saliências.",
      porQueAjustar:
        "Cruzar a direção de deposição melhora a ancoragem mecânica entre as camadas que estão parcialmente no ar, aumentando a resistência e reduzindo tensões.",
      oQueInfluencia:
        "Adesão entre camadas em overhangs, resistência de saliências e empenamento (warping).",
      oQueGera:
        "Saliências mais coesas e menos propensas a delaminação, mas pode criar textura visual alternada.",
      regraDeOuro:
        "Ative para peças com curvas complexas ou materiais que empenam fácil (ABS/ASA).",
      comoConfigurar: "Modo Avançado → Qualidade → Saliências → Reversão em par.",
    },
  },
];

export const salienciasAdvancedItems: CourseItem[] = [
  {
    id: "overhang-reverse-internal-only",
    label: "Reverter apenas paredes internas",
    value: "Desativado",
    type: "checkbox",
    content: {
      oQueE:
        "Aplica a inversão de direção apenas nas paredes internas, mantendo a parede externa sempre no mesmo sentido.",
      porQueAjustar:
        "Mantém os benefícios estruturais da reversão (ancoragem e redução de tensão) sem prejudicar a estética da superfície externa.",
      oQueInfluencia: "Estética da parede externa e resistência interna da saliência.",
      oQueGera: "Parede externa lisa e uniforme com reforço estrutural interno nas saliências.",
      regraDeOuro:
        "Ative se quiser os benefícios da reversão sem a textura alternada na face visível.",
      comoConfigurar: "Modo Avançado → Qualidade → Saliências → Reverter apenas paredes internas.",
    },
  },
  {
    id: "overhang-reverse-threshold",
    label: "Limiar de reversão de saliência",
    value: "0%",
    type: "percent",
    content: {
      oQueE:
        "Define a partir de qual nível de inclinação (overhang) a reversão de direção deve ser aplicada.",
      porQueAjustar:
        "Evita a reversão em áreas com pouco overhang onde ela não é necessária, focando o recurso apenas nos pontos realmente críticos.",
      oQueInfluencia: "Uniformidade da textura da parede e eficácia da reversão.",
      oQueGera: "Reversão aplicada apenas onde o overhang supera o limite definido.",
      regraDeOuro:
        "Use 0% para reverter tudo (melhor para warping) ou ajuste conforme a inclinação crítica do seu modelo.",
      comoConfigurar: "Modo Avançado → Qualidade → Saliências → Limiar de reversão de saliência.",
    },
  },
];

export const velocidadeOverhangItems: CourseItem[] = [
  {
    id: "slow-down-overhangs",
    label: "Reduzir velocidade em saliências",
    value: "Ativado",
    type: "checkbox",
    content: {
      oQueE:
        "Diminui automaticamente a velocidade do bico ao detectar regiões de saliência (overhang). Permite configurar velocidades específicas para diferentes graus de inclinação (10%, 25%, 50% e 75% de saliência).",
      porQueAjustar:
        "Dá tempo para o ventilador resfriar o plástico antes que ele ceda pela gravidade. Saliências severas (75%) precisam de velocidades muito baixas para manter a forma.",
      oQueInfluencia: "Sucesso em ângulos inclinados e qualidade da superfície inferior.",
      oQueGera: "Saliências perfeitas sem necessidade de suporte (ativado).",
      regraDeOuro:
        "Sempre ativado. Use velocidades decrescentes conforme a saliência aumenta (ex: 30 mm/s para 25%, 10 mm/s para 75%).",
      comoConfigurar:
        "Prepare → Velocidade → Reduzir velocidade em saliências (campos de 10%, 25%, 50%, 75%).",
    },
  },
  {
    id: "extrusion-rate-smoothing",
    label: "Suavização da extrusão",
    value: "0.2",
    type: "number",
    content: {
      oQueE:
        "Parâmetro avançado que suaviza as variações de fluxo durante a extrusão, reduzindo picos de pressão quando o bico acelera ou desacelera.",
      porQueAjustar:
        "Suavização as transições de fluxo e reduz marcas em curvas e cantos vivos. Funciona em conjunto com o Pressure Advance para evitar o acúmulo de plástico em mudanças bruscas de direção.",
      oQueInfluencia:
        "Acabamento de cantos, bleeding de material e estabilidade do fluxo em alta velocidade.",
      oQueGera: "Cantos nítidos sem excesso de plástico e transições de camada mais fluidas.",
      regraDeOuro:
        "Use entre 0.1 e 0.3. ATENÇÃO: Calibre o Pressure Advance primeiro, ou a suavização pode esconder problemas de calibração.",
      comoConfigurar: "Modo Avançado → Velocidade → Avançado → Suavização da extrusão.",
    },
  },
];
