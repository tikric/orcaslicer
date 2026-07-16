import {
  precisaoTopItems,
  precisaoBottomItems,
  alisamentoDetailItems,
  zContouringGroup,
} from "./extras/qualidade-extra";
import {
  geradorParedesArachneGroup,
  wallLoopDirectionItem,
  paredesSuperficiesTailItems,
  internalBridgeFlowItem,
  extraBridgeLayersItem,
  filterInternalBridgesItem,
  ponteAdvancedItems,
  overhangReversePairItem,
  salienciasAdvancedItems,
  velocidadeOverhangItems,
} from "./extras/resistencia-extra";
import {
  elephantFootExtraItems,
  paredesSuperficiesMissingItems,
  ponteMissingItems,
  salienciasMissingItems,
} from "./extras/qualidade-missing";
import {
  primeiraCamadaVelGroup,
  outrasCamadasVelGroup,
  saliaciasVelGroup,
  deslocamentoVelGroup,
  aceleracaoVelGroup,
  jerkXYGroup,
  avancadoVelGroup,
} from "./extras/velocidade-extra";
import {
  suporteBasicoGroup,
  jangadaSupGroup,
  filamentoSuporteSupGroup,
  alisamentoSuporteSupGroup,
  suporteAvancadoGroup,
} from "./extras/suporte-extra";
import {
  torrePreparoMMGroup,
  filamentoRecursosMMGroup,
  prevencaoVazamentoMMGroup,
  opcoesPurgaMMGroup,
  avancadoMMGroup,
} from "./extras/multimaterial-extra";
import {
  saiaOutGroup,
  bordaOutGroup,
  modoEspecialOutGroup,
  texturaDifusaOutGroup,
  opcoesGcodeOutGroup,
} from "./extras/outros-extra";

export interface CourseItem {
  id: string;
  label: string;
  value: string;
  type: "number" | "dropdown" | "checkbox" | "percent";
  content: {
    oQueE: string;
    porQueAjustar: string;
    options?: { value: string; uso: string; resultado: string }[];
    oQueInfluencia: string;
    oQueGera: string;
    regraDeOuro: string;
    comoConfigurar?: string;
  };
}

export interface CourseGroup {
  id: string;
  label: string;
  items: CourseItem[];
}

export interface CourseTab {
  id: string;
  label: string;
  icon: string;
  tela: string;
  groups: CourseGroup[];
}

const filamentoBasicoOutGroup: CourseGroup = {
  id: "filamento-basico",
  label: "Filamento — básico",
  items: [
    {
      id: "nozzle-temp",
      label: "Temperatura do bico (Nozzle)",
      value: "210 °C",
      type: "number",
      content: {
        oQueE:
          "Temperatura do hotend durante a impressão. Define fluidez do plástico e adesão entre camadas.",
        porQueAjustar:
          "Cada filamento tem faixa própria. Baixa demais gera underextrusion e camadas soltas; alta demais causa stringing e queima.",
        options: [
          { value: "200 °C", uso: "PLA padrão", resultado: "Impressão limpa, pouco stringing" },
          { value: "210 °C", uso: "PLA em velocidade média", resultado: "Fluxo estável" },
          { value: "235 °C", uso: "PETG Fosco", resultado: "Adesão forte e brilho baixo" },
          { value: "245 °C", uso: "PETG cristal / ABS", resultado: "Camadas bem soldadas" },
        ],
        oQueInfluencia: "Adesão entre camadas, stringing, brilho e resistência.",
        oQueGera: "Baixa: camadas soltas. Alta: stringing e queima do material.",
        regraDeOuro: "PLA 200–215 °C · PETG 230–245 °C · ABS 240–250 °C.",
      },
    },
    {
      id: "bed-temp",
      label: "Temperatura da mesa",
      value: "60 °C",
      type: "number",
      content: {
        oQueE: "Temperatura da mesa aquecida. Mantém a primeira camada colada e reduz warping.",
        porQueAjustar:
          "Sem calor suficiente a peça descola; excesso deforma a base e cria pé de elefante.",
        options: [
          { value: "60 °C", uso: "PLA", resultado: "Adesão firme sem deformar" },
          { value: "75 °C", uso: "PETG Fosco", resultado: "Cola bem sem grudar demais" },
          { value: "80 °C", uso: "PETG comum", resultado: "Boa adesão" },
          { value: "100 °C", uso: "ABS/ASA", resultado: "Evita warping" },
        ],
        oQueInfluencia: "Adesão da primeira camada, warping e pé de elefante.",
        oQueGera: "Baixa: descola. Alta: base achatada e difícil de soltar.",
        regraDeOuro: "PLA 55–65 °C · PETG 70–80 °C · ABS 95–105 °C.",
      },
    },
    {
      id: "fan-speed",
      label: "Velocidade da ventoinha (Fan)",
      value: "100%",
      type: "percent",
      content: {
        oQueE: "Ventoinha de camada que resfria o filamento recém-depositado.",
        porQueAjustar:
          "Muito ar enfraquece a solda entre camadas; pouco ar deixa o material mole e sem definição.",
        options: [
          { value: "100%", uso: "PLA", resultado: "Overhangs limpos" },
          { value: "40–50%", uso: "PETG Fosco", resultado: "Camadas soldadas com bom acabamento" },
          { value: "30%", uso: "PETG estrutural", resultado: "Resistência máxima entre camadas" },
          { value: "0–20%", uso: "ABS/ASA", resultado: "Evita warping e trincas" },
        ],
        oQueInfluencia: "Adesão entre camadas, qualidade de overhangs e stringing.",
        oQueGera: "Alto: camadas descolam. Baixo: peça mole e sem detalhe.",
        regraDeOuro: "PLA 100% · PETG 30–50% · ABS 0–20%.",
      },
    },
    {
      id: "filament-flow",
      label: "Flow (fluxo do filamento)",
      value: "100%",
      type: "percent",
      content: {
        oQueE:
          "Multiplicador global de extrusão. Ajusta o quanto de filamento sai em relação ao teórico.",
        porQueAjustar:
          "Compensa variações do filamento. Fluxo alto causa sobre-extrusão; baixo, sub-extrusão.",
        options: [
          { value: "100%", uso: "Padrão calibrado", resultado: "Fluxo nominal" },
          { value: "98%", uso: "PETG Fosco", resultado: "Superfície uniforme, sem excesso" },
          { value: "95%", uso: "Filamento denso", resultado: "Reduz blobs" },
          { value: "102%", uso: "Filamento fino/seco", resultado: "Preenche vãos" },
        ],
        oQueInfluencia: "Blobs, dimensões finais e qualidade das paredes.",
        oQueGera: "Alto: blobs e pé de elefante. Baixo: gaps entre linhas.",
        regraDeOuro: "Sempre calibrar com Flow Test antes de mudar.",
      },
    },
  ],
};

export const courseTabs: CourseTab[] = [
  {
    id: "qualidade",
    label: "Qualidade",
    icon: "🔬",
    tela: "Telas 01-02",
    groups: [
      {
        id: "altura-camada",
        label: "Altura da Camada",
        items: [
          {
            id: "layer-height",
            label: "Altura da camada",
            value: "0,20 mm",
            type: "number",
            content: {
              oQueE:
                "Espessura vertical de cada fatia que o bico deposita — a distância que o eixo Z sobe a cada camada. Define a resolução vertical: menor = mais detalhes e mais tempo; maior = mais rápido e menos detalhe. Regra física: deve ficar entre 25% e 75% do diâmetro do bico (bico 0,4 mm → 0,1 a 0,3 mm). Abaixo de 25% há subextrusão; acima de 75% a linha não adere bem.",
              porQueAjustar:
                "É o parâmetro de maior impacto no binômio QUALIDADE × TEMPO. Dobrar a altura corta o tempo pela metade, mas multiplica a visibilidade dos 'degraus'. Camadas finas têm mais superfície de solda Z (peça mais resistente verticalmente); camadas grossas têm menos contato e ficam mais frágeis em Z.",
              options: [
                {
                  value: "0,08 mm",
                  uso: "Miniaturas, joias",
                  resultado: "Excelente qualidade (4× mais lento)",
                },
                {
                  value: "0,12 mm",
                  uso: "Peças visuais",
                  resultado: "Muito boa qualidade (2× mais lento)",
                },
                {
                  value: "0,16 mm",
                  uso: "Peças padrão c/ detalhe",
                  resultado: "Boa qualidade (1,6× mais lento)",
                },
                {
                  value: "0,20 mm",
                  uso: "Uso geral — PADRÃO",
                  resultado: "Qualidade regular (tempo base)",
                },
                {
                  value: "0,24 mm",
                  uso: "Protótipos grandes",
                  resultado: "Aceitável (0,8× mais rápido)",
                },
                {
                  value: "0,28 mm",
                  uso: "Rascunhos",
                  resultado: "Baixa qualidade (0,6× mais rápido)",
                },
              ],
              oQueInfluencia:
                "Diâmetro do bico (define mínimo/máximo), material (PLA aceita 0,08mm; PETG prefere ≥0,16mm; ABS gosta de grosso), detalhamento da peça, tempo de impressão e adesão entre camadas.",
              oQueGera:
                "Camadas finas geram superfícies lisas, transições suaves e peças resistentes em Z; camadas grossas geram impressão rápida com 'efeito escada' visível e fragilidade entre camadas.",
              regraDeOuro:
                "Para bico 0,4 mm: 0,12 mm = detalhe, 0,20 mm = padrão, 0,28 mm = velocidade. A altura é o equilíbrio entre o detalhe que você quer e o tempo que você tem.",
              comoConfigurar:
                "Aba Prepare → Processo → Qualidade → Altura da camada → Campo 'Altura da camada'. Salve presets: PLA_Qualidade (0,12), PLA_Padrao (0,20), PLA_Rapido (0,28).",
            },
          },
          {
            id: "first-layer-height",
            label: "Altura da primeira camada",
            value: "0,20 mm",
            type: "number",
            content: {
              oQueE:
                "Espessura da primeira fatia depositada diretamente na mesa. Valor independente das demais camadas — geralmente maior, para compensar imperfeições de nivelamento e garantir adesão. Funciona como base esmagada que preenche micro-poros da superfície.",
              porQueAjustar:
                "A primeira camada é literalmente o que segura a peça na mesa durante horas. Mais grossa = mais plástico esmagado = mais adesão; muito grossa = 'pé de elefante' (alargamento da base). Mantém-se geralmente entre 100% e 150% da altura normal.",
              options: [
                {
                  value: "100% (= altura normal)",
                  uso: "Mesas perfeitamente niveladas",
                  resultado: "Adesão média",
                },
                { value: "120%", uso: "Mesas com leve desnível", resultado: "Boa adesão" },
                { value: "140%", uso: "Mesas irregulares", resultado: "Excelente adesão" },
                {
                  value: "150%",
                  uso: "Problemas graves de nivelamento",
                  resultado: "Adesão máxima, pé de elefante",
                },
              ],
              oQueInfluencia:
                "Nivelamento da mesa, tipo de superfície (PEI, vidro, magnética), material, tamanho da peça e Z-Offset. PLA 100–120%; PETG 120–140%; ABS 140–150%; TPU 100%.",
              oQueGera:
                "Primeira camada grossa gera base robusta com pé de elefante; fina gera base precisa mas frágil ao descolamento.",
              regraDeOuro:
                "A primeira camada deve ser mais grossa que as demais para absorver imperfeições. 120–140% da altura normal = adesão garantida sem pé de elefante.",
              comoConfigurar:
                "Processo → Qualidade → Altura da camada → Campo 'Altura da primeira camada'. Ex.: 0,24 mm para altura normal 0,20 mm (120%).",
            },
          },
        ],
      },
      {
        id: "largura-linha",
        label: "Largura da Linha",
        items: [
          {
            id: "line-width-default",
            label: "Largura da linha › Padrão",
            value: "0,42 mm",
            type: "number",
            content: {
              oQueE:
                "Largura base de extrusão usada por todos os tipos de linha, salvo quando substituída. NÃO é igual ao diâmetro do bico — o plástico se expande lateralmente ao sair, então a largura típica é 105% do bico (0,42 mm para 0,4 mm).",
              porQueAjustar:
                "Define quanto plástico cai por mm impresso. Largura maior = paredes mais resistentes e impressão mais rápida; largura menor = mais detalhe e textos legíveis. Regra: largura deve ficar entre 100% e 150% do diâmetro do bico.",
              options: [
                {
                  value: "0,35 mm (87%)",
                  uso: "Detalhes muito finos, textos pequenos",
                  resultado: "Fino",
                },
                { value: "0,40 mm (100%)", uso: "Precisão máxima", resultado: "Mínimo" },
                {
                  value: "0,42 mm (105%) — PADRÃO",
                  uso: "Uso geral",
                  resultado: "Equilíbrio precisão × preenchimento",
                },
                {
                  value: "0,45 mm (112%)",
                  uso: "Reforço",
                  resultado: "Menos lacunas, melhor solda",
                },
                { value: "0,50 mm (125%)", uso: "Rápido", resultado: "Menos detalhe" },
                { value: "0,60 mm (150%)", uso: "Estrutural", resultado: "Visual grosso" },
              ],
              oQueInfluencia:
                "Diâmetro do bico, material, altura da camada (largura = 2–4× altura) e algoritmo de paredes (Arachne vs Classic). Bico menor → largura menor → mais detalhe.",
              oQueGera:
                "Linhas finas geram superfícies lisas com risco de lacunas; linhas grossas geram paredes resistentes com textura visível.",
              regraDeOuro:
                "Padrão entre 100% e 120% do bico. Para bico 0,4 mm: 0,42 mm. Finura para detalhes, grossura para resistência.",
              comoConfigurar:
                "Processo → Qualidade → Largura da linha → Campo 'Padrão'. Ex.: 0,42 mm (105% do bico 0,4).",
            },
          },
          {
            id: "line-width-first-layer",
            label: "Largura da linha › Primeira camada",
            value: "0,50 mm",
            type: "number",
            content: {
              oQueE:
                "Largura exclusiva da extrusão na primeira camada. Mais grossa que o padrão para esmagar plástico contra a mesa, preencher micro-poros e tolerar Z-Offset imperfeito.",
              porQueAjustar:
                "Mais área de contato = mais adesão. Mas largura excessiva cria pé de elefante. Equilíbrio típico: 120–140% da largura padrão.",
              options: [
                {
                  value: "0,42 mm",
                  uso: "Mesas perfeitas (100% do padrão)",
                  resultado: "Adesão média",
                },
                { value: "0,50 mm", uso: "Mesas boas (120% do padrão)", resultado: "Boa adesão" },
                {
                  value: "0,59 mm",
                  uso: "Mesas regulares (140% do padrão)",
                  resultado: "Excelente adesão",
                },
                {
                  value: "0,63 mm",
                  uso: "Mesas irregulares (150% do padrão)",
                  resultado: "Adesão máxima",
                },
              ],
              oQueInfluencia:
                "Nivelamento da mesa, material, tamanho da peça e Z-Offset. PLA 120–130%; PETG 130–140%; ABS 140–150%.",
              oQueGera:
                "Linhas grossas geram base que NÃO descola, mas se excessivas causam pé de elefante; linhas finas geram base precisa mas frágil.",
              regraDeOuro:
                "A primeira camada deve ser mais grossa que as demais. 120–140% da largura padrão é o ponto ideal para adesão sem pé de elefante.",
              comoConfigurar:
                "Processo → Qualidade → Largura da linha → Campo 'Primeira camada'. Ex.: 0,50 mm (≈120% de 0,42).",
            },
          },
          {
            id: "line-width-outer-wall",
            label: "Largura da linha › Parede externa",
            value: "0,40 mm",
            type: "number",
            content: {
              oQueE:
                "Largura exclusiva da parede mais externa — a única superfície visível da peça. Define a qualidade ESTÉTICA da impressão. Geralmente mais fina que as paredes internas para garantir lisura.",
              porQueAjustar:
                "É a 'cara' da peça. Mais fina = superfície mais lisa e detalhes nítidos; mais grossa = textura áspera mas paredes mais robustas. A resistência vem das paredes internas, não desta.",
              options: [
                {
                  value: "0,35 mm",
                  uso: "Miniaturas, joias, textos",
                  resultado: "Superfície quase espelhada",
                },
                { value: "0,38 mm", uso: "Alta qualidade", resultado: "Superfície lisa" },
                {
                  value: "0,42 mm — PADRÃO",
                  uso: "Uso geral",
                  resultado: "Equilíbrio qualidade × velocidade",
                },
                {
                  value: "0,45 mm",
                  uso: "Estruturais, protótipos",
                  resultado: "Mais rugosa, menos detalhe",
                },
              ],
              oQueInfluencia:
                "Qualidade visual, detalhes (textos, relevos, curvas), tempo de impressão e resistência das paredes externas.",
              oQueGera:
                "Parede externa fina gera peças visualmente premium; grossa gera peças resistentes a impacto mas com 'cara' de protótipo.",
              regraDeOuro:
                "A parede externa é o cartão de visita. Mantenha-a fina (0,38–0,42 mm) e lenta (40–60 mm/s) para o melhor acabamento.",
              comoConfigurar:
                "Processo → Qualidade → Largura da linha → Campo 'Parede externa'. Combine com velocidade reduzida (40–60 mm/s).",
            },
          },
          {
            id: "line-width-inner-wall",
            label: "Largura da linha › Parede interna",
            value: "0,50 mm",
            type: "number",
            content: {
              oQueE:
                "Largura das paredes internas (todos os perímetros que NÃO são o externo). Não são visíveis — sua única função é resistência estrutural e suporte ao topo/base.",
              porQueAjustar:
                "Como ninguém vê, podem ser mais grossas que a externa para ganhar resistência sem prejudicar a estética. É o truque clássico do Orca: externa fina + interna grossa = melhor dos dois mundos.",
              options: [
                { value: "0,42 mm", uso: "Visual consistente", resultado: "Igual à externa" },
                {
                  value: "0,45 mm — PADRÃO",
                  uso: "Bom equilíbrio",
                  resultado: "Resistência × velocidade",
                },
                { value: "0,50 mm", uso: "Maior resistência", resultado: "Mais grossa" },
                { value: "0,55 mm", uso: "Máxima resistência", resultado: "Grossa" },
              ],
              oQueInfluencia:
                "Resistência interna, tempo de impressão (menos passadas) e volume de filamento.",
              oQueGera:
                "Internas mais grossas que a externa geram peças com aparência fina externamente e estrutura interna robusta.",
              regraDeOuro:
                "Paredes internas podem ser MAIS grossas que as externas. 0,45–0,50 mm para resistência sem sacrificar qualidade visual.",
              comoConfigurar: "Processo → Qualidade → Largura da linha → Campo 'Parede interna'.",
            },
          },
          {
            id: "line-width-top",
            label: "Largura da linha › Superfície superior",
            value: "0,40 mm",
            type: "number",
            content: {
              oQueE:
                "Largura das linhas que formam a 'tampa' visível da peça (camadas sólidas do topo). É a segunda 'cara' da peça.",
              porQueAjustar:
                "Linhas finas no topo eliminam pillowing e gaps entre passadas. Se for usar Ironing depois, esta largura define a qualidade do alisamento.",
              options: [
                { value: "0,35 mm", uso: "Ideal p/ Ironing", resultado: "Topo espelhado" },
                { value: "0,38 mm", uso: "Alta qualidade", resultado: "Topo liso" },
                {
                  value: "0,42 mm — PADRÃO",
                  uso: "Consistência com a parede",
                  resultado: "Bom equilíbrio",
                },
              ],
              oQueInfluencia:
                "Aparência do topo (pillowing, gaps, brilho) e qualidade do Ironing posterior.",
              oQueGera:
                "Linhas finas no topo geram superfícies limpas, sem buracos, prontas para Ironing perfeito.",
              regraDeOuro:
                "O topo deve ser tão liso quanto a parede externa. Use a mesma largura ou ligeiramente menor para melhor acabamento.",
              comoConfigurar:
                "Processo → Qualidade → Largura da linha → Campo 'Superfície superior'.",
            },
          },
          {
            id: "line-width-sparse-infill",
            label: "Largura da linha › Preenchimento esparso",
            value: "0,50 mm",
            type: "number",
            content: {
              oQueE:
                "Largura das linhas do infill (estrutura interna oca). Como não é visível e só precisa ser estrutural, pode ser mais grosso que o padrão para acelerar a impressão.",
              porQueAjustar:
                "Infill costuma representar 40–60% do tempo total. Engrossar a linha do infill reduz drasticamente esse tempo com perda mínima de resistência.",
              options: [
                {
                  value: "0,42 mm (100%)",
                  uso: "Máxima precisão",
                  resultado: "Padrão conservador",
                },
                {
                  value: "0,45–0,50 mm (110–120%) — PADRÃO",
                  uso: "Aceleração padrão",
                  resultado: "−15% de tempo no infill",
                },
                {
                  value: "0,60 mm+ (≥150%)",
                  uso: "Aceleração extrema",
                  resultado: "Risco de pillowing no topo",
                },
              ],
              oQueInfluencia:
                "Tempo total de impressão, volume de filamento e resistência estrutural.",
              oQueGera:
                "Infill mais grosso gera impressões muito mais rápidas com resistência similar; muito grosso gera pillowing na primeira camada sólida acima.",
              regraDeOuro:
                "O infill pode ser mais grosso que a parede para economizar tempo. 0,45–0,50 mm para um bom equilíbrio.",
              comoConfigurar:
                "Processo → Qualidade → Largura da linha → Campo 'Preenchimento esparso'.",
            },
          },
          {
            id: "line-width-solid-infill",
            label: "Largura da linha › Preenchimento sólido",
            value: "0,40 mm",
            type: "number",
            content: {
              oQueE:
                "Largura das camadas 100% sólidas (topo, base, paredes finas convertidas em sólido). Diferente do preenchimento esparso, estas camadas são visíveis no topo/base.",
              porQueAjustar:
                "Manter igual à parede externa garante consistência visual entre laterais e topo/base, sem gaps ou over-extrusion na interface.",
              options: [
                {
                  value: "0,38 mm",
                  uso: "Topo espelhado, ideal p/ Ironing",
                  resultado: "Muito fino",
                },
                {
                  value: "0,42 mm — PADRÃO",
                  uso: "Consistência com parede externa",
                  resultado: "Transição invisível entre lateral e topo",
                },
                {
                  value: "0,45 mm",
                  uso: "Mais rápido, menos detalhe",
                  resultado: "Levemente mais grosso",
                },
              ],
              oQueInfluencia:
                "Qualidade visual das camadas que formam topo/base, ocorrência de gaps ou over-extrusion.",
              oQueGera:
                "Mesmo valor da parede externa gera transição invisível entre lateral e topo/base.",
              regraDeOuro:
                "Use o mesmo valor da parede externa para topo/base/sólidos visualmente uniformes.",
              comoConfigurar:
                "Processo → Qualidade → Largura da linha → Campo 'Preenchimento sólido'.",
            },
          },
          {
            id: "line-width-support",
            label: "Largura da linha › Suporte",
            value: "0,42 mm",
            type: "number",
            content: {
              oQueE:
                "Largura das estruturas temporárias de suporte. Como serão removidas, o compromisso é: forte o bastante para sustentar, fino o bastante para soltar.",
              porQueAjustar:
                "Suporte muito grosso resiste à remoção e descasca a peça; muito fino desaba durante a impressão. Para suporte normal, 85–95% do bico costuma ser o ponto ótimo.",
              options: [
                { value: "0,35 mm", uso: "Fácil remover, menos material", resultado: "Fino" },
                {
                  value: "0,42 mm — PADRÃO",
                  uso: "Equilíbrio estabilidade × remoção",
                  resultado: "Padrão",
                },
                { value: "0,50 mm", uso: "Suporte muito estável", resultado: "Difícil de soltar" },
              ],
              oQueInfluencia:
                "Facilidade de remoção dos suportes e marca/cicatriz na peça após a remoção.",
              oQueGera:
                "Suportes finos geram remoção limpa; grossos exigem alicate e podem descascar a superfície.",
              regraDeOuro:
                "Suportes descartáveis podem ser finos (0,35–0,40 mm) para facilitar a remoção e economizar material.",
              comoConfigurar: "Processo → Qualidade → Largura da linha → Campo 'Suporte'.",
            },
          },
          {
            id: "line-width-bridge",
            label: "Largura da linha › Ponte",
            value: "100%",
            type: "percent",
            content: {
              oQueE:
                "Multiplicador (em %) aplicado à largura da extrusão quando o OrcaSlicer detecta uma ponte — uma linha que cruza um vazio sem suporte abaixo. A ponte é esticada entre duas paredes, como uma corda no ar. 100% mantém a largura nominal; 85–95% gera linha mais fina que estica melhor sobre o vão; abaixo de 85% a linha tende a romper.",
              porQueAjustar:
                "Linha mais grossa tem mais inércia e pode cair antes de solidificar. Linha mais fina estica como um fio, atravessando vãos maiores com menos peso para segurar. O segredo é o ponto onde a linha estica sem romper.",
              options: [
                {
                  value: "70–80%",
                  uso: "Vãos > 80 mm com risco de queda",
                  resultado: "Linha muito fina, estica bem",
                },
                {
                  value: "85–95% — PONTO ÓTIMO",
                  uso: "Vãos 30–80 mm",
                  resultado: "Linha esticada, boa travessia",
                },
                {
                  value: "95–100%",
                  uso: "Vãos < 30 mm, pontes estruturais",
                  resultado: "Linha nominal, estrutura sólida",
                },
              ],
              oQueInfluencia:
                "Capacidade de cruzar vãos sem cair, qualidade do acabamento das pontes e tempo de solidificação no ar. Fan a 100% para solidificar rápido.",
              oQueGera:
                "Larguras baixas geram pontes que atravessam vãos longos com baixa flecha; 100% gera estrutura sólida mas pontes longas cedem.",
              regraDeOuro:
                "85% de largura + 40 mm/s + 100% de fan = ponte que atravessa e solidifica.",
              comoConfigurar:
                "Processo → Qualidade → Largura da linha → Campo 'Ponte'. 85% para vãos médios, 90% para estruturais.",
            },
          },
        ],
      },
      {
        id: "costura",
        label: "Costura",
        items: [
          {
            id: "seam-position",
            label: "Posição da costura",
            value: "Alinhada",
            type: "dropdown",
            content: {
              oQueE:
                "Define ONDE o bico inicia e termina cada perímetro externo. Cada loop precisa começar/fechar em um ponto, e nesse ponto há uma micro-sobra de plástico — a 'cicatriz' da impressão. Este parâmetro decide se essa cicatriz fica oculta, espalhada ou alinhada.",
              porQueAjustar:
                "É puramente estético — mas com impacto enorme. Uma costura mal posicionada destrói visualmente uma peça boa. Uma costura bem posicionada deixa a peça aparentemente sem emenda.",
              options: [
                {
                  value: "Aligned (Alinhada)",
                  uso: "Peças com cantos",
                  resultado: "Linha vertical num canto",
                },
                {
                  value: "Rear (Traseira)",
                  uso: "Peças com face oculta",
                  resultado: "Linha vertical atrás",
                },
                {
                  value: "Nearest (Mais próxima)",
                  uso: "Peças técnicas",
                  resultado: "Costura espalhada, tempo otimizado",
                },
                {
                  value: "Random (Aleatória)",
                  uso: "Cilindros, esferas, vasos",
                  resultado: "Pontos minúsculos invisíveis",
                },
              ],
              oQueInfluencia:
                "Geometria da peça (cantos vs redondos), estética (face visível) e resistência (costura alinhada cria linha de fratura).",
              oQueGera:
                "Aligned gera linha vertical visível em um canto; Random gera micro-pontos invisíveis; Rear gera frente totalmente lisa.",
              regraDeOuro:
                "Cantos = Aligned. Redondos = Random. Frente definida = Rear. Posicione a costura onde ninguém vai ver.",
              comoConfigurar:
                "Processo → Qualidade → Costura → Posição da costura. Escolher Aligned, Rear, Nearest ou Random.",
            },
          },
          {
            id: "scarf-seam",
            label: "Costura cachecol (Scarf Seam)",
            value: "Nenhum",
            type: "dropdown",
            content: {
              oQueE:
                "Recurso experimental que substitui a costura tradicional (corte vertical abrupto) por uma transição em RAMPA — o bico sobe/desce gradualmente no início e fim da parede, como um lenço (cachecol) que se sobrepõe.",
              porQueAjustar:
                "É a única forma de tornar a costura praticamente INVISÍVEL em peças cilíndricas. Em vasos, lentes e cones, transforma uma 'cicatriz' em uma transição imperceptível.",
              options: [
                { value: "Nenhum", uso: "Padrão", resultado: "Costura tradicional, corte abrupto" },
                {
                  value: "Contornos (Contour)",
                  uso: "Vasos, cilindros",
                  resultado: "Scarf apenas em contornos fechados",
                },
                {
                  value: "Tudo (All)",
                  uso: "Máxima invisibilidade",
                  resultado: "Em todas as paredes — exige PA calibrado",
                },
              ],
              oQueInfluencia:
                "Visibilidade da costura, tempo de impressão (Scarf adiciona movimento extra) e exigência de calibração (PA mal calibrado destrói o efeito).",
              oQueGera:
                "Scarf gera junções INVISÍVEIS em formas cilíndricas — a parede aparenta uma espiral contínua. Sem Scarf, mesmo o melhor Aligned deixa linha visível.",
              regraDeOuro:
                "Use Scarf 'Contornos' em vasos e cilindros — a costura desaparece. Em PLA bem calibrado, ative 'Tudo'.",
              comoConfigurar:
                "Processo → Qualidade → Costura → Costura junta cachecol (Scarf Seam).",
            },
          },
          {
            id: "staggered-seam",
            label: "Costuras internas escalonadas",
            value: "Desativado",
            type: "checkbox",
            content: {
              oQueE:
                "Distribui as costuras das paredes internas em ângulos/posições diferentes a cada camada, em vez de alinhá-las verticalmente com a costura externa. Evita que todas as costuras formem uma 'linha de fraqueza' contínua no mesmo eixo Z.",
              porQueAjustar:
                "Costuras alinhadas (externa + internas no mesmo ângulo) criam um plano de fragilidade vertical. Escalonar transforma isso num padrão helicoidal, distribuindo tensões.",
              options: [
                {
                  value: "Desativado",
                  uso: "Padrão",
                  resultado: "Todas as paredes começam no mesmo ângulo → ponto fraco vertical",
                },
                {
                  value: "Ativado",
                  uso: "Peças estruturais",
                  resultado: "Internas em ângulos alternados → padrão helicoidal mais resistente",
                },
              ],
              oQueInfluencia:
                "Resistência estrutural na linha da costura, uniformidade do fluxo e distribuição de tensões.",
              oQueGera:
                "Ativar gera peças mecanicamente mais resistentes (sem 'falha contínua' vertical); desativar mantém aparência igual mas com risco de ruptura na linha da costura sob esforço.",
              regraDeOuro:
                "Ative SEMPRE em peças estruturais. Desligue apenas se você precisar de costura interna 100% alinhada por motivo estético específico.",
              comoConfigurar: "Processo → Qualidade → Costura → Costuras internas escalonadas.",
            },
          },
          {
            id: "seam-gap",
            label: "Vão entre costuras",
            value: "10%",
            type: "percent",
            content: {
              oQueE:
                "Pequena folga (em % da largura da linha) deixada entre o ponto onde o perímetro termina e onde ele começou, em vez de fechar o círculo perfeitamente sobre si mesmo.",
              porQueAjustar:
                "Fechar o loop exatamente no mesmo ponto de início causa uma pequena bolha de excesso de plástico (o bico passa duas vezes pelo mesmo lugar). Deixar um vão evita essa sobreposição e a 'verruga' na costura.",
              options: [
                {
                  value: "0%",
                  uso: "Materiais muito fluidos",
                  resultado: "Fecha o loop perfeitamente, risco de bolha",
                },
                {
                  value: "10% — PADRÃO",
                  uso: "Uso geral",
                  resultado: "Sem sobreposição, costura discreta",
                },
                {
                  value: "15–20%",
                  uso: "Materiais que escorrem (PETG, TPU)",
                  resultado: "Vão maior, sem babado",
                },
              ],
              oQueInfluencia:
                "Tamanho da 'bolha' na costura, precisão dimensional do contorno e acabamento visual no ponto de fechamento.",
              oQueGera:
                "Vão correto elimina o pingo de plástico na costura; vão excessivo pode deixar uma pequena lacuna visível.",
              regraDeOuro:
                "10% resolve a maioria dos casos. Aumente se notar uma 'verruga' sempre no mesmo ponto da peça.",
              comoConfigurar: "Processo → Qualidade → Costura → Vão entre costuras.",
            },
          },
          {
            id: "wipe-speed-role-based",
            label: "Velocidade de limpeza baseada na função",
            value: "Ativado",
            type: "checkbox",
            content: {
              oQueE:
                "Faz o movimento de limpeza (wipe) que acontece logo após a costura herdar a velocidade do tipo de linha que acabou de ser impressa (ex.: parede externa lenta = wipe lento), em vez de usar sempre uma velocidade fixa.",
              porQueAjustar:
                "Evita que um wipe rápido demais 'arraste' plástico ainda mole da parede externa recém-impressa (que costuma ser lenta e mais quente na superfície).",
              oQueInfluencia:
                "Suavidade do movimento pós-costura e risco de marcas de arraste na parede externa.",
              oQueGera:
                "Ativado gera uma transição de velocidade coerente entre extrusão e limpeza; desativado usa sempre a mesma velocidade de wipe, podendo destoar.",
              regraDeOuro: "Mantenha ativado — é mais seguro na maioria dos perfis.",
              comoConfigurar:
                "Processo → Qualidade → Costura → Velocidade de limpeza baseada na função.",
            },
          },
          {
            id: "wipe-speed",
            label: "Velocidade de limpeza",
            value: "80%",
            type: "percent",
            content: {
              oQueE:
                "Velocidade (em % da velocidade de impressão do trecho) do pequeno movimento sem extrusão que o bico faz logo após terminar a parede, para 'limpar' o excesso de plástico da ponta antes de seguir viagem.",
              porQueAjustar:
                "Um wipe rápido demais pode puxar um fio de plástico (stringing); lento demais desperdiça tempo e pode deixar o bico parado tempo demais sobre a peça, amolecendo a superfície.",
              options: [
                {
                  value: "60%",
                  uso: "Materiais com stringing (PETG, TPU)",
                  resultado: "Limpeza mais suave",
                },
                { value: "80% — PADRÃO", uso: "Uso geral", resultado: "Bom equilíbrio" },
                { value: "100%", uso: "PLA bem calibrado", resultado: "Limpeza rápida" },
              ],
              oQueInfluencia: "Stringing na costura, tempo de impressão e marcas de arraste.",
              oQueGera:
                "Velocidade correta gera costura limpa sem fiapos; velocidade errada gera fiapos ou marcas de arraste.",
              regraDeOuro:
                "80% funciona para a maioria dos materiais. Reduza se notar fiapos exatamente na posição da costura.",
              comoConfigurar: "Processo → Qualidade → Costura → Velocidade de limpeza.",
            },
          },
          {
            id: "wipe-on-loops",
            label: "Limpeza em voltas",
            value: "Desativado",
            type: "checkbox",
            content: {
              oQueE:
                "Faz o wipe seguir o próprio contorno da parede (voltando um trecho sobre o loop já impresso) em vez de fazer um movimento reto para fora da peça.",
              porQueAjustar:
                "Em peças pequenas ou com pouco espaço ao redor, um wipe reto pode colidir com outras partes do objeto. Seguir o loop mantém o movimento sempre dentro do contorno seguro.",
              oQueInfluencia:
                "Segurança do movimento de limpeza em peças compactas e risco de colisão em impressões com múltiplos objetos próximos.",
              oQueGera:
                "Ativado gera um wipe mais contido e seguro; desativado gera um wipe reto, geralmente mais eficiente em peças isoladas.",
              regraDeOuro:
                "Ative em placas cheias com peças próximas umas das outras. Mantenha desativado para peças isoladas.",
              comoConfigurar: "Processo → Qualidade → Costura → Limpeza em voltas.",
            },
          },
          {
            id: "wipe-before-outer-wall",
            label: "Limpeza antes da volta externa",
            value: "Desativado",
            type: "checkbox",
            content: {
              oQueE:
                "Executa o movimento de limpeza (wipe) ANTES de iniciar a parede externa (em vez de apenas ao final de cada perímetro), reduzindo a pressão residual no bico no momento mais crítico para a estética.",
              porQueAjustar:
                "A parede externa é a mais sensível a babados e pontos de início marcados. Limpar antes dela garante que o bico comece a extrusão mais visível da peça sem excesso de material acumulado na ponta.",
              oQueInfluencia:
                "Qualidade do ponto de início da parede externa e ocorrência de 'blobs' logo no começo do perímetro visível.",
              oQueGera:
                "Ativado gera um início de parede externa mais limpo; desativado mantém o comportamento padrão de limpeza apenas ao final dos perímetros.",
              regraDeOuro:
                "Ative se notar sempre um pequeno ponto/bolha no início da parede externa, no mesmo local da costura.",
              comoConfigurar: "Processo → Qualidade → Costura → Limpeza antes da volta externa.",
            },
          },
        ],
      },
      {
        id: "precisao",
        label: "Precisão",
        items: [
          ...precisaoTopItems,
          {
            id: "arc-fitting",
            label: "Ajuste de arco (Arc fitting)",
            value: "Ativado",
            type: "checkbox",
            content: {
              oQueE:
                "Função que converte sequências de muitos segmentos retos (G1) em comandos de arco (G2/G3). O Orca identifica trechos curvos e os substitui por um único comando matemático de arco, reduzindo o G-code em até 90% nas partes curvas.",
              porQueAjustar:
                "Sem Arc Fitting, uma circunferência vira centenas de pequenos G1 — arquivos enormes, processamento pesado, e em altas velocidades a impressora 'engasga' entre segmentos. Com Arc Fitting, vira 1 ou 2 comandos G2/G3 fluidos.",
              options: [
                {
                  value: "Ativado",
                  uso: "Peças com curvas, firmwares modernos",
                  resultado: "Converte segmentos em arcos G2/G3",
                },
                {
                  value: "Desativado",
                  uso: "Peças angulares ou firmware antigo sem G2/G3",
                  resultado: "Mantém somente G1",
                },
              ],
              oQueInfluencia:
                "Tamanho do G-code, suavidade das curvas em alta velocidade, compatibilidade com firmware e fluidez do movimento. Firmware moderno (Marlin 2+, Klipper) suporta G2/G3.",
              oQueGera:
                "Ativado gera arquivos pequenos, curvas suaves e movimentos fluidos; desativado gera arquivos pesados com possível 'engasgo' em curvas a alta velocidade.",
              regraDeOuro:
                "Ative Arc fitting para peças com curvas. Desative se o firmware não suportar G2/G3.",
              comoConfigurar:
                "Processo → Qualidade → Precisão → Ajuste de arco (Arc fitting). Marcar para ativar.",
            },
          },
          {
            id: "xy-hole-compensation",
            label: "Compensação de furos XY",
            value: "0 mm",
            type: "number",
            content: {
              oQueE:
                "Ajuste dimensional aplicado APENAS a furos internos (contornos fechados internos). Em FDM, furos sempre saem MENORES que o CAD por dois motivos físicos: contração do plástico ao esfriar + trajetória circular que puxa o filete para dentro. Esta compensação 'engorda' o furo no G-code para compensar.",
              porQueAjustar:
                "Sem compensação, um furo CAD de 3,0 mm imprime tipicamente 2,80–2,90 mm — parafuso M3 não entra. Com compensação positiva, o furo sai exatamente no diâmetro projetado.",
              options: [
                {
                  value: "0 mm",
                  uso: "Peças sem furos ou tolerâncias largas",
                  resultado: "Sem compensação",
                },
                {
                  value: "+0,05 mm",
                  uso: "Furos até 5 mm em PLA",
                  resultado: "Pequena compensação",
                },
                {
                  value: "+0,10 mm",
                  uso: "Furos 5–10 mm, padrão p/ encaixes",
                  resultado: "Média compensação",
                },
                {
                  value: "+0,15–0,20 mm",
                  uso: "Furos grandes, ABS, Nylon",
                  resultado: "Grande compensação",
                },
              ],
              oQueInfluencia:
                "Diâmetro real do furo, encaixe de parafusos/pinos/eixos e qualidade do encaixe mecânico. PLA pouco; ABS/Nylon muito.",
              oQueGera:
                "Compensação correta gera encaixes precisos; insuficiente gera parafuso travado; excessiva gera furo solto.",
              regraDeOuro:
                "Furos sempre saem menores. +0,05 mm para furos pequenos, +0,10 mm para furos médios. Teste e ajuste.",
              comoConfigurar:
                "Calibrar Flow e PA PRIMEIRO. Depois: Processo → Qualidade → Precisão → Compensação de furos XY. Comece em +0,05 mm.",
            },
          },
          {
            id: "xy-contour-compensation",
            label: "Compensação de contornos XY",
            value: "0 mm",
            type: "number",
            content: {
              oQueE:
                "Ajuste dimensional aplicado ao contorno EXTERNO da peça. Positivo aumenta as dimensões externas; negativo reduz. Espelha a compensação de furos, mas para o perímetro externo.",
              porQueAjustar:
                "Encaixes do tipo 'peça dentro de outra peça' exigem folga (negativo) ou aperto (positivo). Em vez de mexer no CAD, ajusta-se aqui.",
              options: [
                { value: "0 mm", uso: "Peças isoladas, sem encaixe", resultado: "Sem compensação" },
                {
                  value: "−0,05 mm",
                  uso: "Encaixes justos (press-fit leve)",
                  resultado: "Peça levemente menor",
                },
                {
                  value: "−0,10 mm",
                  uso: "Encaixes deslizantes precisos",
                  resultado: "Peça menor",
                },
                {
                  value: "+0,05 mm",
                  uso: "Compensa peça que saiu pequena",
                  resultado: "Peça levemente maior",
                },
              ],
              oQueInfluencia:
                "Tamanho externo da peça, qualidade de encaixes macho-fêmea e tolerâncias mecânicas.",
              oQueGera:
                "Compensação negativa gera peças que encaixam dentro de outras; positiva gera peças que ganham dimensão para compensar contração.",
              regraDeOuro:
                "Para encaixes, use −0,05 mm. Para folgas, use +0,05 mm. Teste em peça pequena antes da peça final.",
              comoConfigurar: "Processo → Qualidade → Precisão → Compensação de contornos XY.",
            },
          },
          {
            id: "elephant-foot-compensation",
            label: "Compensação de pé de elefante",
            value: "0,1 mm",
            type: "number",
            content: {
              oQueE:
                "Reduz o tamanho da PRIMEIRA camada (e opcionalmente as próximas) para eliminar o 'pé de elefante' — alargamento da base causado pelo plástico esmagado contra a mesa quente.",
              porQueAjustar:
                "Sem compensação, a base da peça fica visivelmente mais larga que o resto, prejudicando encaixes que apoiam na mesa (ex.: pé de prateleira, base de cubo de calibração).",
              options: [
                {
                  value: "0 mm",
                  uso: "Peças pequenas ou já dimensionadas no CAD",
                  resultado: "Sem compensação",
                },
                { value: "0,1 mm — PADRÃO", uso: "Uso geral", resultado: "Compensação leve" },
                { value: "0,2 mm", uso: "Peças grandes, ABS", resultado: "Compensação média" },
                {
                  value: "0,3 mm",
                  uso: "Peças muito grandes, materiais que contraem",
                  resultado: "Compensação alta",
                },
              ],
              oQueInfluencia:
                "Largura real da base da peça, qualidade de encaixes apoiados na base e precisão dimensional na primeira camada. Temperatura da mesa mais quente = mais pé de elefante.",
              oQueGera:
                "Compensação correta gera base no diâmetro exato do CAD; excessiva gera base levemente menor (cantos arredondados na base).",
              regraDeOuro:
                "O pé de elefante é o inimigo dos encaixes na base. Use 0,1 mm para a maioria das peças.",
              comoConfigurar: "Processo → Qualidade → Precisão → Compensação de pé de elefante.",
            },
          },
          ...elephantFootExtraItems,
          ...precisaoBottomItems,
        ],
      },
      {
        id: "alisamento",
        label: "Alisamento (Ironing)",
        items: [
          {
            id: "ironing-type",
            label: "Tipo de Alisamento",
            value: "Desativado",
            type: "dropdown",
            content: {
              oQueE:
                "Define ONDE o Orca aplica o Ironing — passada extra do bico quente sem (ou quase sem) extrusão, derretendo as micro-rugosidades da superfície e preenchendo vales entre linhas. Cria acabamento espelhado.",
              porQueAjustar:
                "Topo de uma peça FDM nunca é perfeitamente liso — há sulcos entre passadas. Ironing 'derrete e nivela' esses sulcos, transformando o topo em uma superfície quase polida. Custo: tempo extra significativo no topo.",
              options: [
                {
                  value: "Desativado",
                  uso: "Peças estruturais, economia de tempo",
                  resultado: "Sem alisamento",
                },
                {
                  value: "Top surfaces",
                  uso: "Padrão — peças com topo visível",
                  resultado: "Apenas o último topo da peça",
                },
                {
                  value: "All solid surfaces",
                  uso: "Peças com várias faces planas",
                  resultado: "Todas as superfícies sólidas",
                },
                {
                  value: "All surfaces",
                  uso: "Casos especiais, peças pequenas",
                  resultado: "Tudo, incluindo bases sólidas internas",
                },
              ],
              oQueInfluencia:
                "Acabamento visual do topo (espelhado vs sulcado), tempo de impressão (Ironing dobra o tempo do topo) e consumo extra de filamento. PLA aliasa muito bem; PETG razoável; ABS difícil.",
              oQueGera:
                "Top surfaces gera topo quase espelhado; All surfaces gera tempo de impressão muito maior em troca de acabamento total.",
              regraDeOuro:
                "Use 'Top surfaces' para a maioria das peças. Desative para economizar tempo. 'All surfaces' só em casos especiais.",
              comoConfigurar:
                "Processo → Qualidade → Alisamento → Tipo de Alisamento. Selecionar 'Top surfaces'. Flow 12% · 25 mm/s · Spacing 0,12 mm.",
            },
          },
          ...alisamentoDetailItems,
        ],
      },
      zContouringGroup,
      {
        id: "gerador-paredes",
        label: "Gerador de Paredes",
        items: [
          {
            id: "wall-generator",
            label: "Gerador de paredes",
            value: "Clássico",
            type: "dropdown",
            content: {
              oQueE:
                "Algoritmo que o OrcaSlicer usa para gerar as trajetórias das paredes. Clássico desenha com largura de linha fixa (como um pincel de tamanho único); Arachne ajusta a largura dinamicamente para preencher qualquer espaço (como um pincel que muda de tamanho).",
              porQueAjustar:
                "Define a qualidade das paredes, a precisão dos detalhes finos, a resistência estrutural e o tempo de impressão. É a decisão fundamental de como a peça será 'desenhada' camada a camada.",
              options: [
                {
                  value: "Clássico (Classic)",
                  uso: "Peças simples, estruturais, furos com dimensão precisa",
                  resultado: "Largura de linha fixa, caminhos constantes e previsíveis",
                },
                {
                  value: "Arachne",
                  uso: "Detalhes finos, textos em relevo, engrenagens, paredes <1mm",
                  resultado: "Largura de linha variável, adapta-se ao espaço disponível",
                },
              ],
              oQueInfluencia:
                "Espessura mínima de paredes preenchíveis, qualidade de detalhes finos, previsibilidade dimensional. Clássico falha em paredes < largura do bico; Arachne ajusta dinamicamente.",
              oQueGera:
                "Clássico produz paredes uniformes mas pode deixar lacunas finas; Arachne elimina lacunas mas pode mostrar variação de largura.",
              regraDeOuro:
                "Arachne para detalhes, textos e paredes finas. Clássico para estruturas simples e previsíveis. A escolha certa elimina lacunas.",
              comoConfigurar:
                "Prepare → Qualidade → Gerador de paredes → Escolha Clássico ou Arachne.",
            },
          },
        ],
      },
      geradorParedesArachneGroup,
      {
        id: "paredes-superficies",
        label: "Paredes e Superfícies",
        items: [
          {
            id: "wall-order",
            label: "Ordem de impressão das paredes",
            value: "Interior/Exterior",
            type: "dropdown",
            content: {
              oQueE:
                "Define a sequência em que paredes externas e internas são impressas. A externa é a superfície visível; a interna dá suporte estrutural. A ordem define qual é priorizada em qualidade e precisão.",
              porQueAjustar:
                "Impacta diretamente a qualidade visual (parede externa lisa), a resistência e a precisão dimensional da peça.",
              options: [
                {
                  value: "Interior/Exterior — PADRÃO",
                  uso: "Melhor qualidade visual e dimensional",
                  resultado: "Internas primeiro, externa por último apoiada nelas",
                },
                {
                  value: "Exterior/Interior",
                  uso: "Melhor resistência estrutural",
                  resultado: "Externa primeiro, internas reforçam por dentro",
                },
                {
                  value: "Exterior/Interior/Exterior",
                  uso: "Mecanismos com tolerâncias precisas",
                  resultado: "Alternado",
                },
              ],
              oQueInfluencia:
                "Qualidade visual da parede externa, resistência da peça e precisão dimensional. Interior/Exterior produz dimensões mais previsíveis.",
              oQueGera:
                "Interior/Exterior = peça mais bonita e precisa. Exterior/Interior = peça mais forte.",
              regraDeOuro:
                "Interior/Exterior para peças bonitas. Exterior/Interior para peças fortes. A ordem define a prioridade.",
              comoConfigurar:
                "Prepare → Qualidade → Paredes e superfícies → Ordem de impressão das paredes.",
            },
          },
          {
            id: "infill-first",
            label: "Preenchimento primeiro",
            value: "Desativado",
            type: "checkbox",
            content: {
              oQueE:
                "Faz o preenchimento (infill) ser impresso ANTES das paredes da mesma camada, em vez de depois. Inverte a sequência clássica parede→infill.",
              porQueAjustar:
                "Pode reduzir movimentos de deslocamento (travel) e acelerar a impressão em peças com infill denso, ao custo de qualidade nas paredes externas (o infill pode 'empurrar' a parede).",
              options: [
                {
                  value: "Ativado",
                  uso: "Peças com infill muito denso, foco em velocidade",
                  resultado: "Infill impresso primeiro",
                },
                {
                  value: "Desativado — PADRÃO",
                  uso: "Uso geral, melhor qualidade visual",
                  resultado: "Paredes impressas primeiro",
                },
              ],
              oQueInfluencia:
                "Qualidade da parede externa, tempo de impressão e quantidade de travel.",
              oQueGera:
                "Ativado = mais rápido mas pode marcar a parede; desativado = parede mais limpa.",
              regraDeOuro: "Desative para qualidade. Ative para velocidade em peças densas.",
              comoConfigurar:
                "Prepare → Qualidade → Paredes e superfícies → Preenchimento primeiro.",
            },
          },
          ...wallLoopDirectionItem,
          ...paredesSuperficiesMissingItems,
          ...paredesSuperficiesTailItems,
        ],
      },
      {
        id: "ponte",
        label: "Ponte",
        items: [
          {
            id: "bridge-flow",
            label: "Taxa de fluxo em ponte",
            value: "1,00",
            type: "number",
            content: {
              oQueE:
                "Multiplicador de fluxo aplicado quando o OrcaSlicer detecta uma PONTE EXTERNA — linha que cruza um vão sem suporte abaixo. Controla quanto plástico é depositado por mm de ponte.",
              porQueAjustar:
                "A ponte é esticada entre duas paredes. Excesso = linha pesada que cai/curva; falta = linha fina que rompe. O fluxo correto deixa a ponte tensionada e firme.",
              options: [
                {
                  value: "0,85–0,90",
                  uso: "Vãos longos (>50mm)",
                  resultado: "Linha mais fina, mais esticada",
                },
                { value: "0,95–1,00 — PADRÃO", uso: "Vãos médios (30–50mm)", resultado: "Padrão" },
                {
                  value: "1,00–1,05",
                  uso: "Vãos curtos (<30mm)",
                  resultado: "Linha mais grossa, mais reforçada",
                },
              ],
              oQueInfluencia:
                "Sucesso da ponte (curva ou estica), aparência inferior, necessidade de suporte. PLA 0,90–1,00 · PETG 0,95–1,00 · ABS 0,85–0,95.",
              oQueGera: "Ponte tensionada e reta (correto) ou ponte caída/rompida (errado).",
              regraDeOuro:
                "0,85 para vãos longos, 1,00 para vãos médios. O fluxo da ponte define se a linha estica ou cai.",
              comoConfigurar:
                "Prepare → Qualidade → Ponte → Taxa de fluxo em ponte. Combine com fan 100% e velocidade 35 mm/s.",
            },
          },
          ...internalBridgeFlowItem,
          ...ponteMissingItems.slice(0, 3),
          ...extraBridgeLayersItem,
          ...filterInternalBridgesItem,
          ...ponteMissingItems.slice(3),
          ...ponteAdvancedItems,
        ],
      },
      {
        id: "saliencias",
        label: "Saliências",
        items: [
          {
            id: "detect-overhangs",
            label: "Detectar paredes salientes",
            value: "Ativado",
            type: "checkbox",
            content: {
              oQueE:
                "Faz o slicer identificar automaticamente, camada a camada, regiões onde a parede se projeta além do suporte da camada anterior (overhangs). Permite aplicar velocidade, cooling e fluxo específicos a essas regiões.",
              porQueAjustar:
                "Saliências (especialmente >45°) são pontos críticos: precisam de velocidade reduzida e cooling máximo para não cair. Sem detecção, são tratadas como parede comum e falham.",
              options: [
                {
                  value: "Ativado — PADRÃO",
                  uso: "Peças com curvas, esferas, ângulos",
                  resultado: "Detecta e trata overhangs separadamente",
                },
                {
                  value: "Desativado",
                  uso: "Peças sem overhangs (caixas retas)",
                  resultado: "Todas as paredes tratadas iguais",
                },
              ],
              oQueInfluencia:
                "Qualidade de overhangs, velocidade adaptativa, cooling em pontos críticos.",
              oQueGera: "Overhangs mais limpos e estáveis quando ativado.",
              regraDeOuro:
                "Mantenha sempre ativado. A detecção é pré-requisito para todo o tratamento de overhangs.",
              comoConfigurar: "Prepare → Qualidade → Saliências → Detectar paredes salientes.",
            },
          },
          ...salienciasMissingItems,
          {
            id: "extra-overhang-walls",
            label: "Paredes extras em saliências",
            value: "0",
            type: "number",
            content: {
              oQueE:
                "Adiciona paredes ADICIONAIS especificamente nas regiões detectadas como saliência, criando reforço estrutural para que a saliência não deforme nem caia.",
              porQueAjustar:
                "Saliências são áreas de tensão — a parede está parcialmente no ar. Paredes extras ancoram a saliência na parte sólida.",
              options: [
                { value: "0 — PADRÃO", uso: "Overhangs leves (<45°)", resultado: "Sem reforço" },
                { value: "1", uso: "Overhangs médios (45–60°)", resultado: "Uma parede extra" },
                { value: "2", uso: "Overhangs severos (>60°)", resultado: "Duas paredes extras" },
              ],
              oQueInfluencia:
                "Resistência e estabilidade de overhangs, tempo de impressão, peso da peça.",
              oQueGera: "Overhangs sem deformação quando dimensionado corretamente.",
              regraDeOuro:
                "1 parede extra para a maioria. 2 para overhangs severos. Paredes extras evitam deformações.",
              comoConfigurar: "Prepare → Qualidade → Saliências → Paredes extras em saliências.",
            },
          },
          ...overhangReversePairItem,
          ...salienciasAdvancedItems,
        ],
      },
    ],
  },
  {
    id: "resistencia",
    label: "Resistência",
    icon: "🏗️",
    tela: "Telas 03-07",
    groups: [
      {
        id: "paredes-superficies",
        label: "Paredes",
        items: [
          {
            id: "wall-count",
            label: "Voltas da parede",
            value: "2",
            type: "number",
            content: {
              oQueE:
                "Define quantos perímetros (loops) formam as paredes da peça. Cada parede adiciona uma camada de plástico no contorno externo e interno. Analogia: é como o número de folhas de um caderno — mais folhas = mais resistente.",
              porQueAjustar:
                "Paredes são a principal fonte de resistência estrutural. 2 paredes = básico; 3 = padrão robusto; 4+ = peça muito resistente. Mais paredes = mais tempo e filamento.",
              options: [
                {
                  value: "1 parede",
                  uso: "Peças decorativas, vasos",
                  resultado: "Muito fraca, transparência",
                },
                {
                  value: "2 paredes",
                  uso: "Peças leves, decorativas",
                  resultado: "Básico, pouca resistência",
                },
                {
                  value: "3 paredes — PADRÃO",
                  uso: "Uso geral, boa resistência",
                  resultado: "Bom equilíbrio",
                },
                {
                  value: "4 paredes",
                  uso: "Peças funcionais e robustas",
                  resultado: "Muito resistente",
                },
                {
                  value: "5+ paredes",
                  uso: "Peças mecânicas de alta carga",
                  resultado: "Máxima resistência",
                },
              ],
              oQueInfluencia:
                "Resistência estrutural, peso, tempo de impressão, consumo de filamento e qualidade de detalhes.",
              oQueGera:
                "3 paredes é o padrão profissional. Menos = mais rápido mas frágil. Mais = mais resistente mas lento.",
              regraDeOuro:
                "3 paredes para uso geral. 4–5 para peças mecânicas. 2 para decorativas. O número de paredes define o quanto a peça aguenta.",
              comoConfigurar: "Prepare → Resistência → Paredes e superfícies → Número de paredes.",
            },
          },
          {
            id: "wall-alternating-extra",
            label: "Parede extra alternada",
            value: "Desativado",
            type: "checkbox",
            content: {
              oQueE:
                "Adiciona automaticamente uma parede extra a cada camada alternada. Em vez de ter N paredes em todas as camadas, alterna entre N e N+1, criando um encaixe mecânico entre as camadas que aumenta a resistência entre elas.",
              porQueAjustar:
                "Peças com cargas perpendiculares às camadas (forças laterais) se beneficiam muito desse encaixe. A parede extra alternada aumenta a resistência Z sem o custo completo de uma parede extra em todas as camadas.",
              options: [
                {
                  value: "Desativado — PADRÃO",
                  uso: "Uso geral",
                  resultado: "Paredes iguais em todas as camadas",
                },
                {
                  value: "Ativado",
                  uso: "Peças com carga lateral, uso mecânico",
                  resultado: "Encaixe entre camadas, mais resistente",
                },
              ],
              oQueInfluencia:
                "Resistência entre camadas (eixo Z), tempo de impressão e aspecto das paredes.",
              oQueGera:
                "Ativado gera peças mais resistentes a cargas perpendiculares às camadas sem dobrar o tempo com paredes extras.",
              regraDeOuro:
                "Mantenha desativado para uso geral. Ative em peças que sofrem torção ou impacto lateral.",
              comoConfigurar: "Prepare → Resistência → Paredes → Parede extra alternada.",
            },
          },
          {
            id: "detect-thin-walls",
            label: "Detectar paredes finas",
            value: "Desativado",
            type: "checkbox",
            content: {
              oQueE:
                "Detecta regiões onde a parede é muito estreita para caber uma largura de linha padrão e adapta a trajetória para não deixar lacunas nessas regiões. Funciona em conjunto com o gerador Clássico.",
              porQueAjustar:
                "Modelos com paredes finas (< 1 bico) ficam com lacunas visíveis no modo Clássico. Ativar essa detecção permite ao slicer tentar preencher essas regiões com linhas mais finas, melhorando a qualidade.",
              options: [
                {
                  value: "Desativado — PADRÃO",
                  uso: "Uso geral com Arachne",
                  resultado: "Sem detecção especial",
                },
                {
                  value: "Ativado",
                  uso: "Paredes finas com gerador Clássico",
                  resultado: "Tenta preencher lacunas estreitas",
                },
              ],
              oQueInfluencia:
                "Qualidade de paredes finas, lacunas em detalhes delicados e tempo de fatiamento.",
              oQueGera:
                "Melhor preenchimento de paredes abaixo de 1 bico no modo Clássico. Com Arachne, é menos necessário.",
              regraDeOuro:
                "Use Arachne para paredes finas — é mais eficiente. Active esta opção apenas com gerador Clássico e paredes < 0,4 mm.",
              comoConfigurar: "Prepare → Resistência → Paredes → Detectar paredes finas.",
            },
          },
        ],
      },
      {
        id: "cascas-topo-base",
        label: "Cascas de topo/base",
        items: [
          {
            id: "top-layers",
            label: "Camadas de topo da casca",
            value: "5",
            type: "number",
            content: {
              oQueE:
                "Número de camadas 100% sólidas que formam o topo da peça. São a 'tampa' — cobrem o infill esparso e criam a superfície superior visível.",
              porQueAjustar:
                "Poucas camadas = 'pillowing' (topo irregular com buracos que mostram o padrão do infill). Muitas = mais resistência mas mais material. O mínimo para evitar pillowing depende da altura de camada e do infill.",
              options: [
                {
                  value: "2 camadas",
                  uso: "Peças descartáveis, protótipos",
                  resultado: "Risco de pillowing",
                },
                { value: "3 camadas", uso: "Mínimo aceitável", resultado: "Pode haver pillowing" },
                { value: "4 camadas — PADRÃO", uso: "Uso geral", resultado: "Boa cobertura" },
                {
                  value: "5–6 camadas",
                  uso: "Topos visíveis com qualidade",
                  resultado: "Excelente cobertura",
                },
              ],
              oQueInfluencia:
                "Aparência do topo, ocorrência de pillowing, peso e tempo de impressão. Mais infill → menos camadas necessárias.",
              oQueGera:
                "4 camadas cobre bem com 0,20 mm de altura; 6 camadas para altura menor que 0,15 mm.",
              regraDeOuro:
                "Espessura total do topo ≥ 0,8 mm. Para 0,20 mm de altura = 4 camadas. Para 0,12 mm = 6–7 camadas.",
              comoConfigurar: "Prepare → Resistência → Paredes e superfícies → Camadas superiores.",
            },
          },
          {
            id: "top-shell-thickness",
            label: "Espessura da casca do topo",
            value: "1 mm",
            type: "number",
            content: {
              oQueE:
                "Define a espessura mínima em mm da casca sólida no topo da peça, independente do número de camadas. Garante que mesmo com alturas de camada menores, o topo tenha espessura física mínima adequada.",
              porQueAjustar:
                "Combinar espessura mínima com número de camadas dá um controle mais preciso: 1 mm de topo garante boa cobertura mesmo se a altura de camada mudar entre perfis.",
              options: [
                {
                  value: "0,6–0,8 mm",
                  uso: "Peças leves, decorativas",
                  resultado: "Topo fino, pode haver pillowing",
                },
                { value: "1 mm — PADRÃO", uso: "Uso geral", resultado: "Boa cobertura e robustez" },
                { value: "1,2–1,5 mm", uso: "Peças funcionais", resultado: "Topo muito sólido" },
              ],
              oQueInfluencia:
                "Qualidade do topo, tempo de impressão e robustez mecânica da superfície superior.",
              oQueGera:
                "1 mm garante ao menos 5 camadas com altura 0,20 mm — eliminando pillowing na maioria dos materiais.",
              regraDeOuro:
                "Espessura mínima do topo ≥ 1 mm para uso geral. Combine com 4–5 camadas para máximo resultado.",
              comoConfigurar: "Prepare → Resistência → Casca do topo → Espessura da casca do topo.",
            },
          },
          {
            id: "top-surface-density",
            label: "Densidade da superfície superior",
            value: "100 %",
            type: "percent",
            content: {
              oQueE:
                "Define a porcentagem de preenchimento das camadas sólidas superiores (a casca do topo). 100% = linhas perfeitamente juntas, sem espaços. Valores abaixo de 100% criam lacunas visíveis no topo.",
              porQueAjustar:
                "A superfície superior é a face mais visível da peça. 100% garante que não haja nenhum gap entre as linhas, criando uma superfície lisa e homogênea.",
              options: [
                {
                  value: "80–90%",
                  uso: "Economia de material",
                  resultado: "Possíveis gaps visíveis",
                },
                {
                  value: "100% — PADRÃO",
                  uso: "Uso geral",
                  resultado: "Superfície perfeitamente sólida",
                },
              ],
              oQueInfluencia:
                "Aparência da superfície superior, ocorrência de gaps e qualidade do Ironing.",
              oQueGera: "100% = topo liso sem buracos. Menos de 100% = riscos de aspecto inferior.",
              regraDeOuro:
                "Mantenha em 100%. Só reduza se você precisar economizar filamento em protótipos descartáveis.",
              comoConfigurar:
                "Prepare → Resistência → Casca do topo → Densidade da superfície superior.",
            },
          },
          {
            id: "top-surface-pattern",
            label: "Padrão de superfície superior",
            value: "Linha Monotônica",
            type: "dropdown",
            content: {
              oQueE:
                "Define o padrão geométrico das linhas sólidas que formam o topo visível da peça. Diferente do infill esparso, o padrão do topo afeta diretamente a aparência e a textura da superfície superior.",
              porQueAjustar:
                "O topo é a 'capa' da peça. Monotônica = linhas na mesma direção, topo uniforme e sem reflexos cruzados. Rectilinear = linhas alternadas, pode mostrar pequenas variações de reflexo. Monotônica dá o acabamento mais liso visivelmente.",
              options: [
                {
                  value: "Rectilinear",
                  uso: "Velocidade, padrão básico",
                  resultado: "Linhas alternadas, pequenas variações",
                },
                {
                  value: "Linha Monotônica — PADRÃO",
                  uso: "Melhor aparência",
                  resultado: "Linhas paralelas, topo uniforme",
                },
                {
                  value: "Concentrica",
                  uso: "Efeito visual especial",
                  resultado: "Linhas em anéis, textura diferente",
                },
              ],
              oQueInfluencia:
                "Aparência da superfície superior, reflexos e uniformidade visual do topo da peça.",
              oQueGera:
                "Linha Monotônica = topo com aparência mais profissional e uniforme. Melhor resultado combinado com Ironing.",
              regraDeOuro:
                "Linha Monotônica para melhor acabamento visual. É o padrão recomendado pelo OrcaSlicer para qualidade.",
              comoConfigurar:
                "Prepare → Resistência → Casca do topo → Padrão de superfície superior.",
            },
          },
          {
            id: "bottom-layers",
            label: "Camadas da casca de base",
            value: "3",
            type: "number",
            content: {
              oQueE:
                "Número de camadas 100% sólidas que formam a base da peça sobre a mesa. Mesma função que as camadas superiores, mas para baixo.",
              porQueAjustar:
                "A base precisa ser suficientemente sólida para ancorar a estrutura. Poucas camadas = base fraca que pode descolar ou empenar. A base geralmente precisa de menos camadas que o topo (o topo precisa cobrir o infill).",
              options: [
                { value: "2 camadas", uso: "Mínimo", resultado: "Base fina" },
                { value: "3 camadas — PADRÃO", uso: "Uso geral", resultado: "Base adequada" },
                {
                  value: "4–5 camadas",
                  uso: "Peças grandes, materiais que warpam",
                  resultado: "Base robusta",
                },
              ],
              oQueInfluencia: "Adesão da base, resistência ao warping e tempo de impressão.",
              oQueGera:
                "3 camadas suficiente para a maioria. ABS e PETG pedem 4–5 para evitar warping.",
              regraDeOuro: "Base ≥ 0,6 mm de espessura total. Para ABS/PETG, use 4–5 camadas.",
              comoConfigurar: "Prepare → Resistência → Paredes e superfícies → Camadas inferiores.",
            },
          },
          {
            id: "bottom-shell-thickness",
            label: "Espessura da casca de base",
            value: "0 mm",
            type: "number",
            content: {
              oQueE:
                "Define a espessura mínima em mm da casca sólida na base da peça. 0 mm significa que o controle é feito apenas pelo número de camadas inferiores, sem espessura mínima adicional.",
              porQueAjustar:
                "Quando configurado em 0, o número de camadas inferiores (bottom-layers) controla completamente a base. Definir um valor positivo força uma espessura mínima garantida, independente da altura de camada.",
              options: [
                {
                  value: "0 mm — PADRÃO",
                  uso: "Controle por número de camadas",
                  resultado: "Base definida apenas pelas camadas inferiores",
                },
                {
                  value: "0,6–1 mm",
                  uso: "Espessura mínima garantida",
                  resultado: "Base com espessura física fixa",
                },
              ],
              oQueInfluencia:
                "Espessura da base, adesão à mesa e robustez da parte inferior da peça.",
              oQueGera:
                "0 mm é o padrão — o número de camadas controla. Use um valor positivo apenas se precisar garantir espessura independente da altura de camada.",
              regraDeOuro:
                "Deixe em 0 mm e controle pelo número de camadas inferiores. É mais intuitivo e previsível.",
              comoConfigurar: "Prepare → Resistência → Casca de base → Espessura da casca de base.",
            },
          },
          {
            id: "bottom-surface-density",
            label: "Densidade da superfície inferior",
            value: "100 %",
            type: "percent",
            content: {
              oQueE:
                "Porcentagem de preenchimento das camadas sólidas inferiores (a casca da base). Funciona como a densidade da superfície superior, mas para a base da peça.",
              porQueAjustar:
                "A base precisa ser sólida para ancorar a peça na mesa e resistir ao warping. 100% garante a base mais densa e resistente possível.",
              options: [
                {
                  value: "80–90%",
                  uso: "Economia de material",
                  resultado: "Possíveis gaps na base",
                },
                {
                  value: "100% — PADRÃO",
                  uso: "Uso geral",
                  resultado: "Base perfeitamente sólida",
                },
              ],
              oQueInfluencia:
                "Adesão da base, resistência ao warping e qualidade da superfície inferior da peça.",
              oQueGera:
                "100% = base densa e aderente. Menos = base com pequenos gaps que podem reduzir adesão.",
              regraDeOuro: "Sempre 100% na base. A base é a fundação — não economize aqui.",
              comoConfigurar:
                "Prepare → Resistência → Casca de base → Densidade da superfície inferior.",
            },
          },
          {
            id: "bottom-surface-pattern",
            label: "Padrão de superfície inferior",
            value: "Monótono",
            type: "dropdown",
            content: {
              oQueE:
                "Define o padrão geométrico das linhas sólidas da base da peça — a primeira superfície impressa que fica em contato com a mesa ou com o suporte.",
              porQueAjustar:
                "O padrão monótono garante linhas uniformes e paralelas na base. Rectilinear alterna a direção, o que pode ajudar na adesão mas cria variação visual.",
              options: [
                {
                  value: "Rectilinear",
                  uso: "Velocidade, adesão alternada",
                  resultado: "Linhas alternadas",
                },
                {
                  value: "Monótono — PADRÃO",
                  uso: "Uniformidade visual",
                  resultado: "Linhas paralelas uniformes",
                },
              ],
              oQueInfluencia:
                "Aparência da base (caso a base fique visível) e uniformidade da superfície inferior.",
              oQueGera: "Monótono = base com aparência mais uniforme e previsível.",
              regraDeOuro:
                "Monótono para consistência. A base raramente é visível — priorize sempre a resistência ao warping.",
              comoConfigurar:
                "Prepare → Resistência → Casca de base → Padrão de superfície inferior.",
            },
          },
          {
            id: "top-bottom-solid-infill-overlap",
            label: "Sobreposição Superior/Inferior de preenchimento sólido/parede",
            value: "15 %",
            type: "percent",
            content: {
              oQueE:
                "Define quanto as camadas sólidas do topo e da base se sobrepõem às paredes nas bordas da peça, criando uma transição suave entre a casca sólida e as paredes verticais.",
              porQueAjustar:
                "Sem sobreposição, o topo/base e as paredes ficam com uma pequena lacuna entre eles. A sobreposição elimina esse gap, criando uma união sólida entre a superfície horizontal e as paredes verticais.",
              options: [
                { value: "10 %", uso: "Peças decorativas", resultado: "Sobreposição mínima" },
                { value: "15 % — PADRÃO", uso: "Uso geral", resultado: "Boa union borda-parede" },
                { value: "25 %", uso: "Peças estruturais", resultado: "Muito aderente" },
              ],
              oQueInfluencia:
                "União entre superfícies horizontais e paredes verticais, aparência da borda do topo/base e resistência.",
              oQueGera:
                "15% elimina as lacunas típicas entre topo/base e paredes, criando uma peça visualmente e estruturalmente mais sólida.",
              regraDeOuro:
                "15% para a maioria. Se notar uma linha de separação entre o topo e as paredes, aumente para 20–25%.",
              comoConfigurar:
                "Prepare → Resistência → Casca → Sobreposição Superior/Inferior de preenchimento sólido/parede.",
            },
          },
        ],
      },
      {
        id: "preenchimento",
        label: "Preenchimento (Infill)",
        items: [
          {
            id: "infill-density",
            label: "Densidade do preenchimento esparso",
            value: "15%",
            type: "percent",
            content: {
              oQueE:
                "Define quanto do interior da peça é preenchido com plástico (em %). 0% = completamente oco; 100% = completamente sólido. A maioria das peças fica entre 10% e 25%.",
              porQueAjustar:
                "Infill define a resistência interna, o peso e o tempo. Contraintuitivo: de 15% para 30% a resistência sobe pouco, mas de 3 paredes para 4 paredes sobe muito mais. Paredes > infill em termos de resistência.",
              options: [
                {
                  value: "0–5%",
                  uso: "Vasos, decorativos ocos",
                  resultado: "Mínima resistência interna",
                },
                {
                  value: "10–15%",
                  uso: "Peças leves e decorativas",
                  resultado: "Resistência básica",
                },
                {
                  value: "15–20% — PADRÃO",
                  uso: "Uso geral",
                  resultado: "Bom equilíbrio peso × resistência",
                },
                { value: "25–40%", uso: "Peças funcionais", resultado: "Boa resistência" },
                { value: "40–60%", uso: "Peças mecânicas", resultado: "Alta resistência" },
                { value: "80–100%", uso: "Máxima resistência", resultado: "Muito pesado e lento" },
              ],
              oQueInfluencia:
                "Resistência interna, peso, tempo de impressão, consumo de filamento e possibilidade de pillowing no topo.",
              oQueGera:
                "Infill alto = mais resistente e pesado. Infill baixo = mais leve e rápido. Paredes têm mais impacto na resistência que o infill.",
              regraDeOuro:
                "15% para uso geral. Aumente paredes ANTES de aumentar infill para ganhar resistência. 15% + 3 paredes > 50% + 2 paredes.",
              comoConfigurar: "Prepare → Resistência → Preenchimento → Densidade do preenchimento.",
            },
          },
          {
            id: "infill-multiline",
            label: "Multilinhas de Preenchimento",
            value: "1",
            type: "number",
            content: {
              oQueE:
                "Define quantas linhas o bico deposita por passada no infill. 1 = uma linha por vez (padrão). Valores maiores fazem o bico depositar múltiplas linhas adjacentes na mesma passada, como um pincel largo.",
              porQueAjustar:
                "Multilinhas pode aumentar drasticamente a velocidade do infill ao reduzir o número de viagens de e para a parede. Contudo, pode reduzir ligeiramente a aderência entre as linhas do infill.",
              options: [
                {
                  value: "1 — PADRÃO",
                  uso: "Qualidade e compatibilidade",
                  resultado: "Uma linha por passada, máxima qualidade",
                },
                {
                  value: "2",
                  uso: "Infill denso, velocidade moderada",
                  resultado: "Duas linhas por passada, mais rápido",
                },
                {
                  value: "3+",
                  uso: "Infill esparso, velocidade máxima",
                  resultado: "Múltiplas linhas, menor aderência",
                },
              ],
              oQueInfluencia:
                "Velocidade do infill, aderência entre linhas do infill e tempo de impressão.",
              oQueGera:
                "1 linha = melhor qualidade. 2–3 linhas = aceleração significativa com pequena perda de qualidade interna.",
              regraDeOuro:
                "Mantenha em 1 para uso geral. Use 2 em infills densos onde a velocidade importa mais que a qualidade interna.",
              comoConfigurar:
                "Prepare → Resistência → Preenchimento → Multilinhas de Preenchimento.",
            },
          },
          {
            id: "infill-pattern",
            label: "Padrão de preenchimento esparso",
            value: "Grade",
            type: "dropdown",
            content: {
              oQueE:
                "Define o desenho geométrico do infill. Cada padrão tem propriedades de resistência, velocidade e aparência diferentes. O padrão é a 'armação interna' da peça.",
              porQueAjustar:
                "O padrão certo distribui forças adequadamente para o uso da peça. Gyroid distribui em 3D; Grid é rápido e uniforme; Lines é muito rápido mas direcional.",
              options: [
                {
                  value: "Lines",
                  uso: "Peças rápidas, decorativas",
                  resultado: "Mais rápido, direcional",
                },
                {
                  value: "Grid — PADRÃO",
                  uso: "Uso geral",
                  resultado: "Equilíbrio velocidade × resistência",
                },
                {
                  value: "Gyroid",
                  uso: "Peças de alta resistência",
                  resultado: "Distribuição 3D, resistência isotrópica",
                },
                {
                  value: "Honeycomb (Favo)",
                  uso: "Resistência lateral",
                  resultado: "Excelente em compressão",
                },
                {
                  value: "Cubic",
                  uso: "Peças com carga complexa",
                  resultado: "Distribuição tridimensional",
                },
                {
                  value: "Lightning",
                  uso: "Decorativas, velocidade máxima",
                  resultado: "Mínimo material, apenas suporta topo",
                },
              ],
              oQueInfluencia:
                "Resistência por direção (isotrópica vs anisotrópica), tempo de impressão e consumo de filamento.",
              oQueGera:
                "Grid para uso geral. Gyroid para resistência máxima. Lines para velocidade. Lightning para decorativas.",
              regraDeOuro:
                "Grid ou Gyroid para peças funcionais. Lines ou Lightning para decorativas. O padrão define como a força é distribuída.",
              comoConfigurar: "Prepare → Resistência → Preenchimento → Padrão de preenchimento.",
            },
          },
          {
            id: "infill-direction",
            label: "Direção do preenchimento esparso",
            value: "45°",
            type: "number",
            content: {
              oQueE:
                "Ângulo base das linhas do infill em relação ao eixo X da impressora. 45° é o padrão porque distribui esforços de forma mais uniforme do que 0° ou 90°.",
              porQueAjustar:
                "A direção define onde a peça é mais forte e onde é mais fraca. Para peças com carga em uma direção específica, alinhar o infill com essa direção maximiza a resistência.",
              options: [
                { value: "0°", uso: "Carga horizontal pura (X)", resultado: "Máxima força em X" },
                {
                  value: "45° — PADRÃO",
                  uso: "Uso geral, carga mista",
                  resultado: "Distribuição equilibrada",
                },
                { value: "90°", uso: "Carga vertical pura (Y)", resultado: "Máxima força em Y" },
                { value: "0°/90°", uso: "Carga complexa", resultado: "Força em ambas direções" },
              ],
              oQueInfluencia:
                "Resistência direcional, aparência do infill visível pelo topo translúcido e distribuição de forças.",
              oQueGera:
                "45° para uso geral. Direcional para cargas específicas. A direção determina onde a peça é mais forte.",
              regraDeOuro: "45° para a maioria. Alinhe com a direção da força principal da peça.",
              comoConfigurar: "Prepare → Resistência → Preenchimento → Direção do preenchimento.",
            },
          },
          {
            id: "infill-anchor-max",
            label: "Comprimento máximo da âncora de preenchimento",
            value: "20 mm",
            type: "number",
            content: {
              oQueE:
                "Define o comprimento máximo que o infill pode se estender dentro das paredes (âncora) para criar uma transição suave entre infill e parede sem um movimento de retração desnecessário. Evita microvibração e artefatos na borda.",
              porQueAjustar:
                "A âncora permite que o infill 'entre' ligeiramente na parede ao iniciar e terminar cada linha, criando uma junção mais forte. O valor máximo controla o quanto o bico pode percorrer dentro da parede antes de retornar.",
              options: [
                {
                  value: "0 mm",
                  uso: "Sem âncora",
                  resultado: "Infill termina exatamente na borda",
                },
                { value: "10 mm", uso: "Âncora curta", resultado: "Menor sobreposição" },
                {
                  value: "20 mm — PADRÃO",
                  uso: "Uso geral",
                  resultado: "Boa âncora, borda reforçada",
                },
              ],
              oQueInfluencia:
                "Qualidade da união infill-parede, artefatos na borda e resistência da interface.",
              oQueGera:
                "20 mm permite uma âncora adequada na maioria das peças, eliminando pontos de fragilidade na borda do infill.",
              regraDeOuro:
                "20 mm é o equilíbrio ideal. Reduza para 0 apenas se notar excesso de material na borda das paredes.",
              comoConfigurar:
                "Prepare → Resistência → Preenchimento → Comprimento máximo da âncora de preenchimento.",
            },
          },
          {
            id: "infill-anchor-length",
            label: "Comprimento da âncora de preenchimento esparso",
            value: "400%",
            type: "percent",
            content: {
              oQueE:
                "Define o comprimento da âncora do infill esparso em relação à largura da linha de infill. 400% = âncora de 4× a largura da linha. Controla com que profundidade o infill penetra nas paredes ao começar e terminar cada linha.",
              porQueAjustar:
                "Uma âncora mais longa cria uma ligação mais forte entre o infill e a parede. 400% é o valor padrão que balanceia resistência e eficiência de impressão.",
              options: [
                { value: "100%", uso: "Âncora mínima", resultado: "Ligação fraca infill-parede" },
                {
                  value: "400% — PADRÃO",
                  uso: "Uso geral",
                  resultado: "Boa ligação infill-parede",
                },
                {
                  value: "800%+",
                  uso: "Alta resistência na interface",
                  resultado: "Máxima ligação",
                },
              ],
              oQueInfluencia: "Resistência da interface infill-parede e tempo de impressão.",
              oQueGera:
                "400% cria uma âncora robusta sem desperdiçar tempo. Aumentar acima de 800% tem retorno decrescente.",
              regraDeOuro:
                "400% para a maioria. Se a peça está se separando na interface infill-parede, aumente para 600–800%.",
              comoConfigurar:
                "Prepare → Resistência → Preenchimento → Comprimento da âncora de preenchimento esparso.",
            },
          },
          {
            id: "internal-solid-infill-pattern",
            label: "Padrão de preenchimento sólido interno",
            value: "Retilíneo",
            type: "dropdown",
            content: {
              oQueE:
                "Define o padrão das camadas 100% sólidas que ficam entre o infill esparso e o topo/base da peça. Diferente do padrão do topo (visível), este é interno — afeta a resistência estrutural das transições sólidas.",
              porQueAjustar:
                "O padrão sólido interno conecta o infill esparso com as camadas de topo/base. Retilíneo é rápido e eficiente. Monotônico gera melhor aparência nas camadas intermediárias.",
              options: [
                {
                  value: "Retilíneo — PADRÃO",
                  uso: "Uso geral, velocidade",
                  resultado: "Rápido, eficiente, bom para camadas internas",
                },
                {
                  value: "Monotônico",
                  uso: "Melhor aparência",
                  resultado: "Linhas uniformes, melhor visual interno",
                },
                {
                  value: "Grade",
                  uso: "Alta resistência interna",
                  resultado: "Cruz, mais resistente",
                },
              ],
              oQueInfluencia:
                "Resistência das camadas sólidas internas e velocidade de impressão das transições sólidas.",
              oQueGera:
                "Retilíneo = rápido e sólido. Monotônico = mais uniforme. A escolha afeta o interior, não o acabamento visível.",
              regraDeOuro:
                "Retilíneo para a maioria. O padrão sólido interno raramente afeta o resultado visual final.",
              comoConfigurar:
                "Prepare → Resistência → Preenchimento → Padrão de preenchimento sólido interno.",
            },
          },
          {
            id: "solid-infill-direction",
            label: "Direção do preenchimento sólido",
            value: "45°",
            type: "number",
            content: {
              oQueE:
                "Ângulo das linhas do preenchimento sólido interno (camadas 100% entre infill e topo/base). Análogo à direção do infill esparso, mas aplicado às camadas completamente sólidas.",
              porQueAjustar:
                "45° distribui uniformemente as forças nessas camadas de transição. A direção do sólido interno afeta a resistência estrutural nas regiões de transição da peça.",
              options: [
                {
                  value: "0°",
                  uso: "Alinhamento específico com a geometria",
                  resultado: "Força máxima em X",
                },
                { value: "45° — PADRÃO", uso: "Uso geral", resultado: "Distribuição equilibrada" },
                { value: "90°", uso: "Força em Y", resultado: "Máxima força em Y" },
              ],
              oQueInfluencia:
                "Resistência das camadas sólidas internas e consistência estrutural da peça.",
              oQueGera:
                "45° para uso geral. O ângulo das camadas sólidas internas raramente precisa ser alterado.",
              regraDeOuro:
                "Mantenha em 45°. Só altere se tiver uma razão estrutural específica para a orientação das camadas sólidas.",
              comoConfigurar:
                "Prepare → Resistência → Preenchimento → Direção do preenchimento sólido.",
            },
          },
          {
            id: "solid-infill-rotation",
            label: "Gabarito de rotação de preenchimento sólido",
            value: "0,90°",
            type: "number",
            content: {
              oQueE:
                "Define o incremento de rotação aplicado ao preenchimento sólido interno a cada camada. 0,90° significa que a cada camada sólida interna o ângulo rotaciona 0,90°, criando uma leve variação angular entre as camadas.",
              porQueAjustar:
                "Uma rotação pequena entre camadas sólidas distribui melhor as forças em múltiplas direções ao longo da altura da peça, melhorando a isotropia estrutural.",
              options: [
                {
                  value: "0°",
                  uso: "Todas as camadas no mesmo ângulo",
                  resultado: "Força totalmente direcional",
                },
                { value: "0,90° — PADRÃO", uso: "Leve rotação", resultado: "Distribuição gradual" },
                {
                  value: "45° ou 90°",
                  uso: "Rotação agressiva entre camadas",
                  resultado: "Distribuição máxima de forças",
                },
              ],
              oQueInfluencia:
                "Isotropia das camadas sólidas internas e resistência estrutural em múltiplas direções.",
              oQueGera:
                "0,90° é uma rotação quase imperceptível que melhora marginalmente a distribuição de forças nas camadas sólidas.",
              regraDeOuro:
                "Mantenha em 0,90°. Para máxima resistência omnidirecional, use 45° ou 90°.",
              comoConfigurar:
                "Prepare → Resistência → Preenchimento → Gabarito de rotação de preenchimento sólido.",
            },
          },
          {
            id: "bridge-apply-infill",
            label: "Aplicar preenchimento de vão",
            value: "Superfícies superiores",
            type: "dropdown",
            content: {
              oQueE:
                "Define onde o OrcaSlicer aplica a estratégia especial de 'bridge infill' (linhas esticadas sem suporte). Superfícies superiores = aplica apenas no topo de vãos. Todas as superfícies = aplica em qualquer região sem suporte.",
              porQueAjustar:
                "O preenchimento de vão otimiza a deposição de linhas sobre espaços vazios. Aplicar em 'Superfícies superiores' é o padrão — cobre a maioria dos casos sem afetar outras regiões desnecessariamente.",
              options: [
                {
                  value: "Desativado",
                  uso: "Sem tratamento especial de vão",
                  resultado: "Infill normal em vãos",
                },
                {
                  value: "Superfícies superiores — PADRÃO",
                  uso: "Uso geral",
                  resultado: "Topo de vãos com bridge infill",
                },
                {
                  value: "Todas as superfícies",
                  uso: "Vãos complexos",
                  resultado: "Todos os vãos com bridge infill",
                },
              ],
              oQueInfluencia:
                "Qualidade de superfícies sobre vãos, necessidade de suporte e aparência de regiões suspensas.",
              oQueGera:
                "Superfícies superiores = a maioria dos casos fica coberta sem interferir em outras regiões.",
              regraDeOuro:
                "Mantenha em Superfícies superiores. Use Todas as superfícies apenas para geometrias muito complexas.",
              comoConfigurar:
                "Prepare → Resistência → Preenchimento → Aplicar preenchimento de vão.",
            },
          },
          {
            id: "filter-small-gaps",
            label: "Filtrar vazios pequenos",
            value: "0 mm",
            type: "number",
            content: {
              oQueE:
                "Define um tamanho mínimo em mm² para regiões de infill. Regiões menores que esse valor são ignoradas pelo slicer e não recebem infill. 0 mm = sem filtro, todos os vazios são preenchidos.",
              porQueAjustar:
                "Em geometrias complexas, surgem pequenas ilhas internas que recebem infill desnecessariamente, gerando movimentos extras do bico. Filtrar esses pequenos vazios pode simplificar o G-code e reduzir artefatos.",
              options: [
                {
                  value: "0 mm — PADRÃO",
                  uso: "Uso geral, sem filtro",
                  resultado: "Todos os vazios preenchidos",
                },
                {
                  value: "5–15 mm²",
                  uso: "Peças complexas com muitas ilhas",
                  resultado: "Ilhas pequenas ignoradas",
                },
              ],
              oQueInfluencia:
                "Complexidade do G-code, tempo de impressão em peças com muitas ilhas internas e qualidade do infill.",
              oQueGera:
                "0 mm = comportamento padrão. Valores maiores simplificam o G-code em peças muito complexas.",
              regraDeOuro:
                "Mantenha em 0 mm. Só aumente se o G-code ficar muito complexo em peças com muitas ilhas internas.",
              comoConfigurar: "Prepare → Resistência → Preenchimento → Filtrar vazios pequenos.",
            },
          },
          {
            id: "infill-wall-overlap",
            label: "Sobreposição de preenchimento/parede",
            value: "15%",
            type: "percent",
            content: {
              oQueE:
                "Define quanto o infill se sobrepõe à parede para garantir uma conexão forte na interface. Parâmetro fundamental para a integridade estrutural da peça. Analogia: é a 'cola' que une duas peças de madeira — pouca cola = peças se soltam; cola suficiente = união forte.",
              porQueAjustar:
                "Conecta o infill à parede, previne lacunas na interface e melhora a resistência. Sem sobreposição adequada, o infill se descola da parede sob carga.",
              options: [
                { value: "0–10%", uso: "Peças decorativas", resultado: "Pouca sobreposição" },
                { value: "15–25% — PADRÃO", uso: "Uso geral", resultado: "Sobreposição média" },
                { value: "30–40%", uso: "Peças estruturais", resultado: "Muita sobreposição" },
                { value: "50%", uso: "Peças de alta resistência", resultado: "Sobrepõe metade" },
              ],
              oQueInfluencia:
                "Tipo de peça (decorativa 10–15%, funcional 20–25%, estrutural 30–40%), material e número de paredes.",
              oQueGera:
                "Sobreposição correta = peça forte e parede lisa. Insuficiente = peça fraca, infill descola. Excessiva = marcas visíveis na parede.",
              regraDeOuro:
                "20% para a maioria. A sobreposição conecta o infill à parede. Nem muito, nem pouco.",
              comoConfigurar:
                "Prepare → Resistência → Sólido interno → Sobreposição de preenchimento/parede.",
            },
          },
        ],
      },
      {
        id: "avancado-preenchimento",
        label: "Avançado",
        items: [
          {
            id: "align-infill-direction",
            label: "Alinhar direção do preenchimento ao modelo",
            value: "Desativado",
            type: "checkbox",
            content: {
              oQueE:
                "Quando ativado, o OrcaSlicer orienta automaticamente as linhas do infill alinhadas com a geometria do modelo, em vez de usar sempre o ângulo fixo configurado. O slicer detecta a orientação predominante das paredes e alinha o infill a elas.",
              porQueAjustar:
                "Para peças com geometria irregular ou orgânica, alinhar o infill com a estrutura do modelo pode melhorar a distribuição de forças e criar uma aparência interna mais coerente.",
              options: [
                {
                  value: "Desativado — PADRÃO",
                  uso: "Uso geral, ângulo fixo",
                  resultado: "Infill sempre no ângulo configurado",
                },
                {
                  value: "Ativado",
                  uso: "Peças orgânicas, formas irregulares",
                  resultado: "Infill alinhado com a geometria",
                },
              ],
              oQueInfluencia:
                "Distribuição de forças no infill e aparência interna do preenchimento.",
              oQueGera:
                "Ativado melhora a coerência estrutural em peças orgânicas. Para peças simples (retangulares), não faz diferença.",
              regraDeOuro:
                "Mantenha desativado para uso geral. Ative apenas para peças orgânicas complexas onde a orientação do infill importa.",
              comoConfigurar:
                "Prepare → Resistência → Avançado → Alinhar direção do preenchimento ao modelo.",
            },
          },
          {
            id: "insert-solid-layers",
            label: "Inserir camadas sólidas",
            value: "",
            type: "number",
            content: {
              oQueE:
                "Permite inserir camadas 100% sólidas em alturas específicas da peça (em mm). Funciona como um 'reforço horizontal' em uma camada específica, criando um plano sólido de resistência no meio da peça.",
              porQueAjustar:
                "Peças que sofrem forças em pontos específicos de sua altura podem se beneficiar de uma camada sólida nessa região. É uma técnica avançada para reforço localizado sem aumentar todas as paredes ou o infill.",
              options: [
                {
                  value: "(vazio) — PADRÃO",
                  uso: "Sem camadas extras",
                  resultado: "Estrutura padrão",
                },
                {
                  value: "Altura em mm",
                  uso: "Reforço em ponto específico",
                  resultado: "Camada sólida na altura indicada",
                },
              ],
              oQueInfluencia:
                "Resistência localizada na altura configurada, tempo de impressão e consumo de filamento.",
              oQueGera:
                "Camadas sólidas inseridas criam planos de reforço horizontal que resistem a forças de compressão nessa altura.",
              regraDeOuro:
                "Deixe vazio para uso geral. Use apenas quando souber exatamente onde precisa de reforço estrutural horizontal.",
              comoConfigurar:
                "Prepare → Resistência → Avançado → Inserir camadas sólidas (altura em mm).",
            },
          },
          {
            id: "bridge-angle-external",
            label: "Direção de preenchimento de ponte externa",
            value: "0°",
            type: "number",
            content: {
              oQueE:
                "Define o ângulo das linhas do bridge infill nas pontes externas (as visíveis, na face superior). 0° significa que o OrcaSlicer detecta automaticamente a melhor direção para atravessar o vão.",
              porQueAjustar:
                "O ângulo ótimo para uma ponte é perpendicular ao vão (90° em relação às paredes de suporte). 0° = automático, deixa o slicer decidir. Manual = você força uma direção específica para casos especiais.",
              options: [
                {
                  value: "0° — PADRÃO (automático)",
                  uso: "Uso geral",
                  resultado: "Slicer detecta a melhor direção",
                },
                { value: "45°", uso: "Pontes diagonais", resultado: "Força ângulo de 45°" },
                { value: "90°", uso: "Forçar perpendicular", resultado: "Perpendicular ao eixo X" },
              ],
              oQueInfluencia:
                "Qualidade de pontes externas, necessidade de suporte e aparência da face inferior.",
              oQueGera:
                "0° automático funciona bem para a maioria. Forçar um ângulo específico só é necessário em pontes muito longas ou geometrias problemáticas.",
              regraDeOuro:
                "Deixe em 0° (automático). O OrcaSlicer detecta a melhor direção para a maioria das pontes.",
              comoConfigurar:
                "Prepare → Resistência → Avançado → Direção de preenchimento de ponte externa.",
            },
          },
          {
            id: "bridge-angle-internal",
            label: "Direção de preenchimento de ponte interna",
            value: "0°",
            type: "number",
            content: {
              oQueE:
                "Define o ângulo das linhas de bridge infill nas pontes internas (camadas sólidas internas sobre vãos, não visíveis). 0° = automático.",
              porQueAjustar:
                "Pontes internas sustentam o topo da peça internamente. O ângulo automático geralmente detecta a direção certa, mas pode ser forçado para geometrias complexas.",
              options: [
                {
                  value: "0° — PADRÃO (automático)",
                  uso: "Uso geral",
                  resultado: "Slicer detecta a melhor direção",
                },
                {
                  value: "Ângulo manual",
                  uso: "Geometrias complexas",
                  resultado: "Direção forçada",
                },
              ],
              oQueInfluencia:
                "Resistência das camadas sólidas internas sobre vãos e qualidade do suporte interno.",
              oQueGera:
                "0° automático cobre a maioria dos casos. Use valores manuais apenas em geometrias muito específicas.",
              regraDeOuro: "Mantenha em 0°. O automático resolve corretamente em 99% dos casos.",
              comoConfigurar:
                "Prepare → Resistência → Avançado → Direção de preenchimento de ponte interna.",
            },
          },
          {
            id: "relative-bridge-angle",
            label: "Relative bridge angle",
            value: "Desativado",
            type: "checkbox",
            content: {
              oQueE:
                "Quando ativado, o ângulo da ponte é calculado em relação à geometria local da peça, em vez de em relação ao eixo absoluto da impressora. Permite que pontes em peças rotacionadas tenham sempre a orientação correta.",
              porQueAjustar:
                "Em peças impressas em ângulo ou com geometrias rotacionadas, o ângulo absoluto pode não ser o ideal para a ponte. O ângulo relativo compensa a rotação do modelo.",
              options: [
                {
                  value: "Desativado — PADRÃO",
                  uso: "Uso geral, ângulo absoluto",
                  resultado: "Ângulo fixo em relação à impressora",
                },
                {
                  value: "Ativado",
                  uso: "Peças rotacionadas ou inclinadas",
                  resultado: "Ângulo adaptado à geometria local",
                },
              ],
              oQueInfluencia:
                "Qualidade de pontes em peças com geometria rotacionada e orientação das linhas de bridge.",
              oQueGera:
                "Ativado = pontes sempre orientadas corretamente em relação à geometria local da peça.",
              regraDeOuro:
                "Mantenha desativado. Ative apenas se as pontes ficarem em ângulo errado em peças rotacionadas.",
              comoConfigurar: "Prepare → Resistência → Avançado → Relative bridge angle.",
            },
          },
          {
            id: "infill-minimum-area",
            label: "Limiar mínimo de preenchimento esparso",
            value: "15 mm²",
            type: "number",
            content: {
              oQueE:
                "Define a área mínima em mm² que uma região de infill esparso deve ter para ser preenchida. Regiões menores que esse valor são automaticamente convertidas em infill sólido, garantindo que pequenas ilhas internas sejam sempre sólidas.",
              porQueAjustar:
                "Pequenas regiões com infill esparso ficam estruturalmente frágeis e podem apresentar gaps no topo. Converter automaticamente para sólido garante que essas pequenas áreas sejam robustas.",
              options: [
                {
                  value: "0 mm²",
                  uso: "Sem limiar, tudo esparso",
                  resultado: "Máxima economia de material",
                },
                {
                  value: "15 mm² — PADRÃO",
                  uso: "Uso geral",
                  resultado: "Pequenas ilhas viram sólido",
                },
                {
                  value: "25–50 mm²",
                  uso: "Peças com muitas ilhas pequenas",
                  resultado: "Mais regiões convertidas para sólido",
                },
              ],
              oQueInfluencia:
                "Qualidade de pequenas ilhas internas, tempo de impressão e resistência de regiões pequenas.",
              oQueGera:
                "15 mm² garante que áreas equivalentes a um quadrado de ~4×4 mm sejam sólidas. Elimina fragilidade em detalhes pequenos.",
              regraDeOuro:
                "15 mm² é o equilíbrio ideal. Pequenas ilhas devem ser sólidas — nunca esparsas.",
              comoConfigurar:
                "Prepare → Resistência → Avançado → Limiar mínimo de preenchimento esparso.",
            },
          },
          {
            id: "infill-combine",
            label: "Combinar preenchimento",
            value: "Desativado",
            type: "checkbox",
            content: {
              oQueE:
                "Permite que o infill 'pule' camadas — uma linha de infill mais grossa é depositada a cada 2 ou mais camadas em vez de uma por camada. Reduz o número de linhas de infill e pode acelerar a impressão.",
              porQueAjustar:
                "Em impressoras lentas ou para infills muito densos, combinar o preenchimento pode economizar tempo sem perda significativa de resistência, desde que a altura combinada não exceda 75% do diâmetro do bico.",
              options: [
                {
                  value: "Desativado — PADRÃO",
                  uso: "Uso geral, melhor qualidade",
                  resultado: "Infill em cada camada",
                },
                {
                  value: "Ativado",
                  uso: "Impressões longas, infill denso",
                  resultado: "Infill a cada 2+ camadas, mais rápido",
                },
              ],
              oQueInfluencia:
                "Velocidade de impressão, resistência interna e qualidade das camadas de transição para o topo.",
              oQueGera:
                "Desativado = melhor qualidade. Ativado = pode acelerar em 10–20% em infills altos.",
              regraDeOuro:
                "Mantenha desativado. O ganho de velocidade raramente justifica o risco de comprometer a qualidade do topo.",
              comoConfigurar: "Prepare → Resistência → Avançado → Combinar preenchimento.",
            },
          },
          {
            id: "detect-narrow-infill",
            label: "Detectar preenchimentos sólidos internos estreitos",
            value: "Ativado",
            type: "checkbox",
            content: {
              oQueE:
                "Detecta regiões estreitas que receberiam preenchimento sólido interno (entre infill esparso e topo/base) e adapta a estratégia de impressão para essas regiões. Evita excesso de material ou zig-zags desnecessários em corredores estreitos.",
              porQueAjustar:
                "Sem esta detecção, o slicer pode tentar imprimir linhas sólidas em espaços muito estreitos, causando pressão excessiva, blobs ou falhas. Com a detecção ativa, o slicer adapta a trajetória.",
              options: [
                {
                  value: "Ativado — PADRÃO",
                  uso: "Uso geral",
                  resultado: "Regiões estreitas tratadas corretamente",
                },
                {
                  value: "Desativado",
                  uso: "Raro, debug apenas",
                  resultado: "Sem adaptação para regiões estreitas",
                },
              ],
              oQueInfluencia:
                "Qualidade de regiões de transição sólida estreitas, blobs e qualidade geral das camadas sólidas.",
              oQueGera:
                "Ativado = menos blobs e falhas em regiões de preenchimento sólido estreitas.",
              regraDeOuro: "Mantenha sempre ativado. Raramente há razão para desativar.",
              comoConfigurar:
                "Prepare → Resistência → Avançado → Detectar preenchimentos sólidos internos estreitos.",
            },
          },
          {
            id: "top-shell-guarantee",
            label: "Garantir a espessura vertical da casca",
            value: "Todos",
            type: "dropdown",
            content: {
              oQueE:
                "Controla em quais superfícies o OrcaSlicer garante a espessura mínima da casca (número mínimo de camadas sólidas). 'Todos' = garante tanto no topo quanto na base. 'Topo' = apenas nas faces superiores. 'Base' = apenas nas faces inferiores.",
              porQueAjustar:
                "Em peças com geometrias complexas, pode haver faces inclinadas que o slicer trata como topo ou base. Controlar onde a espessura é garantida evita excesso de material em faces que não precisam de casca completa.",
              options: [
                {
                  value: "Todos — PADRÃO",
                  uso: "Uso geral, máxima cobertura",
                  resultado: "Topo e base com espessura garantida",
                },
                {
                  value: "Topo",
                  uso: "Apenas face superior importa",
                  resultado: "Somente topo com casca garantida",
                },
                {
                  value: "Base",
                  uso: "Apenas face inferior importa",
                  resultado: "Somente base com casca garantida",
                },
                {
                  value: "Nenhum",
                  uso: "Máxima velocidade, sem garantia",
                  resultado: "Sem verificação de espessura mínima",
                },
              ],
              oQueInfluencia:
                "Qualidade das faces sólidas, tempo de impressão e robustez de topo e base.",
              oQueGera:
                "Todos = máxima garantia de qualidade no topo e na base. É o padrão mais seguro para uso geral.",
              regraDeOuro:
                "Mantenha em Todos. Só altere se tiver uma razão específica para tratar topo e base de forma diferente.",
              comoConfigurar:
                "Prepare → Resistência → Avançado → Garantir a espessura vertical da casca.",
            },
          },
        ],
      },
    ],
  },
  {
    id: "velocidade",
    label: "Velocidade",
    icon: "⚡",
    tela: "Telas 08-10",
    groups: [
      primeiraCamadaVelGroup,
      outrasCamadasVelGroup,
      saliaciasVelGroup,
      deslocamentoVelGroup,
      aceleracaoVelGroup,
      jerkXYGroup,
      avancadoVelGroup,
    ],
  },
  {
    id: "suporte",
    label: "Suporte",
    icon: "🌲",
    tela: "Telas 11-13",
    groups: [
      suporteBasicoGroup,
      jangadaSupGroup,
      filamentoSuporteSupGroup,
      alisamentoSuporteSupGroup,
      suporteAvancadoGroup,
    ],
  },
  {
    id: "multimaterial",
    label: "Multimaterial",
    icon: "🎨",
    tela: "Telas 14-15",
    groups: [
      torrePreparoMMGroup,
      filamentoRecursosMMGroup,
      prevencaoVazamentoMMGroup,
      opcoesPurgaMMGroup,
      avancadoMMGroup,
    ],
  },
  {
    id: "outros",
    label: "Outros",
    icon: "⚙️",
    tela: "Telas 16-17",
    groups: [
      filamentoBasicoOutGroup,
      saiaOutGroup,
      bordaOutGroup,
      modoEspecialOutGroup,
      texturaDifusaOutGroup,
      opcoesGcodeOutGroup,
    ],
  },
];
