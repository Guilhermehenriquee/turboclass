import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import type { Sql, TransactionSql } from "postgres";
import { getSql, hasDatabaseUrl } from "@/lib/database";
import type { Lead, LeadKind, LeadStatus } from "@/lib/inventory-types";

type RawRecord = Record<string, unknown>;
type SqlClient = Sql | TransactionSql;

type LeadRow = {
  id: string;
  kind: LeadKind;
  name: string;
  whatsapp: string;
  email: string | null;
  vehicle_id: string | null;
  vehicle_name: string | null;
  city: string | null;
  state: string | null;
  message: string;
  source: string;
  status: LeadStatus;
  payload: unknown;
  created_at: string;
};

export class LeadStoreError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
  ) {
    super(message);
  }
}

const LOCAL_LEADS_PATH = join(process.cwd(), "data", "leads.local.json");
let leadSchemaReady: Promise<void> | null = null;

function isRecord(value: unknown): value is RawRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeText(value: unknown, field: string, maxLength: number, required = true) {
  if (typeof value !== "string") {
    if (!required) {
      return "";
    }

    throw new LeadStoreError(`Campo ${field} deve ser texto.`);
  }

  const sanitized = value.replace(/[\u0000-\u001f\u007f]/g, "").trim();

  if (required && !sanitized) {
    throw new LeadStoreError(`Campo ${field} e obrigatorio.`);
  }

  return sanitized.slice(0, maxLength);
}

function sanitizeOptionalText(value: unknown, field: string, maxLength: number) {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  return sanitizeText(value, field, maxLength, false);
}

function normalizeKind(value: unknown): LeadKind {
  const kind = sanitizeOptionalText(value, "kind", 32);

  if (kind === "financiamento" || kind === "contato" || kind === "interesse") {
    return kind;
  }

  return "anuncio";
}

function generateLeadId() {
  return `lead-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizePayload(value: unknown) {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entry]) => ["string", "number", "boolean"].includes(typeof entry) || entry === undefined)
      .slice(0, 80),
  ) as Lead["payload"];
}

export function normalizeLeadInput(value: unknown): Lead {
  if (!isRecord(value)) {
    throw new LeadStoreError("Lead deve ser um objeto JSON.");
  }

  const payload = normalizePayload(value.payload ?? value);

  return {
    id: sanitizeOptionalText(value.id, "id", 64) || generateLeadId(),
    kind: normalizeKind(value.kind),
    name: sanitizeText(value.name, "name", 96),
    whatsapp: sanitizeText(value.whatsapp, "whatsapp", 32),
    email: sanitizeOptionalText(value.email, "email", 120) || undefined,
    vehicleId: sanitizeOptionalText(value.vehicleId, "vehicleId", 64) || undefined,
    vehicleName: sanitizeOptionalText(value.vehicleName, "vehicleName", 120) || undefined,
    city: sanitizeOptionalText(value.city, "city", 64) || undefined,
    state: sanitizeOptionalText(value.state, "state", 2).toUpperCase() || undefined,
    message: sanitizeText(value.message, "message", 1600),
    source: sanitizeOptionalText(value.source, "source", 64) || "site",
    status: "novo",
    createdAt: new Date().toISOString(),
    payload,
  };
}

async function ensureLeadSchema() {
  if (!hasDatabaseUrl()) {
    return;
  }

  if (!leadSchemaReady) {
    leadSchemaReady = (async () => {
      const sql = getSql();

      await sql`
        create table if not exists leads (
          id text primary key,
          kind text not null,
          name text not null,
          whatsapp text not null,
          email text,
          vehicle_id text,
          vehicle_name text,
          city text,
          state text,
          message text not null,
          source text not null,
          status text not null default 'novo',
          payload jsonb not null default '{}'::jsonb,
          created_at timestamptz not null default now()
        )
      `;
      await sql`create index if not exists leads_status_idx on leads (status)`;
      await sql`create index if not exists leads_kind_idx on leads (kind)`;
      await sql`create index if not exists leads_created_at_idx on leads (created_at desc)`;
    })();
  }

  await leadSchemaReady;
}

function rowToLead(row: LeadRow): Lead {
  const payload = isRecord(row.payload) ? normalizePayload(row.payload) : {};

  return {
    id: row.id,
    kind: row.kind,
    name: row.name,
    whatsapp: row.whatsapp,
    email: row.email ?? undefined,
    vehicleId: row.vehicle_id ?? undefined,
    vehicleName: row.vehicle_name ?? undefined,
    city: row.city ?? undefined,
    state: row.state ?? undefined,
    message: row.message,
    source: row.source,
    status: row.status,
    createdAt: row.created_at,
    payload,
  };
}

async function insertLead(sql: SqlClient, lead: Lead) {
  await sql`
    insert into leads (
      id, kind, name, whatsapp, email, vehicle_id, vehicle_name, city, state, message, source, status, payload
    )
    values (
      ${lead.id}, ${lead.kind}, ${lead.name}, ${lead.whatsapp}, ${lead.email ?? null}, ${lead.vehicleId ?? null},
      ${lead.vehicleName ?? null}, ${lead.city ?? null}, ${lead.state ?? null}, ${lead.message},
      ${lead.source}, ${lead.status}, ${JSON.stringify(lead.payload)}::jsonb
    )
  `;
}

async function readLocalLeads() {
  try {
    const raw = await readFile(LOCAL_LEADS_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;

    return Array.isArray(parsed) ? parsed.map(normalizeLeadInput) : [];
  } catch {
    return [];
  }
}

async function writeLocalLeads(leads: Lead[]) {
  if (process.env.NODE_ENV === "production") {
    throw new LeadStoreError("Configure DATABASE_URL para salvar leads em producao.", 503);
  }

  await mkdir(dirname(LOCAL_LEADS_PATH), { recursive: true });
  await writeFile(LOCAL_LEADS_PATH, `${JSON.stringify(leads, null, 2)}\n`, "utf8");
}

export async function createLead(input: unknown) {
  const lead = normalizeLeadInput(input);

  if (hasDatabaseUrl()) {
    await ensureLeadSchema();
    await insertLead(getSql(), lead);
    return lead;
  }

  await writeLocalLeads([lead, ...(await readLocalLeads())]);
  return lead;
}

export async function getLeads() {
  if (hasDatabaseUrl()) {
    await ensureLeadSchema();
    const rows = await getSql()<LeadRow[]>`
      select
        id, kind, name, whatsapp, email, vehicle_id, vehicle_name, city, state,
        message, source, status, payload, created_at
      from leads
      order by created_at desc
      limit 200
    `;
    return rows.map(rowToLead);
  }

  return readLocalLeads();
}
