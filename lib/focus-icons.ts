import type { LucideIcon } from "lucide-react"
import {
  HeartHandshake,
  Scale,
  Users,
  PhoneCall,
  Brain,
  Megaphone,
  Heart,
  ClipboardList,
  Sparkles,
  Shield,
  BookOpen,
  GraduationCap,
  MessageCircle,
  Activity,
  HandHeart,
  Leaf,
  Building2,
  Accessibility,
  UsersRound,
  HeartPulse,
} from "lucide-react"

export const FOCUS_ICONS: Record<string, LucideIcon> = {
  HeartHandshake,
  Scale,
  Users,
  PhoneCall,
  Brain,
  Megaphone,
  Heart,
  ClipboardList,
  Sparkles,
  Shield,
  BookOpen,
  GraduationCap,
  MessageCircle,
  Activity,
  HandHeart,
  Leaf,
  Building2,
  Accessibility,
  UsersRound,
  HeartPulse,
}

export const FOCUS_ICON_NAMES = Object.keys(FOCUS_ICONS)

function normalizeIconName(name: string) {
  return name.toLowerCase().replace(/[-_.\s]/g, "")
}

export function getFocusIcon(name: string): LucideIcon {
  if (!name) return HeartHandshake

  const exact = FOCUS_ICONS[name]
  if (exact) return exact

  const normalized = normalizeIconName(name)
  for (const [key, icon] of Object.entries(FOCUS_ICONS)) {
    if (normalizeIconName(key) === normalized) return icon
  }

  return HeartHandshake
}
