import Link from "next/link";
import { ArrowLeft, ArrowRight, CarFront } from "lucide-react";
import { Footer } from "@/components/footer";
import { SearchPanel } from "@/components/search-panel";
import { SiteHeader } from "@/components/site-header";
import { TopBannerAd } from "@/components/top-banner-ad";
import { VehicleCard } from "@/components/vehicle-card";
import { getFilteredInventory, getInventory } from "@/lib/inventory-store";

export const revalidate = 300;

type EstoquePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function EstoquePage({ searchParams }: EstoquePageProps) {
  const params = (await searchParams) ?? {};
  const filters = {
    q: getSingleParam(params.q),
    body: getSingleParam(params.body),
    make: getSingleParam(params.make),
    condition: getSingleParam(params.condition),
    offer: getSingleParam(params.offer),
    price: getSingleParam(params.price),
    location: getSingleParam(params.location),
  };
  const [vehicles, allVehicles] = await Promise.all([getFilteredInventory(filters), getInventory()]);
  const activeTab = filters.offer ? "ofertas" : filters.condition === "seminovo" ? "seminovos" : "comprar";

  return (
    <>
      <main className="inventory-page">
        <section className="inventory-hero">
          <TopBannerAd />
          <SiteHeader />
          <div className="inventory-hero-content">
            <Link href="/" className="back-link">
              <ArrowLeft size={17} aria-hidden="true" />
              Inicio
            </Link>
            <span className="hero-kicker">
              <CarFront size={18} aria-hidden="true" />
              Estoque TurboClass
            </span>
            <h1>{vehicles.length} veiculos encontrados</h1>
            <p>
              Filtros rapidos, estoque curado e atendimento pronto para proposta, troca,
              financiamento e setups turbo.
            </p>
          </div>
        </section>

        <section className="section inventory-search-section">
          <SearchPanel compact activeTab={activeTab} />
        </section>

        <section className="section inventory-listing">
          <div className="section-heading">
            <span className="eyebrow">Resultado</span>
            <div>
              <h2>Selecionados para voce</h2>
              <Link href="#contato" className="section-link">
                Atendimento
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="vehicle-grid">
            {(vehicles.length ? vehicles : allVehicles).map((vehicle, index) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} priority={index === 0} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
