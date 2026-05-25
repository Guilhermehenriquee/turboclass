import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { TopBannerAd } from "@/components/top-banner-ad";

export const revalidate = 3600;

export default function TermsPage() {
  return (
    <>
      <main className="content-page">
        <section className="content-hero">
          <TopBannerAd />
          <SiteHeader />
          <div className="conversion-wrap">
            <span className="hero-kicker">Termos de uso</span>
            <h1>Uso responsavel da plataforma.</h1>
            <p>
              A TurboClass organiza anuncios e contatos entre compradores e vendedores. Toda
              negociacao deve ser conferida pelas partes antes de qualquer decisao.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
