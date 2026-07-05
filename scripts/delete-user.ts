import "./dotenv"
import { pool } from "../lib/db"

const EMAIL = process.env.DELETE_EMAIL || "admin@example.com"

async function main() {
  const res = await pool.query(`SELECT id FROM "user" WHERE "email" = $1 LIMIT 1`, [EMAIL])
  if (res.rows.length === 0) {
    console.log("Aucun utilisateur trouvé avec cet email.")
    await pool.end()
    return
  }

  const userId = res.rows[0].id
  await pool.query(`DELETE FROM "account" WHERE "userId" = $1`, [userId])
  await pool.query(`DELETE FROM "user" WHERE "id" = $1`, [userId])
  console.log(`✅ Utilisateur ${EMAIL} supprimé.`)
  await pool.end()
}

main().catch((err) => {
  console.error("❌ Erreur :", err)
  process.exit(1)
})
