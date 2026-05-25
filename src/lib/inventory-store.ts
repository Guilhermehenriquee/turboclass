import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import type { Sql, TransactionSql } from "postgres";
import { inventory as seedInventory } from "@/data/inventory";
import { getSql, hasDatabaseUrl } from "@/lib/database";
import { filterVehicleList } from "@/lib/inventory-filter";
import type { InventoryFilters, Vehicle, VehicleTag } from "@/lib/inventory-types";

type RawRecord = Record<string, unknown>;
type SqlClient = Sql | TransactionSql;

type VehicleRow = {
  id: string;
  slug: string;
  name: string;
  make: string;
  model: string;
  condition: Vehicle["condition"];
  featured_offer: boolean;
  turbo_spec: string;
  has_modifications: boolean;
  year: number;
  price: number;
  monthly_payment: number;
  mileage: number;
  transmission: string;
  fuel: string;
  location: string;
  image: string;
  badge: string;
  turbo_badge: string | null;
  tags: unknown;
};

export class InventoryStoreError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
  ) {
    super(message);
  }
}

const LOCAL_INVENTORY_PATH = join(process.cwd(), "data", "inventory.local.json");
let schemaReady: Promise<void> | null = null;

function isRecord(value: unknown): value is RawRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeText(value: unknown, field: string, maxLength: number, required = true) {
  if (typeof value !== "string") {
    if (!required) {
      return "";
    }

    throw new InventoryStoreError(`Campo ${field} deve ser texto.`);
  }

  const sanitized = value.replace(/[\u0000-\u001f\u007f]/g, "").trim();

  if (required && !sanitized) {
    throw new InventoryStoreError(`Campo ${field} e obrigatorio.`);
  }

  return sanitized.slice(0, maxLength);
}

function sanitizeOptionalText(value: unknown, field: string, maxLength: number) {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  return sanitizeText(value, field, maxLength, false);
}

function toBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return ["1", "true", "on", "sim", "yes"].includes(value.trim().toLowerCase());
  }

  return false;
}

function toNumber(value: unknown, field: string, min: number, max: number) {
  const numberValue = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numberValue) || numberValue < min || numberValue > max) {
    throw new InventoryStoreError(`Campo ${field} deve ser um numero entre ${min} e ${max}.`);
  }

  return Math.round(numberValue);
}

function normalizeCondition(value: unknown): Vehicle["condition"] {
  const condition = sanitizeText(value, "condition", 24).toLowerCase();

  if (condition === "novo" || condition === "seminovo" || condition === "usado") {
    return condition;
  }

  throw new InventoryStoreError("Condicao deve ser novo, seminovo ou usado.");
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 96);
}

function normalizeImagePath(value: unknown) {
  const image = sanitizeText(value, "image", 220);

  if (image.startsWith("/") && !image.startsWith("//") && !image.includes("..")) {
    return image;
  }

  throw new InventoryStoreError("Imagem deve ser um caminho local em public, por exemplo /vehicle-hatch.png.");
}

function normalizeTagVariant(value: unknown, hasModifications: boolean): VehicleTag["variant"] {
  if (value === "modification" || value === "normal") {
    return value;
  }

  return hasModifications ? "modification" : "normal";
}

function normalizeTags(value: unknown, hasModifications: boolean): VehicleTag[] {
  const fallback: VehicleTag[] = [
    {
      label: hasModifications ? "Turbo preparado" : "Procedencia conferida",
      variant: hasModifications ? "modification" : "normal",
    },
  ];

  if (typeof value === "string") {
    const parsed = value
      .split(/[\n,]/g)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const [label, variant] = item.split(":").map((part) => part.trim());
        return {
          label: sanitizeText(label, "tag", 48),
          variant: normalizeTagVariant(variant, hasModifications),
        };
      });

    return parsed.length ? parsed.slice(0, 8) : fallback;
  }

  if (!Array.isArray(value)) {
    return fallback;
  }

  const tags = value
    .filter(isRecord)
    .map((tag) => ({
      label: sanitizeText(tag.label, "tag.label", 48),
      variant: normalizeTagVariant(tag.variant, hasModifications),
    }))
    .slice(0, 8);

  return tags.length ? tags : fallback;
}

function makeUniqueSlug(slug: string, existingSlugs: Set<string>) {
  let nextSlug = slug || `veiculo-${Date.now().toString(36)}`;
  let suffix = 2;

  while (existingSlugs.has(nextSlug)) {
    nextSlug = `${slug}-${suffix}`;
    suffix += 1;
  }

  existingSlugs.add(nextSlug);
  return nextSlug;
}

function generateVehicleId() {
  return `tc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function normalizeVehicleInput(value: unknown): Vehicle {
  if (!isRecord(value)) {
    throw new InventoryStoreError("Veiculo deve ser um objeto JSON.");
  }

  const hasModifications = toBoolean(value.hasModifications);
  const name = sanitizeText(value.name, "name", 96);
  const make = sanitizeText(value.make, "make", 64);
  const model = sanitizeText(value.model, "model", 72);
  const slugBase = sanitizeOptionalText(value.slug, "slug", 96) || `${make} ${model} ${name}`;

  return {
    id: sanitizeOptionalText(value.id, "id", 64) || generateVehicleId(),
    slug: slugify(slugBase),
    name,
    make,
    model,
    condition: normalizeCondition(value.condition),
    featuredOffer: toBoolean(value.featuredOffer),
    turboSpec: sanitizeText(value.turboSpec, "turboSpec", 180),
    hasModifications,
    year: toNumber(value.year, "year", 1950, 2100),
    price: toNumber(value.price, "price", 0, 100000000),
    monthlyPayment: toNumber(value.monthlyPayment, "monthlyPayment", 0, 10000000),
    mileage: toNumber(value.mileage, "mileage", 0, 5000000),
    transmission: sanitizeText(value.transmission, "transmission", 48),
    fuel: sanitizeText(value.fuel, "fuel", 48),
    location: sanitizeText(value.location, "location", 96),
    image: normalizeImagePath(value.image),
    badge: sanitizeText(value.badge, "badge", 48),
    turboBadge: sanitizeOptionalText(value.turboBadge, "turboBadge", 48) || undefined,
    tags: normalizeTags(value.tags, hasModifications),
  };
}

function rowToVehicle(row: VehicleRow): Vehicle {
  const tags = typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    make: row.make,
    model: row.model,
    condition: row.condition,
    featuredOffer: row.featured_offer,
    turboSpec: row.turbo_spec,
    hasModifications: row.has_modifications,
    year: row.year,
    price: row.price,
    monthlyPayment: row.monthly_payment,
    mileage: row.mileage,
    transmission: row.transmission,
    fuel: row.fuel,
    location: row.location,
    image: row.image,
    badge: row.badge,
    turboBadge: row.turbo_badge ?? undefined,
    tags: normalizeTags(tags, row.has_modifications),
  };
}

async function ensureInventorySchema() {
  if (!hasDatabaseUrl()) {
    return;
  }

  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getSql();

      await sql`
        create table if not exists vehicles (
          id text primary key,
          slug text unique not null,
          name text not null,
          make text not null,
          model text not null,
          condition text not null check (condition in ('novo', 'seminovo', 'usado')),
          featured_offer boolean not null default false,
          turbo_spec text not null,
          has_modifications boolean not null default false,
          year integer not null,
          price integer not null,
          monthly_payment integer not null default 0,
          mileage integer not null default 0,
          transmission text not null,
          fuel text not null,
          location text not null,
          image text not null,
          badge text not null,
          turbo_badge text,
          tags jsonb not null default '[]'::jsonb,
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now()
        )
      `;
      await sql`create index if not exists vehicles_condition_idx on vehicles (condition)`;
      await sql`create index if not exists vehicles_make_idx on vehicles (make)`;
      await sql`create index if not exists vehicles_featured_idx on vehicles (featured_offer)`;
    })();
  }

  await schemaReady;
}

async function insertVehicle(sql: SqlClient, vehicle: Vehicle, upsert: boolean) {
  const tags = JSON.stringify(vehicle.tags);

  if (upsert) {
    await sql`
      insert into vehicles (
        id, slug, name, make, model, condition, featured_offer, turbo_spec,
        has_modifications, year, price, monthly_payment, mileage, transmission,
        fuel, location, image, badge, turbo_badge, tags
      )
      values (
        ${vehicle.id}, ${vehicle.slug}, ${vehicle.name}, ${vehicle.make}, ${vehicle.model},
        ${vehicle.condition}, ${vehicle.featuredOffer}, ${vehicle.turboSpec}, ${vehicle.hasModifications},
        ${vehicle.year}, ${vehicle.price}, ${vehicle.monthlyPayment}, ${vehicle.mileage},
        ${vehicle.transmission}, ${vehicle.fuel}, ${vehicle.location}, ${vehicle.image},
        ${vehicle.badge}, ${vehicle.turboBadge ?? null}, ${tags}::jsonb
      )
      on conflict (id) do update set
        slug = excluded.slug,
        name = excluded.name,
        make = excluded.make,
        model = excluded.model,
        condition = excluded.condition,
        featured_offer = excluded.featured_offer,
        turbo_spec = excluded.turbo_spec,
        has_modifications = excluded.has_modifications,
        year = excluded.year,
        price = excluded.price,
        monthly_payment = excluded.monthly_payment,
        mileage = excluded.mileage,
        transmission = excluded.transmission,
        fuel = excluded.fuel,
        location = excluded.location,
        image = excluded.image,
        badge = excluded.badge,
        turbo_badge = excluded.turbo_badge,
        tags = excluded.tags,
        updated_at = now()
    `;
    return;
  }

  await sql`
    insert into vehicles (
      id, slug, name, make, model, condition, featured_offer, turbo_spec,
      has_modifications, year, price, monthly_payment, mileage, transmission,
      fuel, location, image, badge, turbo_badge, tags
    )
    values (
      ${vehicle.id}, ${vehicle.slug}, ${vehicle.name}, ${vehicle.make}, ${vehicle.model},
      ${vehicle.condition}, ${vehicle.featuredOffer}, ${vehicle.turboSpec}, ${vehicle.hasModifications},
      ${vehicle.year}, ${vehicle.price}, ${vehicle.monthlyPayment}, ${vehicle.mileage},
      ${vehicle.transmission}, ${vehicle.fuel}, ${vehicle.location}, ${vehicle.image},
      ${vehicle.badge}, ${vehicle.turboBadge ?? null}, ${tags}::jsonb
    )
  `;
}

async function readDatabaseInventory() {
  await ensureInventorySchema();

  const rows = await getSql()<VehicleRow[]>`
    select
      id, slug, name, make, model, condition, featured_offer, turbo_spec,
      has_modifications, year, price, monthly_payment, mileage, transmission,
      fuel, location, image, badge, turbo_badge, tags
    from vehicles
    order by featured_offer desc, created_at desc, name asc
  `;

  return rows.map(rowToVehicle);
}

async function readLocalInventory() {
  try {
    const raw = await readFile(LOCAL_INVENTORY_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return seedInventory;
    }

    return parsed.map(normalizeVehicleInput);
  } catch {
    return seedInventory;
  }
}

async function writeLocalInventory(vehicles: Vehicle[]) {
  if (process.env.NODE_ENV === "production") {
    throw new InventoryStoreError("Configure DATABASE_URL para cadastrar veiculos em producao.", 503);
  }

  await mkdir(dirname(LOCAL_INVENTORY_PATH), { recursive: true });
  await writeFile(LOCAL_INVENTORY_PATH, `${JSON.stringify(vehicles, null, 2)}\n`, "utf8");
}

async function getWritableInventory() {
  if (hasDatabaseUrl()) {
    return readDatabaseInventory();
  }

  return readLocalInventory();
}

export async function getInventory() {
  if (hasDatabaseUrl()) {
    try {
      const vehicles = await readDatabaseInventory();
      return vehicles.length ? vehicles : seedInventory;
    } catch (error) {
      console.error("Falha ao ler estoque do banco.", error);
      return seedInventory;
    }
  }

  return readLocalInventory();
}

export async function getFilteredInventory(filters: InventoryFilters) {
  return filterVehicleList(await getInventory(), filters);
}

export async function getVehicleBySlug(slug: string) {
  const vehicles = await getInventory();
  return vehicles.find((vehicle) => vehicle.slug === slug);
}

export async function createVehicle(input: unknown) {
  const existingVehicles = await getWritableInventory();
  const existingSlugs = new Set(existingVehicles.map((vehicle) => vehicle.slug));
  const vehicle = normalizeVehicleInput(input);
  vehicle.slug = makeUniqueSlug(vehicle.slug, existingSlugs);

  if (hasDatabaseUrl()) {
    await ensureInventorySchema();
    await insertVehicle(getSql(), vehicle, false);
    return vehicle;
  }

  await writeLocalInventory([vehicle, ...existingVehicles]);
  return vehicle;
}

export async function importVehicles(input: unknown) {
  const payload = isRecord(input) && Array.isArray(input.vehicles) ? input.vehicles : input;

  if (!Array.isArray(payload)) {
    throw new InventoryStoreError("Importacao deve receber um array ou { vehicles: [] }.");
  }

  if (payload.length > 250) {
    throw new InventoryStoreError("Importacao limitada a 250 veiculos por envio.", 413);
  }

  const existingVehicles = await getWritableInventory();
  const existingSlugs = new Set(existingVehicles.map((vehicle) => vehicle.slug));
  const vehicles = payload.map((item) => {
    const vehicle = normalizeVehicleInput(item);
    vehicle.slug = makeUniqueSlug(vehicle.slug, existingSlugs);
    return vehicle;
  });

  if (hasDatabaseUrl()) {
    await ensureInventorySchema();
    const sql = getSql();
    await sql.begin(async (transaction) => {
      for (const vehicle of vehicles) {
        await insertVehicle(transaction, vehicle, false);
      }
    });
    return vehicles;
  }

  await writeLocalInventory([...vehicles, ...existingVehicles]);
  return vehicles;
}

export async function seedInitialInventory() {
  const vehicles = seedInventory.map(normalizeVehicleInput);

  if (hasDatabaseUrl()) {
    await ensureInventorySchema();
    const sql = getSql();
    await sql.begin(async (transaction) => {
      for (const vehicle of vehicles) {
        await insertVehicle(transaction, vehicle, true);
      }
    });
    return vehicles;
  }

  await writeLocalInventory(vehicles);
  return vehicles;
}
