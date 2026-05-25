export function GET() {
  return Response.json(
    {
      ok: true,
      service: "turboclass-web",
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
      },
    },
  );
}
