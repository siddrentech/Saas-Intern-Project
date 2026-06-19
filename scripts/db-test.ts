import "dotenv/config"
import { db } from "../db"
import { notes } from "../db/schema"

async function main() {
  const inserted = await db
    .insert(notes)
    .values({ message: "Hello from Drizzle and Neon!" })
    .returning()

  console.log("Inserted row:", inserted)

  const allNotes = await db.select().from(notes)

  console.log("All notes:", allNotes)
}

main()
