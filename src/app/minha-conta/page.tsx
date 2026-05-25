import Link from "next/link";
import { ArrowLeft, BadgeCheck, Database, KeyRound, Megaphone, ShieldCheck, UserRound } from "lucide-react";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { TopBannerAd } from "@/components/top-banner-ad";
import { WHATSAPP_ANNOUNCE_URL } from "@/lib/links";

export const revalidate = 3600;

const accountActions = [
  {
    icon: Megaphone,
    title: "Anunciar meu carro",
    text: "Envie dados, fotos e setup para entrar na curadoria TurboClass.",
    href: WHATSAPP_ANNOUNCE_URL,
  },
  {
    icon: Database,
    title: "Gerenciar estoque",
    text: "Cadastre carros, importe lotes e migre anuncios para o banco.",
    href: "/admin",
  },
  {
    icon: ShieldCheck,
    title: "Validar procedencia",
    text: "Organize laudo, revisoes e informacoes de preparacao antes de publicar.",
    href: WHATSAPP_ANNOUNCE_URL,
  },
];

export default function MinhaContaPage() {
  return (
    <>
      <main className="account-page">
        <section className="account-hero">
          <TopBannerAd />
          <SiteHeader />
          <div className="account-wrap">
            <Link href="/" className="back-link">
              <ArrowLeft size={17} aria-hidden="true" />
              Inicio
            </Link>
            <span className="hero-kicker">
              <UserRound size={18} aria-hidden="true" />
              Minha conta TurboClass
            </span>
            <h1>Garagem do anunciante</h1>
            <p>
              Area para gearheads anunciarem, acompanharem propostas e deixarem o carro pronto para
              uma vitrine que conversa com quem entende.
            </p>
          </div>
        </section>

        <section className="section account-section">
          <div className="account-login">
            <KeyRound size={26} aria-hidden="true" />
            <h2>Acesso operacional</h2>
            <p>
              O painel de estoque usa token de administrador. O fluxo comercial segue pelo
              WhatsApp para anuncios de clientes.
            </p>
            <Link href="/admin" className="primary-button">
              Abrir painel
              <BadgeCheck size={18} aria-hidden="true" />
            </Link>
          </div>

          <div className="account-actions">
            {accountActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  target={action.href.startsWith("http") ? "_blank" : undefined}
                  rel={action.href.startsWith("http") ? "noreferrer" : undefined}
                >
                  <Icon size={22} aria-hidden="true" />
                  <strong>{action.title}</strong>
                  <span>{action.text}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
