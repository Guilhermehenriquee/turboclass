import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { AdminVehicleManager } from "@/components/admin-vehicle-manager";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { TopBannerAd } from "@/components/top-banner-ad";
import { getInventory } from "@/lib/inventory-store";

export const dynamic = "force-dynamic";

export default async function AdminVehiclesPage() {
  const vehicles = await getInventory();

  return (
    <>
      <main className="admin-page">
        <section className="admin-hero">
          <TopBannerAd />
          <SiteHeader />
          <div className="admin-wrap">
            <Link href="/minha-conta" className="back-link">
              <ArrowLeft size={17} aria-hidden="true" />
              Minha conta
            </Link>
            <span className="hero-kicker">
              <ShieldCheck size={18} aria-hidden="true" />
              Painel protegido
            </span>
            <h1>Gestao de estoque</h1>
            <p>
              Cadastre carros, importe lotes e migre o estoque inicial para o banco quando o
              DATABASE_URL estiver configurado.
            </p>
          </div>
        </section>

        <AdminVehicleManager initialTotal={vehicles.length} />
      </main>

      <Footer />
    </>
  );
}
