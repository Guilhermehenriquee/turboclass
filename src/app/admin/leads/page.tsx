import Link from "next/link";
import { ArrowLeft, UsersRound } from "lucide-react";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { TopBannerAd } from "@/components/top-banner-ad";
import { getLeads } from "@/lib/lead-store";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const leads = await getLeads();

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
              <UsersRound size={18} aria-hidden="true" />
              Leads
            </span>
            <h1>Interessados recebidos.</h1>
            <p>Contatos enviados pelos formularios de anuncio, financiamento, contato e interesse.</p>
          </div>
        </section>

        <section className="section admin-table-section">
          <div className="admin-table">
            <div className="admin-table-row heading">
              <span>Nome</span>
              <span>WhatsApp</span>
              <span>Origem</span>
              <span>Status</span>
            </div>
            {leads.length ? (
              leads.map((lead) => (
                <div key={lead.id} className="admin-table-row">
                  <span>{lead.name}</span>
                  <span>{lead.whatsapp}</span>
                  <span>{lead.kind}</span>
                  <span>{lead.status}</span>
                </div>
              ))
            ) : (
              <div className="admin-empty">Nenhum lead recebido ainda.</div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
