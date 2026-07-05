# Dr. Grace Estia — Site vitrine

Site vitrine d'une psychologue clinicienne : présentation, articles, galerie, presse et prise de rendez-vous.

---

## Pour commencer

### 1. Prérequis

- **Node.js** version 18 ou plus récente
- **pnpm** (gestionnaire de paquets) — installer avec `npm install -g pnpm`
- **Git** (pour cloner le projet)
- Un compte gratuit sur **[Neon](https://neon.tech)** (base de données PostgreSQL dans le cloud)

### 2. Installer le projet

```bash
# Cloner le dépôt (si ce n'est pas déjà fait)
git clone <url-du-depot>
cd Porte-folio

# Installer les dépendances
pnpm install
```

### 3. Configurer la base de données (Neon)

Le projet utilise **Neon** (PostgreSQL cloud) pour stocker les articles, la galerie, les rendez-vous, etc.

1. Crée un compte sur https://neon.tech (gratuit)
2. Crée un nouveau projet
3. Dans le tableau de bord, copie la **connection string** (commence par `postgresql://...`)
4. À la racine du projet, crée un fichier `.env.local` avec :

```env
DATABASE_URL=postgresql://ton-utilisateur:ton-mot-de-passe@ep-xxx.aws.neon.tech/nom-de-la-base?sslmode=require
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=ta-cle-secrete-ici
```

Génère une clé secrète pour `BETTER_AUTH_SECRET` avec :

```bash
openssl rand -hex 32
```

### 4. Créer les tables dans la base

```bash
pnpm exec drizzle-kit push
```

Cette commande lit le fichier `lib/db/schema.ts` et crée automatiquement toutes les tables dans Neon.

### 5. Lancer le serveur de développement

```bash
pnpm dev
```

Ouvre **http://localhost:3000** dans ton navigateur. La page se recharge automatique quand tu modifies un fichier.

---

## Structure du projet

```
Porte-folio/
├── app/                     # Pages et routes (Next.js App Router)
│   ├── (public)/            # Routes publiques du site
│   │   ├── page.tsx         # Page d'accueil
│   │   ├── a-propos/        # Page "À propos"
│   │   ├── articles/        # Liste des articles
│   │   ├── galerie/         # Galerie photos
│   │   ├── parcours/        # Parcours professionnel
│   │   └── presse/          # Mentions presse
│   ├── api/auth/            # API d'authentification
│   ├── globals.css          # Styles globaux (Tailwind + couleurs)
│   └── layout.tsx           # Layout racine (polices, métadonnées)
│
├── components/              # Composants React
│   ├── home/                # Sections de la page d'accueil
│   │   ├── hero.tsx         # Bannière principale
│   │   ├── focus-areas.tsx  # Domaines d'expertise
│   │   ├── intro-split.tsx  # Introduction/biographie
│   │   ├── latest-articles.tsx  # Derniers articles
│   │   └── cta.tsx          # Appel à l'action (prendre rendez-vous)
│   ├── ui/                  # Composants génériques (boutons, cartes…)
│   ├── site-header.tsx      # Barre de navigation
│   ├── site-footer.tsx      # Pied de page
│   ├── article-card.tsx     # Carte d'article
│   └── page-header.tsx      # Titre de page générique
│
├── lib/                     # Logique métier
│   ├── db/                  # Base de données
│   │   ├── schema.ts        # Définition des tables (articles, galerie…)
│   │   └── index.ts         # Connexion à la base
│   ├── queries.ts           # Fonctions pour lire les données
│   ├── site.ts              # Texte du site (nom, réseaux sociaux…)
│   ├── auth.ts              # Configuration de l'authentification
│   ├── auth-client.ts       # Client d'authentification (côté navigateur)
│   └── utils.ts             # Fonctions utilitaires (cn pour les classes CSS)
│
├── public/                  # Images et fichiers statiques
├── drizzle.config.ts        # Configuration de drizzle-kit (migrations)
├── next.config.mjs          # Configuration Next.js
├── package.json             # Dépendances et scripts
├── postcss.config.mjs       # Configuration PostCSS (Tailwind)
└── tsconfig.json            # Configuration TypeScript
```

---

## Architecture technique

### Framework

- **Next.js 16** avec le dossier `app/` (App Router)
- Les pages sont dans `app/(public)/` — chaque dossier correspond à une route
- Exemple : `app/(public)/a-propos/page.tsx` → http://localhost:3000/a-propos

### Styles

- **Tailwind CSS v4** — les classes utilitaires directement dans le JSX
- Les couleurs sont définies dans `app/globals.css` avec des variables CSS (oklch)
- Deux thèmes : clair (défaut) et sombre (`.dark`)

### Base de données

- **Neon** (PostgreSQL) avec **Drizzle ORM**
- Les tables sont définies dans `lib/db/schema.ts`
- Les requêtes sont dans `lib/queries.ts`
- Pour modifier la base : change `schema.ts`, puis exécute `pnpm exec drizzle-kit push`

### Authentification

- **Better Auth** — gère la connexion par email/mot de passe
- L'authentification n'est pas nécessaire pour voir le site (pages publiques)
- Utile si tu ajoutes un panneau d'administration plus tard

### Navigation

Les liens de navigation sont centralisés dans `lib/site.ts` :

```ts
export const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À propos" },
  { href: "/parcours", label: "Parcours" },
  { href: "/articles", label: "Articles" },
  { href: "/presse", label: "Presse" },
  { href: "/galerie", label: "Galerie" },
  { href: "/contact", label: "Rendez-vous" },
]
```

Ajoute ou retire des entrées pour modifier le menu.

---

## Commandes utiles

| Commande | Action |
|---|---|
| `pnpm dev` | Lance le serveur de développement (http://localhost:3000) |
| `pnpm build` | Compile le site pour la production |
| `pnpm start` | Lance le site en mode production |
| `pnpm lint` | Vérifie le code avec ESLint |
| `pnpm exec tsc --noEmit` | Vérifie les types TypeScript |
| `pnpm exec drizzle-kit push` | Synchronise les tables avec la base de données |

---

## Personnaliser le site

### Changer le texte

Modifie `lib/site.ts` pour changer :
- Le nom du cabinet et le rôle
- L'email, le téléphone, la localisation
- Les liens des réseaux sociaux
- Les entrées de navigation

### Changer les couleurs

Édite les variables CSS dans `app/globals.css` (section `:root` pour le thème clair, `.dark` pour le thème sombre).

### Ajouter une page

1. Crée un dossier dans `app/(public)/ma-page/`
2. Ajoute un fichier `page.tsx` à l'intérieur
3. Ajoute le lien dans `lib/site.ts` (tableau `navLinks`)

### Ajouter un article dans la base

Le site n'a pas encore d'interface d'administration. Pour ajouter des articles, il faut les insérer directement dans la base Neon (via le tableau de bord Neon, ou avec un script). Chaque article a besoin d'un `title`, d'un `slug` unique (ex: `mon-article`), d'un `content` (HTML), et de `published = true` pour être visible.

---

## Déploiement (Vercel)

Ce site est prêt à être déployé sur **Vercel** (plateforme recommandée pour Next.js).

1. Pousse le code sur GitHub
2. Connecte Vercel à ton dépôt
3. Ajoute les variables d'environnement dans le tableau de bord Vercel :
   - `DATABASE_URL` (ta connection string Neon)
   - `BETTER_AUTH_URL` (l'URL de ton site, ex: `https://tonsite.vercel.app`)
   - `BETTER_AUTH_SECRET`
4. Déploie !
