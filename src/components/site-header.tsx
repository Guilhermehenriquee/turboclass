import Link from "next/link";
import { MapPin, Menu, Phone, Search, UserRound } from "lucide-react";
import { WHATSAPP_SELL_URL } from "@/lib/links";

const navigation = [
  { href: "/comprar", label: "Comprar" },
  { href: "/vender", label: "Vender" },
  { href: "/financiamento", label: "Financiamento" },
  { href: "/diferenciais", label: "Diferenciais" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function SiteHeader() {
  return (
    <header className="site-header" aria-label="Navegacao principal">
      <Link href="/" className="brand" aria-label="TurboClass inicio">
        <span className="brand-icon-shell">
          <img src="/logo/turboclass.png" alt="" className="brand-logo" />
        </span>
        <span>TurboClass</span>
      </Link>

      <nav className="desktop-nav" aria-label="Menu principal">
        {navigation.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <Link href="/contato#atendimento" className="ghost-action">
          <MapPin size={17} aria-hidden="true" />
          <span>Atendimento</span>
        </Link>
        <Link href="/comprar" className="icon-action" aria-label="Buscar veiculos">
          <Search size={18} aria-hidden="true" />
        </Link>
        <Link href="/minha-conta" className="ghost-action compact">
          <UserRound size={17} aria-hidden="true" />
          <span>Minha conta</span>
        </Link>
        <Link href={WHATSAPP_SELL_URL} className="contact-action" target="_blank" rel="noreferrer">
          <Phone size={17} aria-hidden="true" />
          <span>Anunciar meu carro</span>
        </Link>
        <details className="mobile-nav">
          <summary aria-label="Abrir menu">
            <Menu size={21} aria-hidden="true" />
          </summary>
          <div>
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
