import "dotenv/config"

console.log("DATABASE_URL:", process.env.DATABASE_URL)

try {
  console.log("About to import db...")
  const dbModule = require("../../db")
  console.log("DB module:", dbModule)
  console.log("DB object:", dbModule.db)
} catch (error) {
  console.error("Error:", error)
}
