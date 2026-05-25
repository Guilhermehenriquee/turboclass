import Link from "next/link";
import { ArrowLeft, BadgeCheck, CarFront, Gauge } from "lucide-react";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { TopBannerAd } from "@/components/top-banner-ad";

export const revalidate = 3600;

const blocks = [
  {
    icon: BadgeCheck,
    title: "Nossa missao",
    text: "Criar a principal vitrine de carros preparados e diferenciados do Brasil.",
  },
  {
    icon: CarFront,
    title: "Para compradores",
    text: "Facilitar a busca por veiculos especiais, com filtros especificos, informacoes claras e contato rapido.",
  },
  {
    icon: Gauge,
    title: "Para vendedores",
    text: "Oferecer uma vitrine mais qualificada para carros que merecem ser vistos pelo publico certo.",
  },
];

export default function SobrePage() {
  return (
    <>
      <main className="content-page">
        <section className="content-hero">
          <TopBannerAd />
          <SiteHeader />
          <div className="conversion-wrap">
            <Link href="/" className="back-link">
              <ArrowLeft size={17} aria-hidden="true" />
              Inicio
            </Link>
            <span className="hero-kicker">Sobre a TurboClass</span>
            <h1>Uma plataforma para carros que nao cabem em classificados comuns.</h1>
            <p>
              A TurboClass nasceu para conectar apaixonados por carros diferenciados a oportunidades
              reais de compra e venda em todo o Brasil.
            </p>
          </div>
        </section>

        <section className="section content-section">
          <article>
            <span className="eyebrow">Nossa historia</span>
            <h2>Especialistas em nicho gearhead</h2>
            <p>
              Nosso foco esta em veiculos turbo, swaps, preparados, esportivos, premium e projetos
              especiais. Aqui, cada anuncio e apresentado com mais cuidado, mais informacao e uma
              experiencia pensada para quem realmente entende ou deseja entrar no mundo da performance.
            </p>
          </article>
          <div className="trust-grid">
            {blocks.map((block) => {
              const Icon = block.icon;
              return (
                <article key={block.title} className="trust-item">
                  <Icon size={22} aria-hidden="true" />
                  <h3>{block.title}</h3>
                  <p>{block.text}</p>
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
