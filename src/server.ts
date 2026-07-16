import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function applySecurityAndOptimizationHeaders(response: Response, requestUrl: string): Response {
  if (!response) return response;

  const newHeaders = new Headers(response.headers);

  // 1. SECURITY HEADERS
  newHeaders.set("X-Content-Type-Options", "nosniff");
  newHeaders.set("X-XSS-Protection", "1; mode=block");
  newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
  newHeaders.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  
  // Content Security Policy (CSP): Protects against XSS, injection, and clickjacking
  // Frame-ancestors is designed to allow Google AI Studio and run.app framing, while blocking malicious overlays
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://*.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://storage.googleapis.com https://*.supabase.co https://images.unsplash.com",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.run.app",
    "frame-ancestors 'self' https://ai.studio https://*.google.com https://*.run.app",
    "upgrade-insecure-requests"
  ];
  newHeaders.set("Content-Security-Policy", cspDirectives.join("; "));

  // Strict-Transport-Security (HSTS)
  newHeaders.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

  // 2. OPTIMIZATION / CACHING HEADERS
  const urlLower = requestUrl.toLowerCase();
  const isStaticAsset =
    urlLower.includes("/assets/") ||
    urlLower.includes("/static/") ||
    /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|otf|json)$/.test(urlLower);

  if (isStaticAsset) {
    // Cache static assets aggressively (1 year) with immutable flag
    newHeaders.set("Cache-Control", "public, max-age=31536000, immutable");
  } else {
    // For HTML / SSR / API responses, prevent caching sensitive or dynamic data
    newHeaders.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const urlString = request.url || "";
    const isServerFnOrApi =
      urlString.includes("/_server") ||
      urlString.includes("/api") ||
      urlString.includes("_server_id=");

    try {
      const handler = await getServerEntry();
      let response = await handler.fetch(request, env, ctx);

      // Bypass error normalization for server functions and APIs
      if (!isServerFnOrApi) {
        response = await normalizeCatastrophicSsrResponse(response);
      }

      return applySecurityAndOptimizationHeaders(response, urlString);
    } catch (error) {
      console.error("Catastrophic error in server.ts fetch:", error);

      let errorResponse: Response;
      if (isServerFnOrApi) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        errorResponse = new Response(JSON.stringify({ error: errorMessage }), {
          status: 500,
          headers: { "content-type": "application/json; charset=utf-8" },
        });
      } else {
        errorResponse = new Response(renderErrorPage(), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }

      return applySecurityAndOptimizationHeaders(errorResponse, urlString);
    }
  },
};
