import { timingSafeEqual } from "crypto";

export type AdminAuthResult =
  | { ok: true }
  | {
      ok: false;
      status: 401 | 503;
      message: string;
    };

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyAdminRequest(request: Request): AdminAuthResult {
  const configuredToken = process.env.ADMIN_TOKEN?.trim();

  if (!configuredToken || configuredToken.length < 24) {
    return {
      ok: false,
      status: 503,
      message: "Configure ADMIN_TOKEN com pelo menos 24 caracteres para liberar o painel.",
    };
  }

  const authorization = request.headers.get("authorization") ?? "";
  const bearerToken = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  const headerToken = request.headers.get("x-admin-token")?.trim() ?? "";
  const providedToken = bearerToken || headerToken;

  if (!providedToken || !safeEqual(providedToken, configuredToken)) {
    return {
      ok: false,
      status: 401,
      message: "Token de administrador invalido.",
    };
  }

  return { ok: true };
}
