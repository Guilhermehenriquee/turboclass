import Link from "next/link";
import { ArrowLeft, ArrowRight, CarFront, SlidersHorizontal } from "lucide-react";
import { Footer } from "@/components/footer";
import { SearchPanel } from "@/components/search-panel";
import { SiteHeader } from "@/components/site-header";
import { TopBannerAd } from "@/components/top-banner-ad";
import { VehicleCard } from "@/components/vehicle-card";
import { searchOptions } from "@/data/inventory";
import { getFilteredInventory, getInventory } from "@/lib/inventory-store";

export const revalidate = 300;

type ComprarPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function optionLabel(value: string) {
  return value
    .split("-")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
}

export default async function ComprarPage({ searchParams }: ComprarPageProps) {
  const params = (await searchParams) ?? {};
  const filters = {
    q: getSingleParam(params.q),
    body: getSingleParam(params.body),
    make: getSingleParam(params.make),
    condition: getSingleParam(params.condition),
    offer: getSingleParam(params.offer),
    price: getSingleParam(params.price),
    minPrice: getSingleParam(params.minPrice),
    maxPrice: getSingleParam(params.maxPrice),
    minYear: getSingleParam(params.minYear),
    maxYear: getSingleParam(params.maxYear),
    location: getSingleParam(params.location),
    city: getSingleParam(params.city),
    state: getSingleParam(params.state),
    engineType: getSingleParam(params.engineType),
    preparation: getSingleParam(params.preparation),
    transmission: getSingleParam(params.transmission),
    fuel: getSingleParam(params.fuel),
    businessType: getSingleParam(params.businessType),
    status: getSingleParam(params.status),
    sort: getSingleParam(params.sort),
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
              Encontre carros turbo, preparados, swaps e veiculos diferenciados em todo o Brasil.
            </p>
          </div>
        </section>

        <section className="section inventory-search-section">
          <SearchPanel compact activeTab={activeTab} />
        </section>

        <section className="section advanced-filter-section" aria-label="Filtros avancados">
          <div className="section-heading">
            <span className="eyebrow">
              <SlidersHorizontal size={15} aria-hidden="true" />
              Filtros avancados
            </span>
            <div>
              <h2>Refine por setup, preco, ano e negocio</h2>
              <Link href="/comprar" className="section-link">
                Limpar filtros
              </Link>
            </div>
          </div>

          <form className="advanced-filters" action="/comprar">
            <label>
              Cidade
              <input name="city" placeholder="Cuiaba, Sao Paulo..." defaultValue={filters.city} />
            </label>
            <label>
              Estado
              <select name="state" defaultValue={filters.state ?? ""}>
                <option value="">Todos</option>
                {searchOptions.states.slice(1).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Preco minimo
              <input name="minPrice" inputMode="numeric" placeholder="100000" defaultValue={filters.minPrice} />
            </label>
            <label>
              Preco maximo
              <input name="maxPrice" inputMode="numeric" placeholder="350000" defaultValue={filters.maxPrice} />
            </label>
            <label>
              Ano inicial
              <input name="minYear" inputMode="numeric" placeholder="2010" defaultValue={filters.minYear} />
            </label>
            <label>
              Ano final
              <input name="maxYear" inputMode="numeric" placeholder="2026" defaultValue={filters.maxYear} />
            </label>
            <label>
              Motorizacao
              <select name="engineType" defaultValue={filters.engineType ?? ""}>
                <option value="">Todas</option>
                {searchOptions.engineTypes.slice(1).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Preparacao
              <select name="preparation" defaultValue={filters.preparation ?? ""}>
                <option value="">Todas</option>
                {searchOptions.preparations.slice(1).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Cambio
              <select name="transmission" defaultValue={filters.transmission ?? ""}>
                <option value="">Todos</option>
                {searchOptions.transmissions.slice(1).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Combustivel
              <select name="fuel" defaultValue={filters.fuel ?? ""}>
                <option value="">Todos</option>
                {searchOptions.fuels.slice(1).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Tipo de negocio
              <select name="businessType" defaultValue={filters.businessType ?? ""}>
                <option value="">Todos</option>
                {searchOptions.businessTypes.slice(1).map((item) => (
                  <option key={item} value={item}>
                    {optionLabel(item)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select name="status" defaultValue={filters.status ?? ""}>
                <option value="">Todos</option>
                {searchOptions.statuses.slice(1).map((item) => (
                  <option key={item} value={item}>
                    {optionLabel(item)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Ordenacao
              <select name="sort" defaultValue={filters.sort ?? "mais-recentes"}>
                {searchOptions.sort.map((item) => (
                  <option key={item} value={item}>
                    {optionLabel(item)}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="primary-button">
              Aplicar filtros
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </form>
        </section>

        <section className="section inventory-listing">
          <div className="section-heading">
            <span className="eyebrow">Resultado</span>
            <div>
              <h2>Selecionados para voce</h2>
              <Link href="/vender" className="section-link">
                Anunciar um carro
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
