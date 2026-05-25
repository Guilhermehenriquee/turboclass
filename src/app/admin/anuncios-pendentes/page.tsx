import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { TopBannerAd } from "@/components/top-banner-ad";

export const dynamic = "force-dynamic";

export default function PendingAdsPage() {
  return (
    <>
      <main className="admin-page">
        <section className="admin-hero">
          <TopBannerAd />
          <SiteHeader />
          <div className="admin-wrap">
            <Link href="/admin" className="back-link">
              <ArrowLeft size={17} aria-hidden="true" />
              Admin
            </Link>
            <span className="hero-kicker">
              <ClipboardList size={18} aria-hidden="true" />
              Pendentes
            </span>
            <h1>Aprovacao de anuncios enviados.</h1>
            <p>
              Area preparada para revisar anuncios recebidos pelo formulario antes de publicar no
              estoque principal.
            </p>
          </div>
        </section>

        <section className="section admin-empty-section">
          <div className="admin-empty">
            Os envios do formulario ja entram como leads. A proxima etapa e transformar lead aprovado
            em veiculo publicado.
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
