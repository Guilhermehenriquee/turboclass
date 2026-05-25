import Link from "next/link";
import { ArrowRight, BadgeCheck, CarFront, ClipboardList, ShieldCheck, UsersRound } from "lucide-react";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { TopBannerAd } from "@/components/top-banner-ad";
import { getInventory } from "@/lib/inventory-store";
import { getLeads } from "@/lib/lead-store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [vehicles, leads] = await Promise.all([getInventory(), getLeads()]);
  const stats = [
    { label: "Total de anuncios", value: vehicles.length, icon: CarFront },
    { label: "Disponiveis", value: vehicles.filter((vehicle) => vehicle.status === "disponivel").length, icon: BadgeCheck },
    { label: "Vendidos", value: vehicles.filter((vehicle) => vehicle.status === "vendido").length, icon: ShieldCheck },
    { label: "Leads recebidos", value: leads.length, icon: UsersRound },
  ];

  return (
    <>
      <main className="admin-page">
        <section className="admin-hero">
          <TopBannerAd />
          <SiteHeader />
          <div className="admin-wrap">
            <span className="hero-kicker">
              <ClipboardList size={18} aria-hidden="true" />
              Admin TurboClass
            </span>
            <h1>Central operacional do marketplace.</h1>
            <p>Visao geral de anuncios, leads e proximos passos para operar a plataforma.</p>
          </div>
        </section>

        <section className="section admin-dashboard">
          <div className="admin-metric-grid">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <article key={stat.label} className="admin-metric">
                  <Icon size={22} aria-hidden="true" />
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </article>
              );
            })}
          </div>

          <div className="admin-shortcuts">
            <Link href="/admin/veiculos">
              Gerenciar veiculos
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link href="/admin/leads">
              Gerenciar leads
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link href="/admin/anuncios-pendentes">
              Anuncios pendentes
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
