import Link from "next/link";
import { ArrowLeft, Banknote, MessageCircle } from "lucide-react";
import { Footer } from "@/components/footer";
import { LeadForm } from "@/components/lead-form";
import { SiteHeader } from "@/components/site-header";
import { TopBannerAd } from "@/components/top-banner-ad";
import { WHATSAPP_FINANCE_URL } from "@/lib/links";

export const revalidate = 3600;

type FinancingPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function FinancingPage({ searchParams }: FinancingPageProps) {
  const params = (await searchParams) ?? {};
  const vehicleName = getSingleParam(params.veiculo);

  return (
    <>
      <main className="conversion-page">
        <section className="conversion-hero">
          <TopBannerAd />
          <SiteHeader />
          <div className="conversion-wrap">
            <Link href="/" className="back-link">
              <ArrowLeft size={17} aria-hidden="true" />
              Inicio
            </Link>
            <span className="hero-kicker">
              <Banknote size={18} aria-hidden="true" />
              Financiamento
            </span>
            <h1>Simule seu financiamento com atendimento personalizado.</h1>
            <p>
              Informe o veiculo de interesse, entrada e prazo desejado para receber uma pre-analise
              com orientacao da equipe TurboClass.
            </p>
            <a href={WHATSAPP_FINANCE_URL} className="primary-button hero-inline-button" target="_blank" rel="noreferrer">
              Chamar no WhatsApp
              <MessageCircle size={18} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="section form-section">
          <div>
            <span className="eyebrow">Pre-analise</span>
            <h2>Converse com orientacao antes de decidir</h2>
            <p>
              A simulacao nao garante aprovacao. As condicoes dependem da analise das instituicoes
              financeiras parceiras e do perfil do comprador.
            </p>
          </div>
          <LeadForm
            kind="financiamento"
            title="Solicitar simulacao"
            submitLabel="Solicitar simulacao"
            fields="finance"
            vehicleName={vehicleName}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
