import { revalidatePath } from "next/cache";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { importVehicles, InventoryStoreError } from "@/lib/inventory-store";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { readJsonBody, RequestBodyError } from "@/lib/request-body";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function revalidateInventory() {
  revalidatePath("/");
  revalidatePath("/comprar");
  revalidatePath("/estoque");
}

function getErrorResponse(error: unknown) {
  if (error instanceof InventoryStoreError || error instanceof RequestBodyError) {
    return Response.json({ error: error.message }, { status: error.status });
  }

  console.error("Erro ao importar veiculos.", error);
  return Response.json({ error: "Nao foi possivel importar os veiculos." }, { status: 500 });
}

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(`admin:import:${getClientIp(request)}`, 10);

  if (!rateLimit.ok) {
    return Response.json({ error: "Muitas tentativas. Aguarde alguns minutos." }, { status: 429 });
  }

  const auth = verifyAdminRequest(request);

  if (!auth.ok) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  try {
    const body = await readJsonBody<unknown>(request, 1024 * 1024);
    const vehicles = await importVehicles(body);
    revalidateInventory();

    return Response.json({ data: vehicles, total: vehicles.length }, { status: 201 });
  } catch (error) {
    return getErrorResponse(error);
  }
}
