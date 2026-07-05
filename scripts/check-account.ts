import "./dotenv"
import { pool } from "../lib/db"

async function main() {
  const res = await pool.query(`
    SELECT u.email, u."emailVerified", a."providerId", a."password", a."accountId"
    FROM "user" u
    LEFT JOIN "account" a ON a."userId" = u.id
    WHERE u.email = 'admin@example.com'
  `)
  if (res.rows.length === 0) {
    console.log("Aucun compte trouvé")
  } else {
    console.log(JSON.stringify(res.rows, null, 2))
    console.log()
    console.log("Password hash:", res.rows[0].password?.substring(0, 40) + "...")
    console.log("Password length:", res.rows[0].password?.length)
  }
  await pool.end()
}

main().catch(console.error)
