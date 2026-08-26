import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { navLinks, site } from "@/lib/site";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer
      className="border-t border-border/60 bg-secondary/40"
      aria-label="Pied de page du site"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <p className="font-serif text-xl font-semibold text-foreground">
            {site.name}
          </p>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            {site.tagline}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Navigation
          </p>
          <ul className="grid grid-cols-2 gap-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-foreground/80 transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Contact
          </p>
          <ul className="space-y-2 text-sm text-foreground/80">
            {/* <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <a href={`mailto:${site.email}`} className="hover:text-primary">
                {site.email}
              </a>
            </li> */}
            {/* <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <a href={`tel:${site.phone}`} className="hover:text-primary">
                {site.phone}
              </a>
            </li> */}
            {/*<li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{site.location}</span>
            </li>*/}
            <li className="flex items-center gap-2">
              <LinkedinIcon className="h-4 w-4 text-primary" />
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {site.name}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
