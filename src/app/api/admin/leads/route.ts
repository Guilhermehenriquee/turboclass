import { verifyAdminRequest } from "@/lib/admin-auth";
import { getLeads } from "@/lib/lead-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = verifyAdminRequest(request);

  if (!auth.ok) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const leads = await getLeads();

  return Response.json({
    data: leads,
    total: leads.length,
  });
}
