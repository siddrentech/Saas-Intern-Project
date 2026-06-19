import "dotenv/config"

async function main() {
  try {
    // Dynamic import to avoid module resolution issues
    const { db } = await import("../db")
    const { notes } = await import("../db/schema")
    
    console.log("DB imported:", typeof db)
    console.log("Notes imported:", typeof notes)
    
    if (db && notes) {
      const inserted = await db
        .insert(notes)
        .values({ message: "Hello from Drizzle and Neon!" })
        .returning()

      console.log("Inserted row:", inserted)

      const allNotes = await db.select().from(notes)

      console.log("All notes:", allNotes)
    } else {
      console.error("Failed to import db or notes")
      process.exit(1)
    }
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
}

main()
