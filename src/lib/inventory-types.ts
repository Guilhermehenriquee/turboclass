export type VehicleTag = {
  label: string;
  variant: "modification" | "normal";
};

export type VehicleStatus = "disponivel" | "reservado" | "vendido";

export type VehicleBusinessType = "aceita-troca" | "somente-venda" | "financia" | "consignado";

export type VehicleUpgrade = {
  label: string;
  value: string;
};

export type VehicleSeller = {
  name?: string;
  whatsapp?: string;
  email?: string;
  city?: string;
  state?: string;
};

export type Vehicle = {
  id: string;
  slug: string;
  name: string;
  make: string;
  model: string;
  version: string;
  condition: "novo" | "seminovo" | "usado";
  featuredOffer: boolean;
  turboSpec: string;
  hasModifications: boolean;
  year: number;
  yearModel: number;
  price: number;
  monthlyPayment: number;
  mileage: number;
  transmission: string;
  fuel: string;
  location: string;
  city: string;
  state: string;
  image: string;
  gallery: string[];
  badge: string;
  turboBadge?: string;
  engineType: string;
  preparation: string;
  power: string;
  color: string;
  plateFinal: string;
  documentation: string;
  businessType: VehicleBusinessType;
  status: VehicleStatus;
  description: string;
  upgrades: VehicleUpgrade[];
  seller?: VehicleSeller;
  views?: number;
  tags: VehicleTag[];
};

export type InventoryFilters = {
  q?: string;
  body?: string;
  make?: string;
  condition?: string;
  offer?: string;
  price?: string;
  minPrice?: string;
  maxPrice?: string;
  minYear?: string;
  maxYear?: string;
  location?: string;
  city?: string;
  state?: string;
  engineType?: string;
  preparation?: string;
  transmission?: string;
  fuel?: string;
  businessType?: string;
  status?: string;
  sort?: string;
};

export type LeadStatus = "novo" | "em-atendimento" | "interessado" | "sem-resposta" | "fechado" | "perdido";

export type LeadKind = "anuncio" | "financiamento" | "contato" | "interesse";

export type Lead = {
  id: string;
  kind: LeadKind;
  name: string;
  whatsapp: string;
  email?: string;
  vehicleId?: string;
  vehicleName?: string;
  city?: string;
  state?: string;
  message: string;
  source: string;
  status: LeadStatus;
  createdAt: string;
  payload: Record<string, string | boolean | number | undefined>;
};
