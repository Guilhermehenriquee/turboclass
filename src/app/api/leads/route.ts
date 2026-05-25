import { createLead, LeadStoreError } from "@/lib/lead-store";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { readJsonBody, RequestBodyError } from "@/lib/request-body";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getErrorResponse(error: unknown) {
  if (error instanceof LeadStoreError || error instanceof RequestBodyError) {
    return Response.json({ error: error.message }, { status: error.status });
  }

  console.error("Erro ao salvar lead.", error);
  return Response.json({ error: "Nao foi possivel enviar os dados." }, { status: 500 });
}

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(`lead:${getClientIp(request)}`, 12);

  if (!rateLimit.ok) {
    return Response.json({ error: "Muitas tentativas. Aguarde alguns minutos." }, { status: 429 });
  }

  try {
    const body = await readJsonBody<unknown>(request, 64 * 1024);
    const lead = await createLead(body);

    return Response.json({ data: lead }, { status: 201 });
  } catch (error) {
    return getErrorResponse(error);
  }
}
