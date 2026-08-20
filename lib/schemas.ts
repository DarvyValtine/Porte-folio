import { z } from "zod"

export const appointmentSchema = z.object({
  name: z.string().min(2, "Nom requis (min. 2 caractères)"),
  email: z.email("Adresse email invalide"),
  phone: z.string().optional(),
  preferredDate: z.string().optional(),
  typeId: z.coerce.number().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message requis (min. 10 caractères)"),
})