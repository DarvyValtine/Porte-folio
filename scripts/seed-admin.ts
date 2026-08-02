import { auth } from "../lib/auth"

const email = process.env.SEED_ADMIN_EMAIL
const password = process.env.SEED_ADMIN_PASSWORD
const name = process.env.SEED_ADMIN_NAME || "Administrateur"

async function main() {
  if (!email || !password) {
    console.error(
      "Variables requises : SEED_ADMIN_EMAIL et SEED_ADMIN_PASSWORD"
    )
    process.exit(1)
  }

  try {
    await auth.api.signUpEmail({
      headers: new Headers(),
      body: { email, name, password },
    })
    console.log("Admin créé avec succès :", email)
  } catch (err) {
    console.error("Erreur lors de la création de l'admin :", err)
    process.exit(1)
  }
}

main()