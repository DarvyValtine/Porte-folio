"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const breadcrumbLabels: Record<string, string> = {
  "/admin": "Tableau de bord",
  "/admin/articles": "Articles",
  "/admin/articles/new": "Nouvel article",
  "/admin/galerie": "Galerie",
  "/admin/presse": "Presse",
  "/admin/rdv": "Mes rendez-vous",
};

export function AdminHeader() {
  const pathname = usePathname();

  const currentLabel = Object.entries(breadcrumbLabels).reduce(
    (best, [path, label]) =>
      pathname.startsWith(path) && path.length > best[0].length
        ? [path, label]
        : best,
    ["", ""],
  )[1];

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-background px-6">
      <div className="flex items-center gap-3">
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
