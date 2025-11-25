"use client"

import { useState } from "react"
import { ArrowLeft, Bell, MessageSquare, CreditCard, Users, Calendar, Info } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

const notificationCategories = [
  {
    id: "contributions",
    icon: CreditCard,
    title: "Contributions",
    description: "Rappels de paiement et confirmations",
    push: true,
    sms: true,
    email: false,
  },
  {
    id: "tontine",
    icon: Users,
    title: "Activité tontine",
    description: "Nouveaux membres, votes, tirages",
    push: true,
    sms: false,
    email: true,
  },
  {
    id: "messages",
    icon: MessageSquare,
    title: "Messages",
    description: "Chat de groupe et messages directs",
    push: true,
    sms: false,
    email: false,
  },
  {
    id: "calendar",
    icon: Calendar,
    title: "Calendrier",
    description: "Sessions à venir et échéances",
    push: true,
    sms: true,
    email: true,
  },
  {
    id: "system",
    icon: Info,
    title: "Système",
    description: "Mises à jour et annonces Nkap",
    push: true,
    sms: false,
    email: true,
  },
]

export default function NotificationsSettingsPage() {
  const [categories, setCategories] = useState(notificationCategories)
  const [masterPush, setMasterPush] = useState(true)

  const toggleNotification = (categoryId: string, type: "push" | "sms" | "email") => {
    setCategories(
      categories.map((cat) => {
        if (cat.id === categoryId) {
          return { ...cat, [type]: !cat[type] }
        }
        return cat
      }),
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/profile">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold font-sans">Notifications</h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Master Toggle */}
        <Card className="rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#2D6A4F] flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Notifications push</p>
              <p className="text-sm text-gray-500">Activer toutes les notifications</p>
            </div>
            <Switch
              checked={masterPush}
              onCheckedChange={setMasterPush}
              className="data-[state=checked]:bg-[#2D6A4F]"
            />
          </div>
        </Card>

        {/* Category Settings */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-gray-500">Paramètres par catégorie</h2>

          {categories.map((category) => (
            <Card key={category.id} className="rounded-2xl p-4">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#2D6A4F]/10 flex items-center justify-center flex-shrink-0">
                  <category.icon className="w-5 h-5 text-[#2D6A4F]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{category.title}</p>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pl-14">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Switch
                      checked={category.push && masterPush}
                      onCheckedChange={() => toggleNotification(category.id, "push")}
                      disabled={!masterPush}
                      className="data-[state=checked]:bg-[#2D6A4F] scale-75"
                    />
                    <span className="text-sm text-gray-600">Push</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Switch
                      checked={category.sms}
                      onCheckedChange={() => toggleNotification(category.id, "sms")}
                      className="data-[state=checked]:bg-[#F4A261] scale-75"
                    />
                    <span className="text-sm text-gray-600">SMS</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Switch
                      checked={category.email}
                      onCheckedChange={() => toggleNotification(category.id, "email")}
                      className="data-[state=checked]:bg-[#E9C46A] scale-75"
                    />
                    <span className="text-sm text-gray-600">Email</span>
                  </label>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Info */}
        <p className="text-sm text-gray-500 text-center px-4">
          Les notifications SMS peuvent entraîner des frais selon votre opérateur.
        </p>
      </div>
    </div>
  )
}
