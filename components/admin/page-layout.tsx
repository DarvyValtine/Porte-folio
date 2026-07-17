import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ReactNode } from "react"

export function AdminPageLayout({
  title,
  children,
  backHref,
  actions,
}: {
  title: string
  children: ReactNode
  backHref?: string
  actions?: ReactNode
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {backHref && (
            <Link
              href={backHref}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}
          <div>
            <h1 className="font-serif text-2xl font-semibold text-foreground">{title}</h1>
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  )
}
