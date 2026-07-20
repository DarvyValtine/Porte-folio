"use client";

import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  ExternalLink,
  FileText,
  Images,
  LayoutDashboard,
  List,
  LogOut,
  Megaphone,
  Newspaper,
  PanelLeft,
  PanelLeftClose,
  Plus,
  X,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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
];

export function AdminSidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("admin-sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("admin-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch("/admin/rdv/api/count", { cache: "no-store" });
      const data = await res.json();
      setPendingCount(data.pending);
    } catch {}
  }, []);

  useEffect(() => {
    fetchCount();
    function handleFocus() { fetchCount(); }
    function handleVisibilityChange() { if (document.visibilityState === "visible") fetchCount(); }
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchCount]);

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center border-b border-border/60 px-3">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="mx-auto hidden sm:flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
          aria-label={collapsed ? "Développer" : "Réduire"}
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto flex sm:hidden size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {links.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          const Comp = link.external ? "a" : Link;
          const extraProps = link.external ? { target: "_blank", rel: "noreferrer" } : {};

          return (
            <Comp
              key={link.href}
              href={link.href}
              {...extraProps}
              onClick={onClose}
              className={cn(
                "flex items-center justify-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium transition-all",
                collapsed ? "mx-auto size-9" : "px-3",
                active
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )}
              title={collapsed ? link.label : undefined}
            >
              <link.icon className={cn("h-4.5 w-4.5 shrink-0", active && "text-primary")} />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{link.label}</span>
                  {link.badge && pendingCount !== null && pendingCount > 0 && (
                    <Badge variant={active ? "default" : "secondary"} className="h-5 min-w-5 px-1.5 text-[0.65rem]">
                      {pendingCount}
                    </Badge>
                  )}
                </>
              )}
            </Comp>
          );
        })}
      </nav>

      <div className="border-t border-border/60 p-2">
        <button
          onClick={handleSignOut}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-destructive",
            collapsed ? "justify-center size-9 mx-auto" : "px-3",
          )}
          title={collapsed ? "Déconnexion" : undefined}
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden sm:flex shrink-0 flex-col border-r border-border/60 bg-background transition-all duration-200",
          collapsed ? "w-14" : "w-56",
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex sm:hidden">
          <div className="w-64 border-r border-border/60 bg-background shadow-xl">{sidebarContent}</div>
          <div className="flex-1 bg-black/40" onClick={onClose} />
        </div>
      )}
    </>
  );
}
