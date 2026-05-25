import Link from "next/link";
import { AtSign, Mail, MessageCircle, Phone } from "lucide-react";
import { INSTAGRAM_URL, WHATSAPP_SELL_URL } from "@/lib/links";

const navigation = [
  { href: "/comprar", label: "Comprar" },
  { href: "/vender", label: "Vender" },
  { href: "/financiamento", label: "Financiamento" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

const categories = ["Carros turbo", "Carros preparados", "Swaps", "Esportivos", "Premium", "Projetos especiais"];

export function Footer() {
  return (
    <footer className="site-footer" id="contato">
      <div className="footer-grid extended-footer">
        <div>
          <Link href="/" className="brand footer-brand" aria-label="TurboClass inicio">
            <span className="brand-icon-shell">
              <img src="/logo/turboclass.png" alt="" className="brand-logo" />
            </span>
            <span>TurboClass</span>
          </Link>
          <p>
            Marketplace especializado em carros turbo, preparados, swaps, esportivos e veiculos
            diferenciados para o publico gearhead.
          </p>
        </div>

        <div>
          <h2>Navegacao</h2>
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <div>
          <h2>Categorias</h2>
          {categories.map((category) => (
            <Link key={category} href={`/comprar?q=${encodeURIComponent(category)}`}>
              {category}
            </Link>
          ))}
        </div>

        <div id="atendimento">
          <h2>Atendimento</h2>
          <a href={WHATSAPP_SELL_URL} target="_blank" rel="noreferrer">
            <Phone size={16} aria-hidden="true" />
            WhatsApp
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
            <AtSign size={16} aria-hidden="true" />
            Instagram
          </a>
          <a href="mailto:contato@turboclass.com.br">
            <Mail size={16} aria-hidden="true" />
            contato@turboclass.com.br
          </a>
          <Link href="/contato">
            <MessageCircle size={16} aria-hidden="true" />
            Atendimento nacional
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>TurboClass - Todos os direitos reservados.</span>
        <span>
          <Link href="/termos">Termos de uso</Link> | <Link href="/privacidade">Politica de privacidade</Link>
        </span>
        <span>
          Desenvolvido por <strong>Avalace</strong>
        </span>
      </div>
    </footer>
  );
}
