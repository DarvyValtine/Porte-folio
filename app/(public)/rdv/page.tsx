import type { Metadata } from "next";
import { RdvPageClient } from "./rdv-page-client";
import { getAppointmentTypes } from "@/lib/actions/appointment-types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rendez-vous — Grâce Estia",
  description: "Prendre rendez-vous ou contacter Grâce Estia Otilibili.",
};

export default async function RdvPage() {
  const types = await getAppointmentTypes();
  return <RdvPageClient types={types} />;
}
