import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, Banknote, Gauge, MapPin, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { TopBannerAd } from "@/components/top-banner-ad";
import { inventory } from "@/data/inventory";
import { formatBRL, formatMileage } from "@/lib/format";
import { WHATSAPP_ANNOUNCE_URL } from "@/lib/links";

export const revalidate = 300;

type VehicleDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return inventory.map((vehicle) => ({
    slug: vehicle.slug,
  }));
}

export default async function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const { slug } = await params;
  const vehicle = inventory.find((item) => item.slug === slug);

  if (!vehicle) {
    notFound();
  }

  return (
    <>
      <main className="detail-page">
        <section className="detail-hero">
          <TopBannerAd />
          <SiteHeader />
          <div className="detail-wrap">
            <Link href="/estoque" className="back-link">
              <ArrowLeft size={17} aria-hidden="true" />
              Voltar ao estoque
            </Link>

            <div className="detail-grid">
              <div className="detail-media">
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 58vw"
                />
              </div>

              <aside className="detail-summary" aria-label="Resumo do veiculo">
                <span className="detail-badge">{vehicle.badge}</span>
                <p className="vehicle-year">{vehicle.year}</p>
                <h1>{vehicle.name}</h1>
                <strong className="detail-price">{formatBRL(vehicle.price)}</strong>
                <span className="detail-payment">A partir de {formatBRL(vehicle.monthlyPayment)}/mes</span>

                <div className="detail-specs">
                  <span>
                    <Gauge size={18} aria-hidden="true" />
                    {formatMileage(vehicle.mileage)} km
                  </span>
                  <span>
                    <Banknote size={18} aria-hidden="true" />
                    {vehicle.transmission}
                  </span>
                  <span>
                    <MapPin size={18} aria-hidden="true" />
                    {vehicle.location}
                  </span>
                </div>

                <div className="vehicle-tags">
                  {vehicle.tags.map((tag) => (
                    <span key={tag.label} data-variant={tag.variant}>
                      <ShieldCheck size={14} aria-hidden="true" />
                      {tag.label}
                    </span>
                  ))}
                </div>

                <Link href={WHATSAPP_ANNOUNCE_URL} className="primary-button detail-button" target="_blank" rel="noreferrer">
                  Tenho interesse
                  <BadgeCheck size={18} aria-hidden="true" />
                </Link>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
