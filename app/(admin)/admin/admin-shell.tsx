"use client"

import { useState, useCallback, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { authClient } from "@/lib/auth-client"
import {
  Menu, X, LogOut, LayoutDashboard, FileText, Newspaper, Images,
  Megaphone, CalendarDays, List, Plus, ExternalLink,
} from "lucide-react"

const links = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/contenu", label: "Contenu du site", icon: FileText },
  { href: "/admin/articles", label: "Articles", icon: Newspaper },
  { href: "/admin/galerie", label: "Galerie", icon: Images },
  { href: "/admin/presse", label: "Presse", icon: Megaphone },
  { href: "/admin/rdv", label: "Mes rendez-vous", icon: CalendarDays, badge: true },
  { href: "/admin/rdv/types", label: "Types de RDV", icon: List },
  { href: "/admin/articles/new", label: "Nouvel article", icon: Plus },
  { href: "/", label: "Voir le site", icon: ExternalLink, external: true },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [pendingCount, setPendingCount] = useState<number | null>(null)

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch("/admin/rdv/api/count", { cache: "no-store" })
      const data = await res.json()
      setPendingCount(data.pending)
    } catch {}
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    fetchCount()
    function handleFocus() { fetchCount() }
    function handleVisibilityChange() { if (document.visibilityState === "visible") fetchCount() }
    window.addEventListener("focus", handleFocus)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [fetchCount])

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/sign-in")
    router.refresh()
  }

  function isActive(link: typeof links[0]) {
    return link.exact ? pathname === link.href : pathname.startsWith(link.href)
  }

  function NavLink({ link, onClick }: { link: typeof links[0]; onClick?: () => void }) {
    const active = isActive(link)
    const Comp = link.external ? "a" : Link
    const extraProps = link.external ? { target: "_blank", rel: "noreferrer" } : {}
    const Icon = link.icon
    return (
      <Comp
        href={link.href}
        {...extraProps}
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
          active ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
        )}
      >
        <Icon className={cn("h-4.5 w-4.5 shrink-0", active && "text-primary")} />
        <span className="flex-1 truncate">{link.label}</span>
        {link.badge && pendingCount !== null && pendingCount > 0 && (
          <Badge variant={active ? "default" : "secondary"} className="h-5 min-w-5 px-1.5 text-[0.65rem]">{pendingCount}</Badge>
        )}
      </Comp>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border/60 bg-background lg:flex">
        <div className="flex h-14 shrink-0 items-center border-b border-border/60 px-4">
          <Link href="/admin">
            <span className="font-serif text-base font-semibold text-foreground">Grace Estia</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {links.map((link) => <NavLink key={link.href} link={link} />)}
        </nav>
        <div className="border-t border-border/60 p-2">
          <button onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-destructive"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header with hamburger */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-background px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex lg:hidden size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <Link href="/admin">
              <span className="font-serif text-base font-semibold text-foreground">Grace Estia</span>
            </Link>
          </div>
        </header>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="border-b border-border/60 bg-background lg:hidden">
            <nav className="flex flex-col px-3 py-2">
              {links.map((link) => <NavLink key={link.href} link={link} />)}
              <button onClick={handleSignOut}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-destructive"
              >
                <LogOut className="h-4.5 w-4.5 shrink-0" />
                <span>Déconnexion</span>
              </button>
            </nav>
          </div>
        )}

        <main className="flex-1 overflow-y-auto bg-secondary/20 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
