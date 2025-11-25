"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TontineCard } from "@/components/tontine-card"
import { Plus, Search, Users } from "lucide-react"
import { Input } from "@/components/ui/input"

const mockTontines = [
  {
    id: "1",
    name: "Famille Nguema",
    slogan: "Ensemble pour réussir",
    contributionAmount: 500,
    frequency: "monthly" as const,
    currentMembers: 12,
    maxMembers: 15,
    status: "active" as const,
    nextContribution: new Date("2025-12-01"),
    myContributionStatus: "pending" as const,
  },
  {
    id: "2",
    name: "Collègues Tech",
    slogan: "Innovation solidaire",
    contributionAmount: 200,
    frequency: "weekly" as const,
    currentMembers: 8,
    maxMembers: 10,
    status: "active" as const,
    nextContribution: new Date("2025-11-28"),
    myContributionStatus: "paid" as const,
  },
  {
    id: "3",
    name: "Diaspora Paris",
    slogan: "Loin mais unis",
    contributionAmount: 1000,
    frequency: "monthly" as const,
    currentMembers: 20,
    maxMembers: 20,
    status: "active" as const,
    nextContribution: new Date("2025-12-15"),
    myContributionStatus: "late" as const,
  },
  {
    id: "4",
    name: "Association Quartier",
    slogan: "Le quartier avant tout",
    contributionAmount: 100,
    frequency: "weekly" as const,
    currentMembers: 5,
    maxMembers: 15,
    status: "pending" as const,
    myContributionStatus: "pending" as const,
  },
]

export default function TontinesPage() {
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "completed">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTontines = mockTontines.filter((t) => {
    if (filter !== "all" && t.status !== filter) return false
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const activeTontines = mockTontines.filter((t) => t.status === "active").length
  const totalMembers = mockTontines.reduce((sum, t) => sum + t.currentMembers, 0)

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-6 rounded-b-[2rem]">
        <h1 className="text-xl font-semibold mb-4">Mes Tontines</h1>

        {/* Stats */}
        <div className="flex gap-3">
          <Card className="flex-1 p-3 rounded-xl bg-primary-foreground/10 border-0">
            <p className="text-2xl font-bold text-primary-foreground">{activeTontines}</p>
            <p className="text-xs text-primary-foreground/70">Tontines actives</p>
          </Card>
          <Card className="flex-1 p-3 rounded-xl bg-primary-foreground/10 border-0">
            <p className="text-2xl font-bold text-primary-foreground">{totalMembers}</p>
            <p className="text-xs text-primary-foreground/70">Membres total</p>
          </Card>
          <Card className="flex-1 p-3 rounded-xl bg-primary-foreground/10 border-0">
            <p className="text-2xl font-bold text-primary-foreground">3</p>
            <p className="text-xs text-primary-foreground/70">En attente</p>
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
                filter === f.value ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
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
            <p className="text-muted-foreground mb-4">Aucune tontine trouvée</p>
            <div className="flex gap-2 justify-center">
              <Link href="/dashboard/create">
                <Button className="rounded-full gap-2">
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
          <Button size="lg" className="w-14 h-14 rounded-full shadow-lg">
            <Plus className="w-6 h-6" />
            <span className="sr-only">Créer une tontine</span>
          </Button>
        </Link>
      </div>
    </main>
  )
}
