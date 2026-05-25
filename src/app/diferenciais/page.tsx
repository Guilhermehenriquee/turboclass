import Link from "next/link";
import { ArrowLeft, BadgeCheck, CarFront, MessageCircle, Search, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { TopBannerAd } from "@/components/top-banner-ad";

export const revalidate = 3600;

const differentials = [
  ["Nicho especializado", "Foco em carros turbo, preparados, swaps, esportivos e premium.", Wrench],
  ["Anuncios mais completos", "Campos para preparacao, potencia, upgrades, motorizacao e tipo de projeto.", BadgeCheck],
  ["Publico qualificado", "Quem acessa a TurboClass ja esta procurando carros diferenciados.", Search],
  ["Visual premium", "Apresentacao profissional para valorizar foto, setup e historia do veiculo.", Sparkles],
  ["Contato rapido", "WhatsApp direto em todos os pontos importantes de conversao.", MessageCircle],
  ["Atendimento nacional", "Vitrine para anuncios e compradores de varias regioes do Brasil.", CarFront],
] as const;

export default function DiferenciaisPage() {
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
            <span className="hero-kicker">
              <ShieldCheck size={18} aria-hidden="true" />
              Diferenciais
            </span>
            <h1>Mais nichada que um classificado comum. Mais direta para gearheads.</h1>
            <p>
              A TurboClass foi pensada para dar contexto aos projetos e reduzir a friccao entre
              comprador, vendedor e atendimento.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="trust-grid differentials-grid">
            {differentials.map(([title, text, Icon]) => (
              <article key={title} className="trust-item">
                <Icon size={22} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
