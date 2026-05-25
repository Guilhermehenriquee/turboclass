import { getFilteredInventory, getInventory } from "@/lib/inventory-store";

export const revalidate = 60;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const filters = {
    q: url.searchParams.get("q") ?? undefined,
    body: url.searchParams.get("body") ?? undefined,
    make: url.searchParams.get("make") ?? undefined,
    condition: url.searchParams.get("condition") ?? undefined,
    offer: url.searchParams.get("offer") ?? undefined,
    price: url.searchParams.get("price") ?? undefined,
    location: url.searchParams.get("location") ?? undefined,
  };
  const hasFilters = Object.values(filters).some(Boolean);
  const vehicles = hasFilters ? await getFilteredInventory(filters) : await getInventory();

  return Response.json(
    {
      data: vehicles,
      total: vehicles.length,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
      },
    },
  );
}
