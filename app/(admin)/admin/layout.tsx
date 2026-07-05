import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/sign-in?redirect=/admin")
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar userName={session.user.name} userEmail={session.user.email} />
      <main className="flex-1 bg-secondary/20 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  )
}
