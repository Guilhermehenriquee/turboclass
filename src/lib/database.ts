import postgres from "postgres";

let sqlClient: ReturnType<typeof postgres> | null = null;

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getSql() {
  const connectionString = process.env.DATABASE_URL?.trim();

  if (!connectionString) {
    throw new Error("DATABASE_URL nao configurado.");
  }

  if (!sqlClient) {
    sqlClient = postgres(connectionString, {
      connect_timeout: 10,
      idle_timeout: 20,
      max: 3,
      prepare: false,
    });
  }

  return sqlClient;
}
