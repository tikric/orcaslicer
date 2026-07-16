import { CourseGroup } from "../courseData";

export const qualidadeExtraGroups: CourseGroup[] = [
  {
    id: "precisao-extra",
    label: "Precisão (Avançado)",
    items: [
      {
        id: "slice-gap-closing-radius",
        label: "Raio de fechamento de vãos",
        value: "0,049 mm",
        type: "number",
        content: {
          oQueE:
            "Variável interna slice_closing_radius. Rachaduras (cracks) menores que 2× este valor são preenchidas durante a triangulação do modelo — ou seja, o Orca corrige buracos microscópicos até 2× o raio configurado.",
          porQueAjustar:
            "Modelos STL têm imperfeições microscópicas na malha, especialmente quando exportados de softwares como Blender ou Fusion 360. Este parâmetro decide até que tamanho de 'buraquinho' o Orca conserta antes de fatiar — sem isso, peças mostram lacunas nas paredes; com valor alto demais, detalhes finos e textos gravados desaparecem.",
          options: [
            {
              value: "0,02 mm",
              uso: "Modelos STEP/3MF precisos, miniaturas, joias",
              resultado: "Fechamento mínimo — preserva textos e detalhes < 0,1 mm",
            },
            {
              value: "0,049 mm",
              uso: "Uso geral — PADRÃO do OrcaSlicer",
              resultado: "Equilíbrio entre detalhe e correção de malha",
            },
            {
              value: "0,10 mm",
              uso: "STLs baixados da Thingiverse/Printables com furos na malha",
              resultado: "Preenchimento agressivo, mas pode fundir letras pequenas",
            },
          ],
          oQueInfluencia:
            "Qualidade do modelo (STEP vs STL), textos e letras pequenas, paredes finas muito próximas e a decisão do fatiador entre 'fechar buraco' ou 'manter vão'.",
          oQueGera:
            "Valores baixos preservam detalhes mas podem deixar lacunas; valores altos fecham vãos mas podem unir o que deveria ser separado.",
          regraDeOuro:
            "0,049 mm é o ideal (padrão oficial). Reduza para 0,02 mm se textos pequenos estiverem 'fundindo'. Só aumente até 0,10 mm quando o modelo tiver falhas visíveis na pré-visualização.",
          comoConfigurar:
            "Processo → Qualidade → Precisão → Raio de fechamento de vãos de fatiamento.",
        },
      },
      {
        id: "resolution",
        label: "Resolução",
        value: "0,012 mm",
        type: "number",
        content: {
          oQueE:
            "Distância mínima entre dois pontos consecutivos que o fatiador preserva na trajetória. Valores menores mantêm mais vértices da malha original — controla quanto detalhe da geometria 3D sobrevive ao fatiamento.",
          porQueAjustar:
            "Define a suavidade das curvas no G-code. Resoluções muito baixas (0,005 mm) geram G-codes com milhões de segmentos que travam controladoras 8-bit e SD cards; muito altas (0,05 mm) geram curvas facetadas visíveis a olho nu em impressões grandes.",
          options: [
            {
              value: "0,005 mm",
              uso: "Joias, miniaturas ultra-detalhadas (28 mm scale, bicos ≤ 0,25 mm)",
              resultado: "Curvas perfeitas, arquivo enorme, exige controladora 32-bit",
            },
            {
              value: "0,012 mm",
              uso: "Uso geral — PADRÃO OrcaSlicer",
              resultado:
                "Excelente equilíbrio para impressoras modernas (Bambu, Voron, Ender 3 V3)",
            },
            {
              value: "0,025 mm",
              uso: "Peças grandes e simples (protótipos, funcionais)",
              resultado: "G-code leve, curvas levemente facetadas — invisível em bicos ≥ 0,6 mm",
            },
          ],
          oQueInfluencia:
            "Suavidade de curvas, tamanho do arquivo G-code, tempo de fatiamento, carga do processador da impressora e desempenho de Arc Fitting (G2/G3).",
          oQueGera:
            "Resolução baixa gera curvas suaves; resolução alta gera arquivos leves mas com facetas visíveis em superfícies curvas.",
          regraDeOuro:
            "0,012 mm para quase tudo. Reduza para 0,005 mm em joias e miniaturas. Aumente para 0,025 mm se sua impressora estiver com 'stuttering' (travadinhas) em curvas complexas.",
          comoConfigurar: "Processo → Qualidade → Precisão → Resolução.",
        },
      },
      {
        id: "precise-wall",
        label: "Parede precisa",
        value: "Desativado",
        type: "checkbox",
        content: {
          oQueE:
            "Recurso EXCLUSIVO do OrcaSlicer. Zera a sobreposição entre a parede externa e a parede interna adjacente quando se usa a ordem 'Interna-Externa'. Herdado do modelo de fluxo do Slic3r/PrusaSlicer, corrige um efeito colateral desse modelo.",
          porQueAjustar:
            "Slic3r/Orca assumem que a extrusão tem forma OVAL (não retangular como o Cura), o que causa overlap entre paredes. Sem o Precise Wall, a pressão da parede interna 'empurra' a externa para fora, causando erros de +0,05 a +0,15 mm no XY.",
          oQueInfluencia:
            "Precisão dimensional externa (XY), consistência visual das camadas, acabamento superficial e encaixe de peças mecânicas (parafusos, pinos, dobradiças).",
          oQueGera:
            "Ativado: paredes externas dimensionalmente exatas ao CAD. Desativado: peças saem consistentemente 0,05–0,15 mm maiores no XY.",
          regraDeOuro:
            "SEMPRE ativado para peças de encaixe, tolerâncias apertadas ou engrenagens. Requer ordem de parede 'Interna-Externa' (não funciona com 'Externa-Interna'). Combine com calibração de tolerância do filamento.",
          comoConfigurar: "Processo → Qualidade → Precisão → Parede precisa.",
        },
      },
      {
        id: "precise-z-height",
        label: "Altura Z precisa",
        value: "Desativado",
        type: "checkbox",
        content: {
          oQueE:
            "Ajusta a altura das 5 últimas camadas para que a altura Z final seja EXATAMENTE a do CAD, mesmo quando não é múltiplo da altura de camada. Ex: cubo de 20,1 mm com camada de 0,2 imprimiria 20,2 mm; ativado, sai 20,1 mm exato.",
          porQueAjustar:
            "Sem isso, a altura final é sempre arredondada para o múltiplo mais próximo da altura da camada. Em peças que empilham, encaixam por cima ou têm parafuso M3/M4 embutido, esse erro de até 0,2 mm em Z é crítico.",
          oQueInfluencia:
            "Precisão dimensional no eixo Z, especialmente em peças que precisam encaixar ou empilhar verticalmente, alojamentos de rolamento e furos cegos.",
          oQueGera:
            "Ativado: altura exata do CAD (as 5 últimas camadas variam levemente em altura). Desativado: altura arredondada — pode dar 10,00 ou 10,20 em vez dos 10,05 do modelo.",
          regraDeOuro:
            "Ative sempre que a precisão vertical for crítica. Não tem efeito colateral visível — pode ficar ativo por padrão em perfis técnicos.",
          comoConfigurar: "Processo → Qualidade → Precisão → Altura Z precisa.",
        },
      },
      {
        id: "polyholes",
        label: "Converter furos em polifuros",
        value: "Desativado",
        type: "checkbox",
        content: {
          oQueE:
            "Técnica matemática (originalmente do Hydraraptor / SuperSlicer) que substitui furos circulares por polígonos com poucos lados retos, dimensionados para que o polígono INSCRITO tenha o diâmetro exato do CAD após a contração do plástico. Só funciona em furos com eixo paralelo ao Z.",
          porQueAjustar:
            "FDM naturalmente produz furos menores que o CAD porque a extrusão em curva estica o filamento por dentro do furo. Polifuros contornam esse problema geometricamente, sem depender de calibração de fluxo ou compensação XY.",
          oQueInfluencia:
            "Precisão de furos para parafusos, pinos e eixos, especialmente furos pequenos (limite ajustável via Limiar de Polifuro). Furos abaixo do limiar recebem o tratamento; acima, ficam circulares.",
          oQueGera:
            "Ativado: furos encaixam parafusos M2/M3/M4 direto da impressora, sem alargar. Desativado: furos ficam ~0,15 mm menores e precisam de compensação XY ou broca manual.",
          regraDeOuro:
            "Ative para peças mecânicas com furos passantes verticais. Orca ajusta o número de lados automaticamente pelo diâmetro. Não funciona para furos inclinados ou com eixo horizontal.",
          comoConfigurar: "Processo → Qualidade → Precisão → Converter furos em polifuros.",
        },
      },
    ],
  },
  {
    id: "ironing-extra",
    label: "Alisamento (Ironing) Detalhado",
    items: [
      {
        id: "ironing-pattern",
        label: "Padrão de alisamento",
        value: "Retilinear",
        type: "dropdown",
        content: {
          oQueE:
            "Define o desenho que o bico faz ao alisar a superfície. Variável ironing_pattern. As duas opções disponíveis são Retilinear e Concêntrico.",
          porQueAjustar:
            "O padrão afeta como a luz reflete no topo da peça e a eficiência com que o bico cobre toda a área sólida.",
          options: [
            {
              value: "Retilinear",
              uso: "Superfícies quadradas/retangulares (uso geral)",
              resultado: "Brilho uniforme, cobertura total, marcas paralelas",
            },
            {
              value: "Concêntrico",
              uso: "Peças redondas ou orgânicas (lentes, tampas circulares)",
              resultado: "Acompanha o formato da peça, sem marca central óbvia em círculos",
            },
          ],
          oQueInfluencia:
            "Estética final do topo, reflexo de luz e possíveis marcas de início/fim de linha no alisamento.",
          oQueGera:
            "Retilinear gera um acabamento clássico com 'tiger striping' sutil se o ângulo estiver mal calibrado; Concêntrico pode deixar uma marca de junção no centro em áreas retangulares.",
          regraDeOuro:
            "Retilinear é o padrão ouro para quase tudo. Use Concêntrico apenas em peças redondas (relógios, tampas, lentes) ou quando o Retilinear estiver deixando riscos paralelos aparentes.",
          comoConfigurar: "Processo → Qualidade → Alisamento → Padrão.",
        },
      },
      {
        id: "ironing-flow",
        label: "Fluxo de alisamento",
        value: "15%",
        type: "percent",
        content: {
          oQueE:
            "Quantidade de plástico extrudado durante o alisamento, como porcentagem do fluxo normal (variável ironing_flow). O bico passa 'quase seco' derretendo as cristas da camada anterior e depositando um filme fino.",
          porQueAjustar:
            "É o 'tempero' do Ironing. Pouco fluxo deixa sulcos entre as passadas; muito fluxo cria caroços ou transborda nas bordas. Camadas mais finas exigem MAIS fluxo (menos volume por distância).",
          options: [
            {
              value: "8–10%",
              uso: "PLA premium (Bambu, Polymaker) com camada 0,2 mm",
              resultado: "Superfície ultra-limpa, mínimo risco de blob",
            },
            {
              value: "15%",
              uso: "Uso geral — PADRÃO OrcaSlicer",
              resultado: "Excelente preenchimento e brilho em PLA/PETG",
            },
            {
              value: "20–25%",
              uso: "PETG, ABS, ASA (contraem mais) ou camada ≤ 0,1 mm",
              resultado: "Preenche todos os micro-vales, risco de blobs nas bordas",
            },
            {
              value: "30%+",
              uso: "TPU e materiais flexíveis",
              resultado: "Necessário para vencer a elasticidade — quase sempre gera blobs",
            },
          ],
          oQueInfluencia:
            "Brilho da superfície, preenchimento dos micro-vales e acúmulo de plástico no bico.",
          oQueGera:
            "Fluxo correto gera acabamento espelhado; fluxo alto gera 'caroços' brilhantes e bordas grossas.",
          regraDeOuro:
            "Comece em 15% para PLA/PETG. Se vir sulcos, suba de 2% em 2%. Se vir excesso ou bordas transbordando, desça. Para camada 0,08 mm, comece em 20%.",
          comoConfigurar: "Processo → Qualidade → Alisamento → Fluxo.",
        },
      },
      {
        id: "ironing-line-spacing",
        label: "Espaçamento da linha de alisamento",
        value: "0,15 mm",
        type: "number",
        content: {
          oQueE:
            "Distância entre as passadas do bico durante o Ironing (variável ironing_spacing). A wiki oficial recomenda: valor ≤ diâmetro do bico para cobertura ótima.",
          porQueAjustar:
            "Define a 'densidade' do alisamento. Quanto mais perto as linhas, mais vezes o calor do bico passa no mesmo lugar derretendo o plástico. Espaçamento maior que o bico deixa faixas não derretidas.",
          options: [
            {
              value: "0,10 mm",
              uso: "Máximo brilho (bico 0,4 mm — 4 passadas por largura)",
              resultado: "Superfície ultra-lisa 'efeito vidro', muito lento",
            },
            {
              value: "0,15 mm",
              uso: "Equilíbrio padrão para bico 0,4 mm",
              resultado: "Bom acabamento em tempo aceitável",
            },
            {
              value: "0,20 mm",
              uso: "Bico 0,4 mm — alisamento rápido, ou bico 0,6 mm padrão",
              resultado: "Melhora o topo mas pode deixar riscos finos",
            },
            {
              value: "0,30 mm",
              uso: "Bico 0,6 mm — máximo permitido pela regra ≤ diâmetro",
              resultado: "Rápido, marcas visíveis com luz rasante",
            },
          ],
          oQueInfluencia:
            "Tempo extra de impressão (pode dobrar em peças planas), qualidade da fusão entre as linhas do topo e risco de heat creep no hotend.",
          oQueGera:
            "Espaçamento curto gera um topo contínuo; espaçamento largo economiza tempo mas pode não apagar todas as linhas.",
          regraDeOuro:
            "Regra da wiki: NUNCA use valor maior que o diâmetro do bico. 0,15 mm para bico 0,4 mm; 0,10 mm para 'efeito vidro'; 0,20–0,30 para bicos 0,6+.",
          comoConfigurar: "Processo → Qualidade → Alisamento → Espaçamento da linha.",
        },
      },
      {
        id: "ironing-inset",
        label: "Recuo do alisamento (Inset)",
        value: "0 mm",
        type: "number",
        content: {
          oQueE:
            "Distância interna da borda externa onde o alisamento é interrompido (variável ironing_inset). Cria uma 'margem de segurança' para o bico não esbarrar na parede externa.",
          porQueAjustar:
            "Evita que o bico 'esprema' plástico para fora da parede externa durante o alisamento — o que cria uma rebarba visível de +0,1 a +0,3 mm no topo da peça.",
          oQueInfluencia:
            "Qualidade das bordas superiores, precisão dimensional do topo e presença de rebarbas na junção topo-parede.",
          oQueGera:
            "Valor positivo deixa uma pequena margem sem alisar (segura); 0 mm alisa até o limite extremo (risco de rebarba mas topo 100% liso).",
          regraDeOuro:
            "Comece em 0 mm. Se ver rebarbas nas bordas do topo (arrastos ou bolinhas nos cantos), aumente para 0,2 mm. Em peças de encaixe, use 0,3 mm para preservar o XY.",
          comoConfigurar: "Processo → Qualidade → Alisamento → Recuo.",
        },
      },
      {
        id: "ironing-speed",
        label: "Velocidade de alisamento",
        value: "30 mm/s",
        type: "number",
        content: {
          oQueE:
            "Velocidade com que o bico se move ao fazer o Ironing. Compartilha o mesmo campo em Velocidade → Outras camadas.",
          porQueAjustar:
            "Ironing exige tempo para o calor do bico derreter as cristas do plástico. Rápido demais não aquece o suficiente; lento demais causa heat creep no hotend (risco de entupimento — alerta oficial da wiki).",
          oQueInfluencia:
            "Qualidade do derretimento superficial, tempo total da peça e temperatura interna do hotend (risco de clog).",
          oQueGera:
            "Velocidade baixa (20–30 mm/s) gera o melhor brilho; alta (50+ mm/s) só disfarça as linhas sem derreter as cristas.",
          regraDeOuro:
            "20–30 mm/s é o ponto ideal. Para PLA, não passe de 40 mm/s se quiser efeito espelhado. PETG/ABS podem ir até 35 mm/s. Se estiver entupindo depois de peças com muito ironing, aumente a velocidade OU melhore o cooling do hotend.",
          comoConfigurar: "Processo → Qualidade → Alisamento → Velocidade.",
        },
      },
      {
        id: "ironing-angle-offset",
        label: "Deslocamento do ângulo de alisamento",
        value: "0°",
        type: "number",
        content: {
          oQueE:
            "Adiciona um ângulo extra à direção do alisamento em relação ao ângulo do preenchimento sólido do topo (variável ironing_angle).",
          porQueAjustar:
            "Mudar o ângulo pode esconder melhor as linhas de preenchimento subjacentes ou reduzir o efeito 'tiger striping' (listras brilhantes/foscas alternadas causadas pela oscilação vertical do bico).",
          options: [
            {
              value: "0°",
              uso: "Uso geral — segue o infill do topo",
              resultado: "Alisamento paralelo às linhas de topo",
            },
            {
              value: "45°",
              uso: "Reduzir tiger striping",
              resultado: "Cruza o padrão do infill, disfarça marcas",
            },
            {
              value: "90°",
              uso: "Superfície com múltiplas orientações",
              resultado: "Perpendicular ao infill — acabamento uniforme",
            },
          ],
          oQueInfluencia:
            "Direção das marcas de alisamento, reflexo da luz e severidade do tiger striping.",
          oQueGera:
            "Ângulos diferentes mudam como a luz 'bate' na peça. 45° costuma ser o mais uniforme visualmente.",
          regraDeOuro:
            "0° é o padrão. Tente 45° se o alisamento padrão estiver deixando marcas paralelas evidentes ou tiger striping. Combine com 'Fixed Angle' para uniformidade total.",
          comoConfigurar: "Processo → Qualidade → Alisamento → Deslocamento do ângulo.",
        },
      },
      {
        id: "ironing-fixed-angle",
        label: "Ângulo fixo de alisamento",
        value: "0°",
        type: "number",
        content: {
          oQueE:
            "Define um ângulo absoluto (fixo) para o alisamento, ignorando a direção alternada do preenchimento (variável ironing_angle_fixed). Elimina o efeito de linhas alternadas entre camadas.",
          porQueAjustar:
            "O infill sólido do topo alterna direção camada a camada (45°/-45°). O ironing normal segue essa alternância — resultado: tiger striping. Com ângulo fixo, TODO ironing vai na mesma direção, resultando em uma superfície uniforme sem listras.",
          oQueInfluencia:
            "Uniformidade do brilho em peças com múltiplas superfícies no topo, severidade do tiger striping e aparência sob luz rasante.",
          oQueGera:
            "Acabamento visual idêntico em todas as áreas de Ironing; sem ele, o Ironing pode gerar listras alternadas.",
          regraDeOuro:
            "A wiki recomenda 0° ou 90° quando o infill sólido está em 45°. Use se tiver várias 'ilhas' no topo ou tiger striping evidente.",
          comoConfigurar: "Processo → Qualidade → Alisamento → Ângulo fixo.",
        },
      },
    ],
  },
  {
    id: "z-contouring",
    label: "Z Contouring / ZAA (Antialiasing em Z)",
    items: [
      {
        id: "z-contouring-enabled",
        label: "Contorno em Z",
        value: "Desativado",
        type: "checkbox",
        content: {
          oQueE:
            "Também chamado de ZAA (Z-layer Anti-Aliasing) — variável zaa_enabled. Ajusta o Z de pontos individuais da trajetória para que ela siga a superfície original do modelo em topos curvos ou inclinados, em vez de manter um Z constante por camada.",
          porQueAjustar:
            "Reduz o efeito 'escada' visível em domos, calotas, chanfros e rampas suaves, SEM diminuir a altura da camada do resto da peça (que multiplicaria o tempo total).",
          oQueInfluencia:
            "Acabamento de topos orgânicos, tempo de processamento do fatiador e tempo de impressão. Modo Expert obrigatório.",
          oQueGera:
            "Ativado gera superfícies curvas visualmente lisas; desativado deixa o 'efeito escada' clássico em topos curvos.",
          regraDeOuro:
            "Ative para peças com topos curvos (calotas, domos, capacetes de miniaturas). ATENÇÃO: só funciona em superfícies VOLTADAS PARA CIMA — não afeta curvas viradas para baixo (overhang).",
          comoConfigurar: "Processo → Qualidade → Alisamento → Contorno em Z.",
        },
      },
      {
        id: "minimize-wall-height-angle",
        label: "Minimizar ângulo de altura da parede",
        value: "0°",
        type: "number",
        content: {
          oQueE:
            "Variável zaa_minimize_perimeter_height. Reduz a altura dos perímetros (internos E externos) do topo em inclinações suaves para acompanhar a borda real do modelo.",
          porQueAjustar:
            "Em rampas suaves, a parede externa fica 'degraus' acima do preenchimento contornado. Este ajuste suaviza essa transição, aproximando a parede da superfície CAD.",
          oQueInfluencia:
            "Precisão do contorno em rampas suaves e suavidade da transição parede-topo.",
          oQueGera:
            "Valores acima de 0 (ex: 35°) atenuam os degraus em rampas; 0 desativa o recurso.",
          regraDeOuro:
            "A wiki cita 35° como ponto de partida razoável, mas o DEFAULT é 0 (desligado). Ative com 35° se notar paredes proeminentes ou 'altas' em rampas.",
          comoConfigurar:
            "Processo → Qualidade → Alisamento → Minimizar ângulo de altura da parede.",
        },
      },
      {
        id: "minimum-z-height",
        label: "Altura Z mínima",
        value: "0 mm",
        type: "number",
        content: {
          oQueE:
            "Variável zaa_min_z. Altura MÍNIMA local permitida para camadas contornadas. Também define o plano de fatiamento usado nas camadas contornadas.",
          porQueAjustar:
            "Controla quão 'fina' a camada pode ficar ao acompanhar uma curva. Evita camadas tão finas que o bico não consiga extrudar plástico o suficiente (falha de extrusão).",
          oQueInfluencia:
            "Resolução vertical do contorno e estabilidade da extrusão em curvas muito inclinadas.",
          oQueGera:
            "Valores baixos permitem contorno mais preciso (mais suave), com risco de sub-extrusão; valores altos mantêm a camada próxima da nominal e sacrificam suavidade.",
          regraDeOuro:
            "Mantenha em 0 (automático). Só ajuste se notar sub-extrusão ou 'buracos' nas partes mais inclinadas da curva.",
          comoConfigurar: "Processo → Qualidade → Alisamento → Altura Z mínima.",
        },
      },
      {
        id: "dont-alternate-fill-direction",
        label: "Não alternar direção de preenchimento",
        value: "Desativado",
        type: "checkbox",
        content: {
          oQueE:
            "Variável zaa_dont_alternate_fill_direction. Mantém a direção do preenchimento constante camada após camada nas regiões contornadas, em vez de alternar 45°/-45°. Só tem efeito onde o Z Contouring está ativo.",
          porQueAjustar:
            "Em topos curvos, a alternância de direção pode criar um aspecto 'xadrez' visível na superfície. Manter direção única resulta em padrão mais uniforme, mas com menor resistência mecânica na direção transversal.",
          oQueInfluencia: "Consistência visual do padrão de superfície em topos curvos.",
          oQueGera:
            "Ativado gera um padrão visual direcional único; desativado alterna a direção para maior resistência mecânica.",
          regraDeOuro:
            "Ative para peças decorativas com topos curvos. Deixe desativado em peças funcionais onde a resistência isotrópica importa.",
          comoConfigurar:
            "Processo → Qualidade → Alisamento → Não alternar direção de preenchimento.",
        },
      },
    ],
  },
];

// Named exports for individual placement in the main Qualidade tab
export const precisaoTopItems = qualidadeExtraGroups[0].items.slice(0, 2); // Raio, Resolução
export const precisaoBottomItems = qualidadeExtraGroups[0].items.slice(2); // Parede precisa, Altura Z precisa, Polifuros
export const alisamentoDetailItems = qualidadeExtraGroups[1].items;
export const zContouringGroup = qualidadeExtraGroups[2];
