import type { InventoryFilters, Vehicle } from "@/lib/inventory-types";

function normalize(value: string | undefined) {
  return value?.trim().toLowerCase();
}

function matchesPriceRange(vehicle: Vehicle, priceRange: string | undefined) {
  const range = normalize(priceRange);

  if (!range) {
    return true;
  }

  if (range.includes("100 mil") && range.includes("ate")) {
    return vehicle.price <= 100000;
  }

  if (range.includes("100 mil") && range.includes("200 mil")) {
    return vehicle.price >= 100000 && vehicle.price <= 200000;
  }

  if (range.includes("200 mil") && range.includes("350 mil")) {
    return vehicle.price >= 200000 && vehicle.price <= 350000;
  }

  if (range.includes("350 mil")) {
    return vehicle.price >= 350000;
  }

  return true;
}

export function filterVehicleList(vehicles: Vehicle[], params: InventoryFilters) {
  const query = normalize(params.q);
  const body = normalize(params.body);
  const make = normalize(params.make);
  const condition = normalize(params.condition);
  const offer = normalize(params.offer);
  const location = normalize(params.location);

  return vehicles.filter((vehicle) => {
    const searchable =
      `${vehicle.name} ${vehicle.make} ${vehicle.model} ${vehicle.location} ${vehicle.turboSpec} ${vehicle.tags
        .map((tag) => tag.label)
        .join(" ")}`.toLowerCase();
    const matchesQuery = query ? searchable.includes(query) : true;
    const matchesBody = body ? vehicle.model.toLowerCase().includes(body) : true;
    const matchesMake = make ? vehicle.make.toLowerCase() === make : true;
    const matchesCondition = condition ? vehicle.condition === condition : true;
    const matchesOffer = offer ? vehicle.featuredOffer : true;
    const matchesLocation = location ? vehicle.location.toLowerCase().includes(location) : true;

    return (
      matchesQuery &&
      matchesBody &&
      matchesMake &&
      matchesCondition &&
      matchesOffer &&
      matchesLocation &&
      matchesPriceRange(vehicle, params.price)
    );
  });
}
