export type VehicleTag = {
  label: string;
  variant: "modification" | "normal";
};

export type Vehicle = {
  id: string;
  slug: string;
  name: string;
  make: string;
  model: string;
  condition: "novo" | "seminovo" | "usado";
  featuredOffer: boolean;
  turboSpec: string;
  hasModifications: boolean;
  year: number;
  price: number;
  monthlyPayment: number;
  mileage: number;
  transmission: string;
  fuel: string;
  location: string;
  image: string;
  badge: string;
  turboBadge?: string;
  tags: VehicleTag[];
};

export type InventoryFilters = {
  q?: string;
  body?: string;
  make?: string;
  condition?: string;
  offer?: string;
  price?: string;
  location?: string;
};
