"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Camera,
  ChevronRight,
  CreditCard,
  Bell,
  Shield,
  Globe,
  HelpCircle,
  Info,
  LogOut,
  Star,
  Edit2,
  Check,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { signOut } from "@/lib/actions/auth"

const menuItems = [
  {
    icon: CreditCard,
    label: "Moyens de paiement",
    description: "Mobile Money, cartes, crypto",
    href: "/dashboard/profile/payment-methods",
  },
  {
    icon: Shield,
    label: "Sécurité",
    description: "Mot de passe, biométrie, 2FA",
    href: "/dashboard/profile/security",
  },
  {
    icon: Bell,
    label: "Notifications",
    description: "Push, SMS, email",
    href: "/dashboard/profile/notifications",
  },
  {
    icon: Globe,
    label: "Langue et région",
    description: "Français, Cameroun",
    href: "/dashboard/profile/language",
  },
  {
    icon: HelpCircle,
    label: "Aide et support",
    description: "FAQ, contacter le support",
    href: "/dashboard/profile/help",
  },
  {
    icon: Info,
    label: "À propos de Nkap",
    description: "Version, conditions, confidentialité",
    href: "/dashboard/profile/about",
  },
]

interface ProfileClientProps {
  user: {
    id: string
    email: string
    name: string
    phone: string
    avatarUrl: string
    country: string
    reputationScore: number
  }
  stats: {
    tontineCount: number
    monthsActive: number
    reputation: number
  }
}

export function ProfileClient({ user, stats }: ProfileClientProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  const handleLogout = async () => {
    await signOut()
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2D6A4F]/10 to-white pb-24">
      {/* Header */}
      <div className="bg-[#2D6A4F] text-white pt-12 pb-20 px-6 rounded-b-[32px]">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold font-sans">Mon Profil</h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <Check className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-6 -mt-16">
        <Card className="rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-20 h-20 border-4 border-white shadow-md">
                <AvatarImage src={user.avatarUrl || "/placeholder.svg"} />
                <AvatarFallback className="bg-[#F4A261] text-white text-2xl font-semibold">{initials}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-[#2D6A4F] text-white p-2 rounded-full shadow-md">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 font-sans">{user.name}</h2>
              {user.phone && <p className="text-gray-500 text-sm">{user.phone}</p>}
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#2D6A4F]">{stats.tontineCount}</p>
              <p className="text-xs text-gray-500">Tontines</p>
            </div>
            <div className="text-center border-x">
              <p className="text-2xl font-bold text-[#2D6A4F]">{stats.monthsActive}</p>
              <p className="text-xs text-gray-500">Mois actif</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-5 h-5 fill-[#E9C46A] text-[#E9C46A]" />
                <span className="text-2xl font-bold text-[#2D6A4F]">{stats.reputation.toFixed(1)}</span>
              </div>
              <p className="text-xs text-gray-500">Réputation</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {stats.reputation >= 4.5 && (
              <Badge className="bg-[#E9C46A]/20 text-[#B8860B] rounded-full px-3 py-1">Membre Fidèle</Badge>
            )}
            {stats.tontineCount >= 1 && (
              <Badge className="bg-[#2D6A4F]/10 text-[#2D6A4F] rounded-full px-3 py-1">Contributeur Actif</Badge>
            )}
            {stats.monthsActive >= 6 && (
              <Badge className="bg-[#F4A261]/20 text-[#D2691E] rounded-full px-3 py-1">Vétéran</Badge>
            )}
          </div>
        </Card>
      </div>

      {/* Menu Items */}
      <div className="px-6 mt-6 space-y-3">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#2D6A4F]/10 flex items-center justify-center">
                <item.icon className="w-6 h-6 text-[#2D6A4F]" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Card>
          </Link>
        ))}

        {/* Logout Button */}
        <form action={handleLogout}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full mt-6 rounded-2xl p-4 flex items-center gap-4 text-red-500 hover:bg-red-50 justify-start h-auto"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
              <LogOut className="w-6 h-6 text-red-500" />
            </div>
            <span className="font-medium">Se déconnecter</span>
          </Button>
        </form>
      </div>

      {/* Version Info */}
      <p className="text-center text-gray-400 text-sm mt-8">Nkap v1.0.0</p>
    </div>
  )
}
