import { useEffect } from "react";

/**
 * Camada anti-cópia para o conteúdo pago do curso.
 * Não é 100% inquebrável (nenhuma é), mas eleva significativamente a barreira
 * contra cópia casual, print de tela em massa, extração via seleção/arrasto,
 * DevTools e atalhos comuns. Usada apenas nas áreas protegidas (após login).
 */
export function useContentProtection(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;

    const prevent = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      // Bloqueia atalhos comuns de cópia / salvar / imprimir / DevTools
      if ((e.ctrlKey || e.metaKey) && ["c", "x", "a", "s", "p", "u"].includes(k)) {
        e.preventDefault();
        return false;
      }
      // F12 e Ctrl+Shift+I/J/C — DevTools
      if (k === "f12") {
        e.preventDefault();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(k)) {
        e.preventDefault();
        return false;
      }
      // PrintScreen — limpa clipboard como deterrente
      if (k === "printscreen") {
        try {
          navigator.clipboard?.writeText("© OrcaSlicer Pro — conteúdo protegido");
        } catch {}
      }
    };

    const onCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      try {
        e.clipboardData?.setData(
          "text/plain",
          "© OrcaSlicer Pro — conteúdo protegido por direitos autorais. Compre em orcaslicer.lovable.app",
        );
      } catch {}
    };

    document.addEventListener("contextmenu", prevent);
    document.addEventListener("dragstart", prevent);
    document.addEventListener("selectstart", prevent);
    document.addEventListener("copy", onCopy as EventListener);
    document.addEventListener("cut", onCopy as EventListener);
    document.addEventListener("keydown", onKey);

    // Classe global para desabilitar seleção via CSS
    document.body.classList.add("content-protected");

    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("dragstart", prevent);
      document.removeEventListener("selectstart", prevent);
      document.removeEventListener("copy", onCopy as EventListener);
      document.removeEventListener("cut", onCopy as EventListener);
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("content-protected");
    };
  }, [enabled]);
}
