import { inventory } from "@/data/inventory";

export const runtime = "edge";
export const revalidate = 60;

export async function GET() {
  return Response.json(
    {
      data: inventory,
      total: inventory.length,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=3600",
      },
    },
  );
}
