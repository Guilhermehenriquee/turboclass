import Link from "next/link";
import { ArrowLeft, BadgeCheck, Camera, MessageCircle, Sparkles, Wrench } from "lucide-react";
import { Footer } from "@/components/footer";
import { LeadForm } from "@/components/lead-form";
import { SiteHeader } from "@/components/site-header";
import { TopBannerAd } from "@/components/top-banner-ad";
import { WHATSAPP_SELL_URL } from "@/lib/links";

export const revalidate = 3600;

const benefits = [
  {
    icon: Sparkles,
    title: "Publico de nicho",
    text: "Quem acessa a TurboClass ja procura carro diferenciado, turbo, swap, esportivo ou premium.",
  },
  {
    icon: Camera,
    title: "Vitrine profissional",
    text: "O anuncio valoriza foto, setup, preparacao, cidade, status e informacoes que comprador gearhead quer ver.",
  },
  {
    icon: Wrench,
    title: "Campos de preparacao",
    text: "Espaco para potencia, upgrades, oficina, cambio, combustivel, documentacao e observacoes importantes.",
  },
];

export default function VenderPage() {
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
              <BadgeCheck size={18} aria-hidden="true" />
              Anuncie na TurboClass
            </span>
            <h1>Venda seu carro preparado para o publico certo.</h1>
            <p>
              Coloque seu turbo, swap, projeto especial ou veiculo premium na frente de compradores
              realmente interessados.
            </p>
            <div className="hero-buttons">
              <a href={WHATSAPP_SELL_URL} className="primary-button" target="_blank" rel="noreferrer">
                Falar pelo WhatsApp
                <MessageCircle size={18} aria-hidden="true" />
              </a>
              <Link href="#formulario" className="light-button">
                Enviar para avaliacao
              </Link>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="trust-grid">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article key={benefit.title} className="trust-item">
                  <Icon size={22} aria-hidden="true" />
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section form-section" id="formulario">
          <div>
            <span className="eyebrow">Cadastro de anuncio</span>
            <h2>Envie os dados principais do veiculo</h2>
            <p>
              Depois do envio, a equipe TurboClass pode revisar informacoes, orientar fotos e
              preparar o anuncio para publicacao.
            </p>
          </div>
          <LeadForm kind="anuncio" title="Dados do anuncio" submitLabel="Enviar para avaliacao" fields="sell" />
        </section>
      </main>
      <Footer />
    </>
  );
}
