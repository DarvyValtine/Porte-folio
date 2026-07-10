import type { Metadata } from "next";
import { RdvPageClient } from "./rdv-page-client";

export const metadata: Metadata = {
  title: "Rendez-vous — Grace Estia Otilibili",
  description: "Prendre rendez-vous ou contacter Grace Estia Otilibili.",
};

export default function RdvPage() {
  return <RdvPageClient />;
}
