import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { TopBannerAd } from "@/components/top-banner-ad";

export const revalidate = 3600;

export default function PrivacyPage() {
  return (
    <>
      <main className="content-page">
        <section className="content-hero">
          <TopBannerAd />
          <SiteHeader />
          <div className="conversion-wrap">
            <span className="hero-kicker">Politica de privacidade</span>
            <h1>Dados usados para atendimento e operacao.</h1>
            <p>
              Formularios e leads sao usados para contato comercial, simulacao, avaliacao de
              anuncios e melhoria da experiencia TurboClass.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
