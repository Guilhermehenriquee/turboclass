import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  CalendarCheck,
  CarFront,
  Gauge,
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
import { WHATSAPP_ANNOUNCE_URL } from "@/lib/links";

export const revalidate = 3600;

const stats = [
  { label: "Projetos e turbos", value: "141+" },
  { label: "Aprovacao media", value: "24h" },
  { label: "Gearheads atendidos", value: "9,8k" },
];

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
  { href: "/estoque", label: "Comprar carro", icon: CarFront },
  { href: "#vender", label: "Vender meu carro", icon: Gauge },
  { href: "#financiamento", label: "Simular financiamento", icon: Banknote },
];

export default async function Home() {
  const featured = (await getInventory()).slice(0, 3);

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
              <h1>TurboClass</h1>
              <p>
                Veiculos turbo, swaps, setups bem montados e compra com a fluidez de uma plataforma
                moderna para quem entende de carro.
              </p>

              <div className="hero-buttons">
                <Link href="/estoque" className="primary-button">
                  Ver estoque
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link href="#vender" className="light-button">
                  Vender meu carro
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
                Turbos prontos para acelerar
              </h2>
              <Link href="/estoque" className="section-link">
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
            <h2>Compra com cara de boutique e alma de gearhead</h2>
            <p>
              A TurboClass une curadoria, preco competitivo e atendimento especialista para quem
              quer torque, pressao e procedencia sem abrir mao de seguranca.
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
            <span className="eyebrow">Venda com curadoria</span>
            <h2>Seu carro entra na vitrine certa</h2>
            <p>
              Avaliacao comercial, fotos, proposta de troca e exposicao em uma experiencia pensada
              para compradores qualificados.
            </p>
          </div>
          <Link href={WHATSAPP_ANNOUNCE_URL} className="primary-button" target="_blank" rel="noreferrer">
            Falar com especialista
            <BadgeCheck size={18} aria-hidden="true" />
          </Link>
        </section>

        <section className="section finance-section" id="financiamento">
          <div>
            <span className="eyebrow">Financiamento</span>
            <h2>Simulacao direta, sem enrolacao</h2>
            <p>
              Combine entrada, troca e prazo antes de visitar a loja. A proposta fica pronta para
              comparacao e assinatura.
            </p>
          </div>
          <SearchPanel compact />
        </section>
      </main>

      <Footer />
    </>
  );
}
