import { revalidatePath } from "next/cache";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { createVehicle, InventoryStoreError } from "@/lib/inventory-store";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";
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

  console.error("Erro ao cadastrar veiculo.", error);
  return Response.json({ error: "Nao foi possivel cadastrar o veiculo." }, { status: 500 });
}

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(`admin:vehicle:${getClientIp(request)}`);

  if (!rateLimit.ok) {
    return Response.json({ error: "Muitas tentativas. Aguarde alguns minutos." }, { status: 429 });
  }

  const auth = verifyAdminRequest(request);

  if (!auth.ok) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  try {
    const body = await readJsonBody<unknown>(request);
    const vehicle = await createVehicle(body);
    revalidateInventory();

    return Response.json({ data: vehicle }, { status: 201 });
  } catch (error) {
    return getErrorResponse(error);
  }
}
