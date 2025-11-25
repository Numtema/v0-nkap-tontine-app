"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Bell, Users, Vote, MessageCircle, Crown, Filter } from "lucide-react"

const mockActivities = [
  {
    id: "1",
    type: "contribution",
    title: "Cotisation reçue",
    description: "Jean-Baptiste a cotisé 500 Nkap",
    tontine: "Famille Nguema",
    time: "2 min",
    icon: ArrowDownLeft,
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
  {
    id: "2",
    type: "pot",
    title: "Pot distribué",
    description: "Paul Biya a reçu le pot de 6,000 Nkap",
    tontine: "Famille Nguema",
    time: "1 heure",
    icon: Crown,
    iconBg: "bg-accent/10",
    iconColor: "text-accent-foreground",
  },
  {
    id: "3",
    type: "message",
    title: "Nouveau message",
    description: "Marie a envoyé un message dans le groupe",
    tontine: "Collègues Tech",
    time: "2 heures",
    icon: MessageCircle,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    id: "4",
    type: "vote",
    title: "Élection terminée",
    description: "Le nouveau bureau a été élu",
    tontine: "Famille Nguema",
    time: "5 heures",
    icon: Vote,
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary-foreground",
  },
  {
    id: "5",
    type: "member",
    title: "Nouveau membre",
    description: "Amadou Ba a rejoint la tontine",
    tontine: "Diaspora Paris",
    time: "1 jour",
    icon: Users,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    id: "6",
    type: "withdrawal",
    title: "Retrait effectué",
    description: "Vous avez retiré 2,000 Nkap",
    tontine: null,
    time: "2 jours",
    icon: ArrowUpRight,
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
  },
  {
    id: "7",
    type: "reminder",
    title: "Rappel de cotisation",
    description: "Échéance dans 3 jours pour Collègues Tech",
    tontine: "Collègues Tech",
    time: "2 jours",
    icon: Bell,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
]

export default function ActivityPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<"all" | "contributions" | "tontines" | "wallet">("all")

  const filteredActivities = mockActivities.filter((a) => {
    if (filter === "all") return true
    if (filter === "contributions") return a.type === "contribution" || a.type === "pot"
    if (filter === "tontines") return a.type === "vote" || a.type === "member" || a.type === "message"
    if (filter === "wallet") return a.type === "withdrawal"
    return true
  })

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex items-center gap-4 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-semibold text-lg flex-1">Activité</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Filter className="w-5 h-5" />
        </Button>
      </header>

      {/* Filters */}
      <div className="p-4 flex gap-2 overflow-x-auto">
        {[
          { value: "all", label: "Tout" },
          { value: "contributions", label: "Cotisations" },
          { value: "tontines", label: "Tontines" },
          { value: "wallet", label: "Portefeuille" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value as typeof filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f.value ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="px-4">
        <Card className="rounded-2xl divide-y divide-border">
          {filteredActivities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="p-4 flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full ${activity.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${activity.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  {activity.tontine && (
                    <Badge variant="secondary" className="mt-2 rounded-full text-xs">
                      {activity.tontine}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
              </div>
            )
          })}
        </Card>
      </div>
    </main>
  )
}
