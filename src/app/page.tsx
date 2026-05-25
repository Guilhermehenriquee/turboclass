import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  CalendarCheck,
  CarFront,
  Gauge,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Footer } from "@/components/footer";
import { SearchPanel } from "@/components/search-panel";
import { SiteHeader } from "@/components/site-header";
import { TopBannerAd } from "@/components/top-banner-ad";
import { VehicleCard } from "@/components/vehicle-card";
import { formatBRL } from "@/lib/format";
import { getInventory } from "@/lib/inventory-store";
import { WHATSAPP_SELL_URL } from "@/lib/links";

export const revalidate = 3600;

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Procedencia conferida",
    text: "Laudo, historico e documentacao passam por uma revisao clara antes da publicacao.",
  },
  {
    icon: Banknote,
    title: "Financiamento consultivo",
    text: "Simule parcelas, entrada e troca com atendimento humano para fechar sem friccao.",
  },
  {
    icon: CalendarCheck,
    title: "Entrega combinada",
    text: "Agenda, vistoria e retirada organizadas para uma experiencia mais previsivel.",
  },
];

const quickActions = [
  { href: "/comprar", label: "Comprar carro", icon: CarFront },
  { href: "/vender", label: "Vender meu carro", icon: Gauge },
  { href: "/financiamento", label: "Simular financiamento", icon: Banknote },
];

export default async function Home() {
  const vehicles = await getInventory();
  const featured = vehicles.filter((vehicle) => vehicle.featuredOffer).slice(0, 3);
  const availableCount = vehicles.filter((vehicle) => vehicle.status === "disponivel").length;
  const stats = [
    { label: "Veiculos cadastrados", value: String(vehicles.length) },
    { label: "Anuncios disponiveis", value: String(availableCount) },
    { label: "Atendimento", value: "Nacional" },
  ];

  return (
    <>
      <main>
        <section className="hero">
          <Image
            src="/hero-performance.png"
            alt="Carro esportivo em estrada"
            fill
            priority
            sizes="100vw"
            className="hero-image"
          />
          <div className="hero-shade" aria-hidden="true" />
          <TopBannerAd />
          <SiteHeader />

          <div className="hero-content">
            <div className="hero-copy">
              <span className="hero-kicker">
                <Sparkles size={18} aria-hidden="true" />
                Gearhead marketplace
              </span>
              <h1>Carros turbo, preparados e projetos especiais em um so lugar.</h1>
              <p>
                Compre ou anuncie veiculos selecionados para quem busca performance, exclusividade
                e procedencia, com contato direto pelo WhatsApp.
              </p>

              <div className="hero-buttons">
                <Link href="/comprar" className="primary-button">
                  Ver estoque
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link href="/vender" className="light-button">
                  Anunciar meu carro
                </Link>
              </div>

              <div className="hero-stats" aria-label="Indicadores TurboClass">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <SearchPanel />
          </div>
        </section>

        <section className="action-strip" aria-label="Acoes principais">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <Icon size={22} aria-hidden="true" />
                <span>{action.label}</span>
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            );
          })}
        </section>

        <section className="section inventory-section" id="estoque">
          <div className="section-heading">
            <span className="eyebrow">Estoque em destaque</span>
            <div>
              <h2>
                Carros que merecem mais do que um classificado comum
              </h2>
              <Link href="/comprar" className="section-link">
                Ver todos
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="vehicle-grid">
            {featured.map((vehicle, index) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} priority={index === 0} />
            ))}
          </div>
        </section>

        <section className="section difference-section" id="diferenciais">
          <div className="difference-copy">
            <span className="eyebrow">Nosso diferencial</span>
            <h2>A Webmotors dos carros preparados, com foco de nicho e vitrine premium</h2>
            <p>
              A TurboClass organiza anuncios de carros turbo, swaps, preparados, esportivos e
              premium em uma experiencia feita para quem procura setup, informacao e contato rapido.
            </p>
            <div className="trust-grid">
              {trustItems.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="trust-item">
                    <Icon size={22} aria-hidden="true" />
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="difference-media">
            <Image
              src="/vehicle-suv.png"
              alt="SUV premium selecionado pela TurboClass"
              fill
              sizes="(max-width: 900px) 100vw, 44vw"
            />
            <div className="price-chip">
              <span>Ticket medio</span>
              <strong>{formatBRL(218000)}</strong>
            </div>
          </div>
        </section>

        <section className="sell-band" id="vender">
          <div>
            <span className="eyebrow">Venda para o publico certo</span>
            <h2>Seu projeto nao nasceu para se perder em anuncio generico</h2>
            <p>
              Anuncie turbo, swap, projeto especial ou premium em uma vitrine pensada para
              compradores que entendem o valor do conjunto.
            </p>
          </div>
          <Link href="/vender" className="primary-button">
            Anunciar meu carro
            <BadgeCheck size={18} aria-hidden="true" />
          </Link>
          <Link href={WHATSAPP_SELL_URL} className="light-button" target="_blank" rel="noreferrer">
            WhatsApp
            <MessageCircle size={18} aria-hidden="true" />
          </Link>
        </section>

        <section className="section finance-section" id="financiamento">
          <div>
            <span className="eyebrow">Financiamento</span>
            <h2>Simulacao direta, com atendimento personalizado</h2>
            <p>
              Informe o veiculo, entrada e prazo desejado para receber uma pre-analise orientativa.
              A simulacao depende da avaliacao das instituicoes financeiras parceiras.
            </p>
          </div>
          <SearchPanel compact />
        </section>
      </main>

      <Footer />
    </>
  );
}
