#!/usr/bin/env node
/**
 * Patch para corrigir incompatibilidade entre nitro@3.x beta e Vite 6.
 * O plugin nitro:vite tenta acessar `this.meta.rolldownVersion` durante o hook `config`,
 * mas no Vite 6 esse objeto é undefined nessa fase, causando crash no build.
 * Este script aplica optional chaining (`this?.meta?.rolldownVersion`) no bundle do nitro.
 */
const fs = require("fs");
const path = require("path");

const nitroVitePath = path.resolve(__dirname, "../node_modules/nitro/dist/vite.mjs");

if (!fs.existsSync(nitroVitePath)) {
  console.log("[patch-nitro] nitro/dist/vite.mjs not found, skipping.");
  process.exit(0);
}

let code = fs.readFileSync(nitroVitePath, "utf-8");
const original = code;

// Patch: this.meta.rolldownVersion → this?.meta?.rolldownVersion
code = code.replace(
  /!!this\.meta\.rolldownVersion/g,
  "!!this?.meta?.rolldownVersion",
);

if (code !== original) {
  fs.writeFileSync(nitroVitePath, code, "utf-8");
  console.log("[patch-nitro] Patched nitro/dist/vite.mjs for Vite 6 compatibility.");
} else {
  console.log("[patch-nitro] No patch needed (already patched or pattern not found).");
}
