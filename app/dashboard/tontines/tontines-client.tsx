"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TontineCard } from "@/components/tontine-card"
import { Plus, Search, Users } from "lucide-react"
import { Input } from "@/components/ui/input"

type Tontine = {
  id: string
  name: string
  slogan: string
  contributionAmount: number
  frequency: "daily" | "weekly" | "biweekly" | "monthly" | "yearly"
  currentMembers: number
  maxMembers: number
  status: "active" | "pending" | "completed"
  nextContribution: Date
  myContributionStatus: "pending" | "paid" | "late"
  myRole: string
}

export function TontinesPageClient({ initialTontines }: { initialTontines: Tontine[] }) {
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "completed">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTontines = initialTontines.filter((t) => {
    if (filter !== "all" && t.status !== filter) return false
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const activeTontines = initialTontines.filter((t) => t.status === "active").length
  const totalMembers = initialTontines.reduce((sum, t) => sum + t.currentMembers, 0)
  const pendingTontines = initialTontines.filter((t) => t.status === "pending").length

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#87A28E] to-[#6B8E73] text-white p-6 rounded-b-[2rem]">
        <h1 className="text-xl font-semibold mb-4">Mes Tontines</h1>

        {/* Stats */}
        <div className="flex gap-3">
          <Card className="flex-1 p-3 rounded-xl bg-white/10 border-0 backdrop-blur-sm">
            <p className="text-2xl font-bold text-white">{activeTontines}</p>
            <p className="text-xs text-white/70">Tontines actives</p>
          </Card>
          <Card className="flex-1 p-3 rounded-xl bg-white/10 border-0 backdrop-blur-sm">
            <p className="text-2xl font-bold text-white">{totalMembers}</p>
            <p className="text-xs text-white/70">Membres total</p>
          </Card>
          <Card className="flex-1 p-3 rounded-xl bg-white/10 border-0 backdrop-blur-sm">
            <p className="text-2xl font-bold text-white">{pendingTontines}</p>
            <p className="text-xs text-white/70">En attente</p>
          </Card>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher une tontine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 rounded-xl pl-12"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { value: "all", label: "Toutes" },
            { value: "active", label: "Actives" },
            { value: "pending", label: "En attente" },
            { value: "completed", label: "Terminées" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as typeof filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f.value ? "bg-[#87A28E] text-white" : "bg-muted hover:bg-muted/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Tontine List */}
        {filteredTontines.length > 0 ? (
          <div className="space-y-3">
            {filteredTontines.map((tontine) => (
              <TontineCard key={tontine.id} tontine={tontine} />
            ))}
          </div>
        ) : (
          <Card className="p-8 rounded-2xl text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {initialTontines.length === 0 ? "Vous n'avez pas encore de tontine" : "Aucune tontine trouvée"}
            </p>
            <div className="flex gap-2 justify-center">
              <Link href="/dashboard/create">
                <Button className="rounded-full gap-2 bg-[#87A28E] hover:bg-[#6B8E73]">
                  <Plus className="w-4 h-4" />
                  Créer
                </Button>
              </Link>
              <Link href="/dashboard/join">
                <Button variant="outline" className="rounded-full bg-transparent">
                  Rejoindre
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* FAB */}
        <Link href="/dashboard/create" className="fixed right-4 bottom-24">
          <Button size="lg" className="w-14 h-14 rounded-full shadow-lg bg-[#87A28E] hover:bg-[#6B8E73]">
            <Plus className="w-6 h-6" />
            <span className="sr-only">Créer une tontine</span>
          </Button>
        </Link>
      </div>
    </main>
  )
}
