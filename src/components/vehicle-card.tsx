import Image from "next/image";
import Link from "next/link";
import { Gauge, MapPin, ShieldCheck } from "lucide-react";
import type { Vehicle } from "@/data/inventory";
import { formatBRL, formatMileage } from "@/lib/format";

type VehicleCardProps = {
  vehicle: Vehicle;
  priority?: boolean;
};

export function VehicleCard({ vehicle, priority = false }: VehicleCardProps) {
  return (
    <article className="vehicle-card">
      <Link href={`/estoque/${vehicle.slug}`} className="vehicle-media" aria-label={`Ver ${vehicle.name}`}>
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
          priority={priority}
        />
        {vehicle.turboBadge ? <span className="vehicle-badge">{vehicle.turboBadge}</span> : null}
      </Link>

      <div className="vehicle-body">
        <div className="vehicle-title-row">
          <div>
            <p className="vehicle-year">{vehicle.year}</p>
            <h3>{vehicle.name}</h3>
          </div>
          <strong>{formatBRL(vehicle.price)}</strong>
        </div>

        <p className={vehicle.hasModifications ? "vehicle-turbo is-modified" : "vehicle-turbo"}>
          {vehicle.turboSpec}
        </p>

        <div className="vehicle-meta" aria-label="Resumo do veiculo">
          <span>
            <Gauge size={16} aria-hidden="true" />
            {formatMileage(vehicle.mileage)} km
          </span>
          <span>{vehicle.transmission}</span>
          <span>{vehicle.fuel}</span>
        </div>

        <div className="vehicle-location">
          <MapPin size={16} aria-hidden="true" />
          <span>{vehicle.location}</span>
        </div>

        <div className="vehicle-tags">
          {vehicle.tags.map((tag) => (
            <span key={tag.label} data-variant={tag.variant}>
              <ShieldCheck size={14} aria-hidden="true" />
              {tag.label}
            </span>
          ))}
        </div>

        <div className="vehicle-actions">
          <Link href={`/estoque/${vehicle.slug}`} className="secondary-button">
            Ver detalhes
          </Link>
          <Link href="#financiamento" className="text-button">
            A partir de {formatBRL(vehicle.monthlyPayment)}/mes
          </Link>
        </div>
      </div>
    </article>
  );
}
