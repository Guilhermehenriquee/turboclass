import { redirect } from "next/navigation";

export const revalidate = 300;

type LegacyVehiclePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function LegacyVehiclePage({ params }: LegacyVehiclePageProps) {
  const { slug } = await params;
  redirect(`/comprar/${slug}`);
}
