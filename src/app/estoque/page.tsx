import { redirect } from "next/navigation";

export const revalidate = 300;

type EstoqueRedirectPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function buildQuery(params: Record<string, string | string[] | undefined>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
      return;
    }

    if (value) {
      query.set(key, value);
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export default async function EstoqueRedirectPage({ searchParams }: EstoqueRedirectPageProps) {
  redirect(`/comprar${buildQuery((await searchParams) ?? {})}`);
}
