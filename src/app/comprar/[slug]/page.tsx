import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  Calendar,
  Gauge,
  MapPin,
  MessageCircle,
  Palette,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Footer } from "@/components/footer";
import { LeadForm } from "@/components/lead-form";
import { SiteHeader } from "@/components/site-header";
import { TopBannerAd } from "@/components/top-banner-ad";
import { VehicleCard } from "@/components/vehicle-card";
import { inventory } from "@/data/inventory";
import { formatBRL, formatMileage } from "@/lib/format";
import { getInventory, getVehicleBySlug } from "@/lib/inventory-store";
import { makeVehicleInterestUrl, WHATSAPP_FINANCE_URL } from "@/lib/links";

export const revalidate = 300;

type VehicleDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const trustNotes = [
  "Fotos reais e informacoes organizadas para facilitar sua analise.",
  "Contato direto pelo WhatsApp para tirar duvidas antes da visita.",
  "Recomendamos analise documental, vistoria e conferencia presencial ou especializada.",
];

export function generateStaticParams() {
  return inventory.map((vehicle) => ({
    slug: vehicle.slug,
  }));
}

export async function generateMetadata({ params }: VehicleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    return {};
  }

  return {
    title: `${vehicle.name} ${vehicle.year} a venda`,
    description: `${vehicle.name} ${vehicle.year} a venda em ${vehicle.location}. Veja preco, fotos, preparacao, detalhes e fale pelo WhatsApp.`,
    openGraph: {
      title: `${vehicle.name} | TurboClass`,
      description: `${vehicle.preparation} em ${vehicle.location}.`,
      images: [{ url: vehicle.image }],
    },
  };
}

function businessLabel(value: string) {
  return value
    .split("-")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
}

export default async function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const { slug } = await params;
  const [vehicle, allVehicles] = await Promise.all([getVehicleBySlug(slug), getInventory()]);

  if (!vehicle) {
    notFound();
  }

  const related = allVehicles
    .filter((item) => item.id !== vehicle.id)
    .filter(
      (item) =>
        item.make === vehicle.make ||
        item.state === vehicle.state ||
        item.engineType === vehicle.engineType ||
        Math.abs(item.price - vehicle.price) <= 70000,
    )
    .slice(0, 3);
  const specs = [
    { label: "Ano/modelo", value: `${vehicle.year}/${vehicle.yearModel}`, icon: Calendar },
    { label: "KM", value: `${formatMileage(vehicle.mileage)} km`, icon: Gauge },
    { label: "Cambio", value: vehicle.transmission, icon: Banknote },
    { label: "Combustivel", value: vehicle.fuel, icon: ShieldCheck },
    { label: "Motorizacao", value: vehicle.engineType, icon: Wrench },
    { label: "Preparacao", value: vehicle.preparation, icon: BadgeCheck },
    { label: "Potencia", value: vehicle.power, icon: Gauge },
    { label: "Cor", value: vehicle.color, icon: Palette },
    { label: "Final da placa", value: vehicle.plateFinal, icon: ShieldCheck },
    { label: "Negocio", value: businessLabel(vehicle.businessType), icon: Banknote },
  ];

  return (
    <>
      <main className="detail-page">
        <section className="detail-hero">
          <TopBannerAd />
          <SiteHeader />
          <div className="detail-wrap">
            <Link href="/comprar" className="back-link">
              <ArrowLeft size={17} aria-hidden="true" />
              Voltar ao estoque
            </Link>

            <div className="detail-grid marketplace-detail-grid">
              <div className="detail-gallery">
                <div className="detail-media">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    priority
                    sizes="(max-width: 900px) 100vw, 58vw"
                  />
                </div>
                <div className="gallery-thumbs" aria-label="Galeria do veiculo">
                  {vehicle.gallery.slice(0, 6).map((image, index) => (
                    <a key={`${image}-${index}`} href={image} target="_blank" rel="noreferrer">
                      <Image src={image} alt={`${vehicle.name} foto ${index + 1}`} fill sizes="120px" />
                    </a>
                  ))}
                </div>
              </div>

              <aside className="detail-summary" aria-label="Resumo do veiculo">
                <span className="detail-badge" data-status={vehicle.status}>
                  {vehicle.status}
                </span>
                <p className="vehicle-year">
                    {vehicle.make} / {vehicle.version}
                </p>
                <h1>{vehicle.name}</h1>
                <strong className="detail-price">{formatBRL(vehicle.price)}</strong>
                <span className="detail-payment">A partir de {formatBRL(vehicle.monthlyPayment)}/mes</span>

                <div className="detail-specs">
                  <span>
                    <MapPin size={18} aria-hidden="true" />
                    {vehicle.location}
                  </span>
                  <span>
                    <Gauge size={18} aria-hidden="true" />
                    {vehicle.engineType} / {vehicle.preparation}
                  </span>
                  <span>
                    <Banknote size={18} aria-hidden="true" />
                    {businessLabel(vehicle.businessType)}
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

                <Link href={makeVehicleInterestUrl(vehicle.name, vehicle.slug)} className="primary-button detail-button" target="_blank" rel="noreferrer">
                  Chamar no WhatsApp
                  <MessageCircle size={18} aria-hidden="true" />
                </Link>
                <Link href="#interesse" className="secondary-button detail-button">
                  Tenho interesse
                </Link>
                <Link href={WHATSAPP_FINANCE_URL} className="text-button detail-button" target="_blank" rel="noreferrer">
                  Simular financiamento
                </Link>
              </aside>
            </div>
          </div>
        </section>

        <section className="section detail-content-section">
          <div className="detail-info-grid">
            {specs.map((spec) => {
              const Icon = spec.icon;
              return (
                <article key={spec.label} className="spec-card">
                  <Icon size={18} aria-hidden="true" />
                  <span>{spec.label}</span>
                  <strong>{spec.value}</strong>
                </article>
              );
            })}
          </div>

          <div className="detail-two-columns">
            <article>
              <span className="eyebrow">Descricao</span>
              <h2>Detalhes do anuncio</h2>
              <p>{vehicle.description}</p>
            </article>

            <article>
              <span className="eyebrow">Preparacao e upgrades</span>
              <h2>Setup informado</h2>
              <div className="upgrade-list">
                {vehicle.upgrades.length ? (
                  vehicle.upgrades.map((upgrade) => (
                    <div key={`${upgrade.label}-${upgrade.value}`}>
                      <span>{upgrade.label}</span>
                      <strong>{upgrade.value}</strong>
                    </div>
                  ))
                ) : (
                  <p>Upgrades e preparacao sob consulta com o anunciante.</p>
                )}
              </div>
            </article>
          </div>

          <div className="trust-disclaimer">
            <div>
              <span className="eyebrow">Informacoes de confianca</span>
              <h2>Negociacao com informacao e cuidado</h2>
            </div>
            <div className="trust-grid">
              {trustNotes.map((note) => (
                <article key={note} className="trust-item">
                  <ShieldCheck size={22} aria-hidden="true" />
                  <p>{note}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="lead-detail-box" id="interesse">
            <LeadForm
              kind="interesse"
              title="Tenho interesse neste veiculo"
              submitLabel="Enviar interesse"
              vehicleId={vehicle.id}
              vehicleName={vehicle.name}
            />
          </div>
        </section>

        {related.length ? (
          <section className="section inventory-section">
            <div className="section-heading">
              <span className="eyebrow">Voce tambem pode gostar</span>
              <div>
                <h2>Veiculos parecidos</h2>
                <Link href="/comprar" className="section-link">
                  Ver estoque
                </Link>
              </div>
            </div>
            <div className="vehicle-grid">
              {related.map((item) => (
                <VehicleCard key={item.id} vehicle={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
