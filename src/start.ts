import { createStart, createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  const request = getRequest();
  const urlString = request?.url || "";
  const isServerFnOrApi =
    urlString.includes("/_server") ||
    urlString.includes("/api") ||
    urlString.includes("_server_id=");

  if (isServerFnOrApi) {
    return await next();
  }

  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error("errorMiddleware caught error:", error);

    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

/**
 * Security headers — hardening contra clickjacking, MIME sniffing, XSS
 * refletido, vazamento de referer e uso indevido de APIs do navegador.
 * CSP mantém 'unsafe-inline' apenas para style (Tailwind runtime + libs);
 * script fica restrito a self + subdomínios lovable.app.
 */
const securityHeadersMiddleware = createMiddleware().server(async ({ next }) => {
  const response = await next();
  const res = response as unknown as { headers?: Headers };
  if (!res.headers || typeof res.headers.set !== "function") return response;

  const contentType = res.headers.get("content-type") ?? "";
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  );
  res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  if (contentType.includes("text/html")) {
    res.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://*.lovable.app https://*.lovable.dev",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: blob: https:",
        "connect-src 'self' https://*.supabase.co https://*.lovable.app wss://*.supabase.co",
        "frame-ancestors 'self'",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
      ].join("; "),
    );
  }
  return response;
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware],
}));
