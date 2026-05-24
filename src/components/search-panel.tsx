import Link from "next/link";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import { searchOptions } from "@/data/inventory";

type SearchPanelProps = {
  compact?: boolean;
  activeTab?: "comprar" | "seminovos" | "ofertas";
};

const tabs = [
  { id: "comprar", label: "Comprar", href: "/estoque" },
  { id: "seminovos", label: "Seminovos", href: "/estoque?condition=seminovo" },
  { id: "ofertas", label: "Ofertas", href: "/estoque?offer=turbo" },
] as const;

export function SearchPanel({ compact = false, activeTab = "comprar" }: SearchPanelProps) {
  return (
    <section className={compact ? "search-panel compact-panel" : "search-panel"} aria-label="Busca de veiculos">
      <div className="search-tabs" role="tablist" aria-label="Tipo de busca">
        {tabs.map((tab) => (
          <Link key={tab.id} href={tab.href} role="tab" aria-selected={activeTab === tab.id}>
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="search-heading">
        <div>
          <span className="eyebrow">Busca rapida</span>
          <h2>{compact ? "Encontre seu TurboClass" : "Busque turbos, setups e projetos"}</h2>
        </div>
        <a href="/estoque" className="advanced-link">
          <SlidersHorizontal size={16} aria-hidden="true" />
          Avancada
        </a>
      </div>

      <form className="search-form" action="/estoque">
        <label className="field">
          <span>Palavra-chave</span>
          <input name="q" type="search" placeholder="Modelo, versao ou cidade" />
        </label>

        <label className="field">
          <span>Marca</span>
          <select name="make" defaultValue="">
            <option value="">Todas as marcas</option>
            {searchOptions.makes.slice(1).map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Carroceria</span>
          <select name="body" defaultValue="">
            <option value="">Todos os modelos</option>
            {searchOptions.models.slice(1).map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Preco</span>
          <select name="price" defaultValue="">
            <option value="">Faixa de preco</option>
            {searchOptions.prices.map((price) => (
              <option key={price} value={price}>
                {price}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Localizacao</span>
          <select name="location" defaultValue="">
            <option value="">Todo o Brasil</option>
            {searchOptions.locations.slice(1).map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="primary-search">
          <Search size={18} aria-hidden="true" />
          <span>Buscar veiculos</span>
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}
