import type { Metadata } from "next";
import { RdvPageClient } from "./rdv-page-client";
import { getAppointmentTypes } from "@/lib/actions/appointment-types";

export const metadata: Metadata = {
  title: "Rendez-vous — Grace Estia Otilibili",
  description: "Prendre rendez-vous ou contacter Grace Estia Otilibili.",
};

export default async function RdvPage() {
  const types = await getAppointmentTypes();
  return <RdvPageClient types={types} />;
}
