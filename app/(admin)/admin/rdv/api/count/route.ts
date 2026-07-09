import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { appointments } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ pending: 0 });
  }

  const [{ pending }] = await db
    .select({ pending: sql<number>`count(*)` })
    .from(appointments)
    .where(eq(appointments.status, "pending"));

  return Response.json({ pending: Number(pending) });
}
