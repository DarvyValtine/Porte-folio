import "server-only"
import { db } from "@/lib/db"
import { siteContent } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

const defaults: Record<string, unknown> = {
  home_hero: {
    badge: "Psychologue · Militante",
    title: "Protéger les droits, restaurer l'espoir.",
    subtitle: "Psychologue clinicienne et militante pour les droits humains, engagée dans la protection de l'enfance et l'accompagnement des communautés au Congo.",
    ctaPrimary: "Prendre rendez-vous",
    ctaPrimaryLink: "/rdv",
    ctaSecondary: "Découvrir mon parcours",
    ctaSecondaryLink: "/a-propos",
    image: "/images/portrait-hero.jpeg",
  },
  home_intro: {
    eyebrow: "Mon approche",
    title: "Un engagement de terrain au service des enfants",
    body: "Je conjugue la rigueur de la psychologie clinique avec un engagement militant de longue date. Mon travail consiste à protéger les enfants vulnérables, à restaurer leur dignité, et à porter leur voix auprès des institutions et de la société.",
    stats: [
      { value: "6+", label: "années de terrain au Congo" },
      { value: "4+", label: "projets de protection de l'enfance" },
      { value: "3", label: "publications & articles de presse" },
    ],
    ctaLabel: "Voir le parcours complet",
    ctaLink: "/parcours",
    image: "/images/engagement.jpg",
  },
  home_focus_areas: {
    eyebrow: "Domaines d'intervention",
    title: "Une pratique au croisement du soin et de l'engagement",
    items: [
      { icon: "HeartHandshake", title: "Protection de l'enfance", description: "Accompagnement et prise en charge des enfants en situation de rue, mineurs incarcérés et enfants vulnérables." },
      { icon: "Scale", title: "Droits humains & plaidoyer", description: "Engagement auprès d'ONG et d'institutions pour la défense des droits des enfants et des femmes." },
      { icon: "Users", title: "Santé sexuelle & reproductive", description: "Sensibilisation, animation de groupes de parole et plaidoyer pour l'accès à des soins respectueux." },
      { icon: "PhoneCall", title: "Écoute sociale & urgence", description: "Gestion de lignes d'appel d'urgence et dispositifs d'aide psychosociale pour les personnes en détresse." },
    ],
  },
  home_cta: {
    title: "Vous souhaitez prendre rendez-vous ou échanger ?",
    body: "Que ce soit pour une consultation, une intervention ou une collaboration, n'hésitez pas à me contacter. Je vous répondrai dans les meilleurs délais.",
    buttonText: "Demander un rendez-vous",
    buttonLink: "/rdv",
  },
  a_propos: {
    headerEyebrow: "À propos",
    headerTitle: "Au service des droits de l'enfant et de la justice sociale",
    headerDescription: "Psychologue clinicienne de formation, j'ai consacré ma carrière à la protection des enfants vulnérables et à la défense de leurs droits, sur le terrain au Congo et au-delà.",
    paragraph1: "Mon engagement est né d'une conviction simple : chaque enfant, chaque femme, chaque personne vulnérable a droit à la protection, à la dignité et à une chance de se reconstruire. Depuis 2019, je travaille sur le terrain au Congo auprès d'enfants en situation de rue, de mineurs incarcérés et de communautés marginalisées.",
    paragraph2: "Au sein du REIPER puis de l'ACBEF, j'ai coordonné des projets, animé des lignes d'écoute d'urgence, formé des acteurs sociaux et porté des actions de plaidoyer pour les droits des enfants et la santé sexuelle et reproductive. Mon approche conjugue la rigueur de la psychologie clinique avec un engagement militant de longue date.",
    quote: "« Prendre soin de l'autre, c'est aussi lutter pour un monde où sa dignité ne sera plus jamais négociable. »",
    valuesTitle: "Mes engagements",
    values: [
      { title: "Dignité", text: "Chaque personne mérite d'être accueillie avec respect, sans jugement ni condition." },
      { title: "Justice", text: "Le soin psychologique ne peut être séparé du combat pour l'égalité et les droits." },
      { title: "Écoute", text: "Comprendre avant d'agir : une présence attentive est le point de départ de toute reconstruction." },
    ],
    ctaText: "Pour découvrir mon parcours académique, mes engagements et mes distinctions, consultez la page dédiée.",
    ctaLabel: "Voir mon parcours",
    ctaLink: "/parcours",
    image: "/images/about-portrait.jpeg",
  },
  parcours: {
    header: {
      eyebrow: "Parcours & réalisations",
      title: "Un parcours dédié à la protection de l'enfance",
      description: "Formation universitaire, expériences de terrain, engagements associatifs et publications.",
    },
    reiper: {
      heading: "Réseau des Intervenants sur le Phénomène des Enfants en Rupture — REIPER",
      items: [
        { period: "Mars — Mai 2026", title: "Cheffe de projet", org: "REIPER — Projet « ARCADE phase 2 »", text: "Accompagnement et Renforcement des Capacités et Actions Dédiées aux Enfants en Situation de rue. Lieu d'affectation : Brazzaville." },
        { period: "Mars 2024 — Mars 2026", title: "Assistante du chef de projet puis Cheffe de projet (mars 2025)", org: "REIPER — Projet « ARCADE »", text: "Accompagnement et Renforcement des Capacités et Actions Dédiées aux Enfants en Situation de rue. Lieu d'affectation : Brazzaville. Missions ponctuelles : Pointe-Noire, Gamboma (Plateaux), Kingoué (Bouenza), Dakar (Sénégal)." },
        { period: "Oct. 2022 — Mars 2024", title: "Chargée de la ligne d'appel d'urgence", org: "REIPER — Projet « Tobatela bana »", text: "Promotion des droits et protection des enfants vulnérables en République du Congo. Lieu d'affectation : Brazzaville. Missions ponctuelles : Dolisie, Pointe-Noire." },
        { period: "Oct. 2021 — Oct. 2022", title: "Travailleuse sociale et responsable du dispositif Mineurs Incarcérés", org: "REIPER — Projet « Tobatela bana »", text: "Promotion des droits et protection des enfants vulnérables en République du Congo. Lieu d'affectation : Brazzaville." },
        { period: "Sept. 2020 — Août 2021", title: "Coordonnatrice locale de projet", org: "REIPER", text: "Promotion et mise en œuvre des droits des enfants en conflit avec la loi au Congo. Lieu d'affectation : Dolisie (Niari). Missions ponctuelles : Brazzaville." },
        { period: "Mai — Oct. 2019", title: "Animatrice chargée de la sensibilisation et de la réinsertion", org: "REIPER", text: "Amélioration de la prise en charge sociale et éducative des mineurs incarcérés au sein de la maison d'arrêt de Pointe-Noire. Lieu d'affectation : Pointe-Noire." },
      ],
    },
    acbef: {
      heading: "Association Congolaise pour le Bien Etre Familial — ACBEF",
      subheading: "Engagements bénévoles",
      items: [
        { period: "2025", title: "Secrétaire du Comité National de Reforme Neutre", org: "ACBEF" },
        { period: "2019 — 2021", title: "Présidente du Bureau National du Mouvement d'Action des Jeunes & Membre du Comité Exécutif National", org: "ACBEF" },
        { period: "2016 — 2020", title: "Animatrice du site forum www.tictacados.com", org: "ACBEF" },
        { period: "2016 — 2019", title: "Conseillère au bureau national du Mouvement d'Action des Jeunes", org: "ACBEF" },
      ],
    },
    education: {
      heading: "Formation",
      items: [
        { period: "2018", title: "Master en Psychologie Pathologique et Clinique", org: "Université Marien Ngouabi" },
        { period: "2016", title: "Licence en Psychologie", org: "Université Marien Ngouabi" },
        { period: "2016", title: "Licence en Gestion", org: "ESGAE — École Supérieure de Gestion et d'Administration des Entreprises" },
      ],
    },
    certifications: {
      heading: "Certifications",
      items: [
        "Prise en charge spécifique des jeunes filles",
        "Écoute sociale",
        "Éducation à la vie affective et sexuelle",
        "Éducation sexuelle complète",
        "Lutte contre les violences basées sur le genre",
        "Dépression",
        "Relation mère-bébé",
        "Éducation inclusive",
        "Advocacy To Action",
      ],
    },
    engagements: {
      heading: "Engagements & activités militantes",
      items: [
        "Participation à des campagnes pour les droits des femmes et des enfants",
        "Actions de sensibilisation en santé sexuelle et reproductive",
        "Interventions dans des conférences, ateliers et groupes de parole",
      ],
    },
    publications: {
      heading: "Publications & visibilité",
      items: [
        { title: "Congo/Société : Le divorce des parents, l'une des principales causes conduisant les enfants en situation de rue", source: "Agence Congolaise pour l'Information — DB News", url: "https://dbnews.com" },
        { title: "Portrait : Grace Estia Otilibili redonne de l'espoir aux enfants incarcérés", source: "Adiac Congo", url: "https://adiac-congo.com" },
        { title: "Girls Talk 242 — Témoignage et partage d'expérience", source: "Girls Talk 242", url: "https://www.facebook.com/share/v/19Ad4cAGQm/" },
      ],
    },
    expertise: {
      heading: "Domaines d'expertise",
      items: [
        "Protection de l'enfance",
        "Droits des enfants en conflit avec la loi",
        "Santé sexuelle & reproductive",
        "Violences basées sur le genre",
        "Accompagnement psychosocial",
        "Écoute & aide d'urgence",
        "Plaidoyer & droits humains",
        "Formation & sensibilisation",
      ],
    },
  },
}

export async function getSiteContent<T = Record<string, unknown>>(key: string): Promise<T> {
  const rows = await db
    .select()
    .from(siteContent)
    .where(eq(siteContent.key, key))
    .limit(1)

  if (rows.length > 0) {
    return rows[0].value as T
  }

  return (defaults[key] ?? {}) as T
}
