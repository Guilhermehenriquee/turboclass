import Link from "next/link";
import { ArrowLeft, AtSign, Mail, MessageCircle, Phone } from "lucide-react";
import { Footer } from "@/components/footer";
import { LeadForm } from "@/components/lead-form";
import { SiteHeader } from "@/components/site-header";
import { TopBannerAd } from "@/components/top-banner-ad";
import { INSTAGRAM_URL, WHATSAPP_SELL_URL } from "@/lib/links";

export const revalidate = 3600;

export default function ContatoPage() {
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
              <MessageCircle size={18} aria-hidden="true" />
              Contato
            </span>
            <h1>Fale com a TurboClass.</h1>
            <p>Atendimento nacional para comprar, vender, anunciar ou tirar duvidas sobre a plataforma.</p>
            <div className="hero-buttons">
              <a href={WHATSAPP_SELL_URL} className="primary-button" target="_blank" rel="noreferrer">
                Chamar no WhatsApp
                <Phone size={18} aria-hidden="true" />
              </a>
              <a href={INSTAGRAM_URL} className="light-button" target="_blank" rel="noreferrer">
                Seguir no Instagram
                <AtSign size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section className="section contact-section" id="atendimento">
          <div className="contact-card">
            <h2>Atendimento</h2>
            <a href={WHATSAPP_SELL_URL} target="_blank" rel="noreferrer">
              <Phone size={18} aria-hidden="true" />
              WhatsApp
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
              <AtSign size={18} aria-hidden="true" />
              Instagram
            </a>
            <a href="mailto:contato@turboclass.com.br">
              <Mail size={18} aria-hidden="true" />
              contato@turboclass.com.br
            </a>
            <p>Base de atendimento digital, com operacao nacional.</p>
          </div>
          <LeadForm kind="contato" title="Enviar mensagem" submitLabel="Enviar contato" fields="contact" />
        </section>
      </main>
      <Footer />
    </>
  );
}
