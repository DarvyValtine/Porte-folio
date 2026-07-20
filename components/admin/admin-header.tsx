"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

const breadcrumbLabels: Record<string, string> = {
  "/admin": "Tableau de bord",
  "/admin/articles": "Articles",
  "/admin/articles/new": "Nouvel article",
  "/admin/galerie": "Galerie",
  "/admin/presse": "Presse",
  "/admin/rdv": "Mes rendez-vous",
};

export function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();

  const currentLabel = Object.entries(breadcrumbLabels).reduce(
    (best, [path, label]) =>
      pathname.startsWith(path) && path.length > best[0].length
        ? [path, label]
        : best,
    ["", ""],
  )[1];

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-background px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex sm:hidden size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
          aria-label="Menu"
        >
          <Menu className="h-4 w-4" />
        </button>
        <Link href="/admin">
          <span className="font-serif text-base font-semibold text-foreground">
            Grace Estia
          </span>
        </Link>
        {currentLabel && (
          <>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-sm text-muted-foreground">
              {currentLabel}
            </span>
          </>
        )}
      </div>
    </header>
  );
}
