import "./dotenv"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { hashPassword } from "@better-auth/utils/password"
import { user, account } from "../lib/db/schema"
import { eq } from "drizzle-orm"

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const db = drizzle(pool, { schema: { user, account } })

const EMAIL = process.env.ADMIN_EMAIL || "admin@example.com"
const PASSWORD = process.env.ADMIN_PASSWORD || "admin123"
const NAME = process.env.ADMIN_NAME || "Admin"

async function main() {
  console.log(`📧 Email  : ${EMAIL}`)
  console.log(`🔑 Mot de passe : ${PASSWORD}`)
  console.log()

  // Check if user already exists
  const existing = await db.select().from(user).where(eq(user.email, EMAIL)).limit(1)

  if (existing.length > 0) {
    console.log("✅ Un admin avec cet email existe déjà.")
    await pool.end()
    return
  }

  // Create user
  const userId = crypto.randomUUID()
  const hashedPassword = await hashPassword(PASSWORD)
  const now = new Date()

  await db.insert(user).values({
    id: userId,
    name: NAME,
    email: EMAIL,
    emailVerified: true,
    createdAt: now,
    updatedAt: now,
  })

  await db.insert(account).values({
    id: crypto.randomUUID(),
    accountId: EMAIL,
    providerId: "credential",
    userId,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  })

  console.log("✅ Compte admin créé avec succès !")
  console.log()
  console.log("   Connecte-toi sur http://localhost:3000/sign-in")
  console.log(`   Email : ${EMAIL}`)
  console.log(`   Mot de passe : ${PASSWORD}`)
  console.log()
  console.log("💡 Tu peux personnaliser ces infos :")
  console.log("   ADMIN_EMAIL=autre@email.com ADMIN_PASSWORD=monmotdepasse pnpm seed")

  await pool.end()
}

main().catch((err) => {
  console.error("❌ Erreur :", err)
  process.exit(1)
})
