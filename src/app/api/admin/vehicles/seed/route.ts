import { revalidatePath } from "next/cache";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { InventoryStoreError, seedInitialInventory } from "@/lib/inventory-store";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getErrorResponse(error: unknown) {
  if (error instanceof InventoryStoreError) {
    return Response.json({ error: error.message }, { status: error.status });
  }

  console.error("Erro ao migrar estoque inicial.", error);
  return Response.json({ error: "Nao foi possivel migrar o estoque inicial." }, { status: 500 });
}

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(`admin:seed:${getClientIp(request)}`, 5);

  if (!rateLimit.ok) {
    return Response.json({ error: "Muitas tentativas. Aguarde alguns minutos." }, { status: 429 });
  }

  const auth = verifyAdminRequest(request);

  if (!auth.ok) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  try {
    const vehicles = await seedInitialInventory();
    revalidatePath("/");
    revalidatePath("/comprar");
    revalidatePath("/estoque");

    return Response.json({ data: vehicles, total: vehicles.length });
  } catch (error) {
    return getErrorResponse(error);
  }
}
