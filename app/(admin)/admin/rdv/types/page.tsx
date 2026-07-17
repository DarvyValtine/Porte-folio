import { getAppointmentTypes } from "@/lib/actions/appointment-types"
import { AdminPageLayout } from "@/components/admin/page-layout"
import { TypesManager } from "./types-manager"

export default async function RdvTypesPage() {
  const types = await getAppointmentTypes()
  return (
    <AdminPageLayout title="Types de rendez-vous" backHref="/admin/rdv">
      <TypesManager types={types} />
    </AdminPageLayout>
  )
}
