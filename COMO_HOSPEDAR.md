# Como subir esse site no GitHub Pages

Este projeto já vem com um build separado (`build:spa`) que gera um site 100% estático
(sem servidor), pronto pro GitHub Pages. Ele foi testado aqui e o build funciona sem erros.

## Passo a passo

1. **Crie o repositório no GitHub** (ex: `orcaslicer`, `orcaslicer-pro`, etc — o nome que você escolher importa, veja o passo 2).

2. **Ajuste o "base path"** — MUITO IMPORTANTE:
   - Abra o arquivo `vite.config.spa.ts`
   - Tem a linha: `base: "/orcaslicer/"`
   - Troque `orcaslicer` pelo **nome exato do seu repositório** no GitHub (respeitando maiúsculas/minúsculas).
   - Ex: se o repo for `github.com/seuuser/curso-orca`, a linha deve ficar `base: "/curso-orca/"`.
   - Se você não trocar isso, o site sobe mas fica sem CSS/JS (tela em branco).

3. **Suba os arquivos pro repositório** (git init, add, commit, push na branch `main`).

4. **Ative o GitHub Pages via Actions**:
   - No repositório: Settings → Pages → em "Build and deployment", escolha **Source: GitHub Actions**.
   - O workflow em `.github/workflows/deploy.yml` já está pronto: a cada push na `main`,
     ele instala as dependências, roda `npm run build:spa` e publica a pasta `dist` automaticamente.

5. Depois do primeiro push, acompanhe em **Actions** no GitHub. Quando o workflow terminar
   (ícone verde), o site estará em `https://seuuser.github.io/nome-do-repo/`.

## Sobre as partes com IA/Supabase

Este projeto tem código de servidor (Gemini API, Supabase, área de admin) que **não roda**
no GitHub Pages, porque Pages só serve arquivos estáticos, sem backend. O build `build:spa`
já ignora essa parte e gera só a versão client-side (curso, simulador de calibração, imagens
dos guias). Se alguma tela específica depender de chamada de servidor (ex: login/admin,
geração de PDF via IA), ela pode não funcionar hospedada assim — me avise se quiser que eu
veja isso com mais calma.
