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

export const inventory: Vehicle[] = [
  {
    id: "tc-001",
    slug: "hatch-performance-stage-2",
    name: "Hatch Performance Stage 2",
    make: "Volkswagen",
    model: "Sportback",
    condition: "seminovo",
    featuredOffer: true,
    turboSpec: "Turbo upgraded, intake, downpipe e acerto dedicado",
    hasModifications: true,
    year: 2023,
    price: 184900,
    monthlyPayment: 3280,
    mileage: 18000,
    transmission: "Automatico",
    fuel: "Flex",
    location: "Sao Paulo, SP",
    image: "/vehicle-hatch.png",
    badge: "Mais buscado",
    turboBadge: "Turbo reluzente",
    tags: [
      { label: "Turbo preparado", variant: "modification" },
      { label: "Stage 2", variant: "modification" },
      { label: "Laudo aprovado", variant: "normal" },
    ],
  },
  {
    id: "tc-002",
    slug: "sedan-executivo-blindado",
    name: "Sedan Executivo Premium",
    make: "BMW",
    model: "Signature",
    condition: "usado",
    featuredOffer: false,
    turboSpec: "Twin-scroll turbo com manutencao preventiva em dia",
    hasModifications: false,
    year: 2022,
    price: 219900,
    monthlyPayment: 3910,
    mileage: 26000,
    transmission: "Automatico",
    fuel: "Gasolina",
    location: "Campinas, SP",
    image: "/vehicle-sedan.png",
    badge: "Oferta especial",
    turboBadge: "Turbo reluzente",
    tags: [
      { label: "Turbo original", variant: "normal" },
      { label: "IPVA pago", variant: "normal" },
      { label: "Unico dono", variant: "normal" },
    ],
  },
  {
    id: "tc-003",
    slug: "suv-performance-family",
    name: "SUV Performance Family",
    make: "Porsche",
    model: "Touring",
    condition: "novo",
    featuredOffer: true,
    turboSpec: "Turbo de fabrica, torque alto e pacote sport",
    hasModifications: false,
    year: 2024,
    price: 289900,
    monthlyPayment: 5160,
    mileage: 9000,
    transmission: "Automatico",
    fuel: "Hibrido",
    location: "Rio de Janeiro, RJ",
    image: "/vehicle-suv.png",
    badge: "Pronta entrega",
    turboBadge: "Turbo reluzente",
    tags: [
      { label: "Turbo de fabrica", variant: "normal" },
      { label: "Garantia", variant: "normal" },
      { label: "Financia", variant: "normal" },
    ],
  },
];

export const carMakes = [
  "Acura",
  "Agrale",
  "Alfa Romeo",
  "AM General",
  "Asia Motors",
  "Aston Martin",
  "Audi",
  "Baby",
  "BMW",
  "BRM",
  "Bugre",
  "BYD",
  "CAB Motors",
  "Cadillac",
  "Caoa Changan",
  "Caoa Chery",
  "CBT Jipe",
  "Chana",
  "Changan",
  "Chery",
  "Chevrolet",
  "Chrysler",
  "Citroen",
  "Cross Lander",
  "D2D",
  "Daewoo",
  "Daihatsu",
  "Denza",
  "DFSK",
  "Dodge",
  "Effa",
  "Engesa",
  "Envemo",
  "Ferrari",
  "Fever",
  "Fiat",
  "Fibravan",
  "Ford",
  "Foton",
  "Fyber",
  "GAC",
  "Geely",
  "Great Wall",
  "Gurgel",
  "GWM",
  "Hafei",
  "Hitech Electric",
  "Honda",
  "Hyundai",
  "Isuzu",
  "Iveco",
  "Jac",
  "Jaecoo",
  "Jaguar",
  "Jeep",
  "Jetour",
  "Jinbei",
  "JPX",
  "Kia Motors",
  "Lada",
  "Lamborghini",
  "Land Rover",
  "Leapmotor",
  "Lexus",
  "Lifan",
  "Lobini",
  "Lotus",
  "Mahindra",
  "Maserati",
  "Matra",
  "Mazda",
  "Mclaren",
  "Mercedes-Benz",
  "Mercury",
  "MG",
  "MINI",
  "Mitsubishi",
  "Miura",
  "Neta",
  "Nissan",
  "Omoda",
  "Peugeot",
  "Plymouth",
  "Pontiac",
  "Porsche",
  "RAM",
  "Rely",
  "Renault",
  "Rolls-Royce",
  "Rover",
  "Saab",
  "Saturn",
  "Seat",
  "Seres",
  "Shineray",
  "smart",
  "Ssangyong",
  "Subaru",
  "Suzuki",
  "TAC",
  "Toyota",
  "Troller",
  "Volkswagen",
  "Volvo",
  "Wake",
  "Walk",
  "ZEEKR",
];

export const searchOptions = {
  makes: ["Todas as marcas", ...carMakes],
  models: ["Todos os modelos", "Hatch", "Sedan", "SUV", "Coupe", "Picape"],
  prices: ["Ate R$ 100 mil", "R$ 100 mil a R$ 200 mil", "R$ 200 mil a R$ 350 mil", "Acima de R$ 350 mil"],
  locations: ["Todo o Brasil", "Sao Paulo", "Rio de Janeiro", "Minas Gerais", "Parana"],
};

export function filterInventory(params: Record<string, string | undefined>) {
  const query = params.q?.trim().toLowerCase();
  const body = params.body?.trim().toLowerCase();
  const make = params.make?.trim().toLowerCase();
  const condition = params.condition?.trim().toLowerCase();
  const offer = params.offer?.trim().toLowerCase();

  return inventory.filter((vehicle) => {
    const searchable =
      `${vehicle.name} ${vehicle.make} ${vehicle.model} ${vehicle.location} ${vehicle.turboSpec} ${vehicle.tags.map((tag) => tag.label).join(" ")}`.toLowerCase();
    const matchesQuery = query ? searchable.includes(query) : true;
    const matchesBody = body ? vehicle.model.toLowerCase().includes(body) : true;
    const matchesMake = make ? vehicle.make.toLowerCase() === make : true;
    const matchesCondition = condition ? vehicle.condition === condition : true;
    const matchesOffer = offer ? vehicle.featuredOffer : true;

    return matchesQuery && matchesBody && matchesMake && matchesCondition && matchesOffer;
  });
}
