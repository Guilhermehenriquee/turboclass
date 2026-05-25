import type { InventoryFilters, Vehicle } from "@/lib/inventory-types";

function normalize(value: string | undefined) {
  return value?.trim().toLowerCase();
}

function asNumber(value: string | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
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
  const city = normalize(params.city);
  const state = normalize(params.state);
  const engineType = normalize(params.engineType);
  const preparation = normalize(params.preparation);
  const transmission = normalize(params.transmission);
  const fuel = normalize(params.fuel);
  const businessType = normalize(params.businessType);
  const status = normalize(params.status);
  const minPrice = asNumber(params.minPrice);
  const maxPrice = asNumber(params.maxPrice);
  const minYear = asNumber(params.minYear);
  const maxYear = asNumber(params.maxYear);

  const filtered = vehicles.filter((vehicle) => {
    const searchable =
      `${vehicle.name} ${vehicle.make} ${vehicle.model} ${vehicle.version} ${vehicle.location} ${vehicle.engineType} ${vehicle.preparation} ${vehicle.turboSpec} ${vehicle.tags
        .map((tag) => tag.label)
        .join(" ")}`.toLowerCase();
    const matchesQuery = query ? searchable.includes(query) : true;
    const matchesBody = body ? vehicle.model.toLowerCase().includes(body) : true;
    const matchesMake = make ? vehicle.make.toLowerCase() === make : true;
    const matchesCondition = condition ? vehicle.condition === condition : true;
    const matchesOffer = offer ? vehicle.featuredOffer : true;
    const matchesLocation = location ? vehicle.location.toLowerCase().includes(location) : true;
    const matchesCity = city ? vehicle.city.toLowerCase().includes(city) : true;
    const matchesState = state ? vehicle.state.toLowerCase() === state : true;
    const matchesEngine = engineType ? vehicle.engineType.toLowerCase() === engineType : true;
    const matchesPreparation = preparation ? vehicle.preparation.toLowerCase() === preparation : true;
    const matchesTransmission = transmission ? vehicle.transmission.toLowerCase() === transmission : true;
    const matchesFuel = fuel ? vehicle.fuel.toLowerCase() === fuel : true;
    const matchesBusiness = businessType ? vehicle.businessType === businessType : true;
    const matchesStatus = status ? vehicle.status === status : true;
    const matchesMinPrice = minPrice === undefined ? true : vehicle.price >= minPrice;
    const matchesMaxPrice = maxPrice === undefined ? true : vehicle.price <= maxPrice;
    const matchesMinYear = minYear === undefined ? true : vehicle.year >= minYear;
    const matchesMaxYear = maxYear === undefined ? true : vehicle.year <= maxYear;

    return (
      matchesQuery &&
      matchesBody &&
      matchesMake &&
      matchesCondition &&
      matchesOffer &&
      matchesLocation &&
      matchesCity &&
      matchesState &&
      matchesEngine &&
      matchesPreparation &&
      matchesTransmission &&
      matchesFuel &&
      matchesBusiness &&
      matchesStatus &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesMinYear &&
      matchesMaxYear &&
      matchesPriceRange(vehicle, params.price)
    );
  });

  switch (params.sort) {
    case "menor-preco":
      return filtered.sort((a, b) => a.price - b.price);
    case "maior-preco":
      return filtered.sort((a, b) => b.price - a.price);
    case "ano-mais-novo":
      return filtered.sort((a, b) => b.year - a.year);
    case "ano-mais-antigo":
      return filtered.sort((a, b) => a.year - b.year);
    case "mais-relevantes":
      return filtered.sort((a, b) => Number(b.featuredOffer) - Number(a.featuredOffer));
    case "mais-recentes":
    default:
      return filtered;
  }
}
