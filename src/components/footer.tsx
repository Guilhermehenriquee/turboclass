import Link from "next/link";
import { AtSign, Mail, MapPin, Phone } from "lucide-react";
import { INSTAGRAM_URL, WHATSAPP_ANNOUNCE_URL } from "@/lib/links";

export function Footer() {
  return (
    <footer className="site-footer" id="contato">
      <div className="footer-grid">
        <div>
          <Link href="/" className="brand footer-brand" aria-label="TurboClass inicio">
            <span className="brand-icon-shell">
              <img src="/logo/turboclass.png" alt="" className="brand-logo" />
            </span>
            <span>TurboClass</span>
          </Link>
          <p>
            Curadoria automotiva, compra segura e experiencia premium para gearheads que buscam
            performance, procedencia e atendimento direto.
          </p>
        </div>

        <div>
          <h2>Atendimento</h2>
          <a href={WHATSAPP_ANNOUNCE_URL} target="_blank" rel="noreferrer">
            <Phone size={16} aria-hidden="true" />
            WhatsApp comercial
          </a>
          <a href="mailto:contato@turboclass.com.br">
            <Mail size={16} aria-hidden="true" />
            contato@turboclass.com.br
          </a>
        </div>

        <div id="unidades">
          <h2>Unidade</h2>
          <a href="https://maps.google.com" target="_blank" rel="noreferrer">
            <MapPin size={16} aria-hidden="true" />
            Sao Paulo, SP
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
            <AtSign size={16} aria-hidden="true" />
            Instagram
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>2026 TurboClass. Todos os direitos reservados.</span>
        <span>
          Desenvolvido por <strong>Avalace</strong>
        </span>
      </div>
    </footer>
  );
}
