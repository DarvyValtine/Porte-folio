import { resolve, dirname } from "path"
import { fileURLToPath } from "url"
import { config } from "dotenv"
import { existsSync } from "fs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const localPath = resolve(__dirname, "..", ".env.local")
config({ path: existsSync(localPath) ? localPath : resolve(__dirname, "..", ".env") })
