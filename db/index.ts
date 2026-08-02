import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

const databaseUrl = new URL(process.env.DATABASE_URL)

// pg-connection-string currently treats "require" as "verify-full" and warns
// that this compatibility behavior will change in its next major version.
if (databaseUrl.searchParams.get("sslmode") === "require") {
  databaseUrl.searchParams.set("sslmode", "verify-full")
}

const pool = new Pool({
  connectionString: databaseUrl.toString(),
})

export const db = drizzle(pool, { schema })
