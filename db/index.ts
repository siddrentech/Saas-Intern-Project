import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

function getPoolConfig() {
  const connectionString = process.env.DATABASE_URL

  // Next.js imports route modules while collecting build metadata. Defer the
  // missing-variable failure until a route actually accesses PostgreSQL.
  if (!connectionString) {
    return undefined
  }

  const databaseUrl = new URL(connectionString)

  // pg-connection-string currently treats "require" as "verify-full" and
  // warns that this compatibility behavior will change in its next major.
  if (databaseUrl.searchParams.get("sslmode") === "require") {
    databaseUrl.searchParams.set("sslmode", "verify-full")
  }

  return { connectionString: databaseUrl.toString() }
}

const pool = new Pool(getPoolConfig())

export const db = drizzle(pool, { schema })
