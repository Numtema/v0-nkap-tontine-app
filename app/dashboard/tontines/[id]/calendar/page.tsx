"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ChevronLeft, ChevronRight, Crown, Check, Clock } from "lucide-react"

// Mock cycle data
const mockCycles = [
  { id: 1, beneficiary: "Marie Nguema", date: new Date("2025-09-01"), status: "completed" },
  { id: 2, beneficiary: "Jean-Baptiste Kamga", date: new Date("2025-10-01"), status: "completed" },
  { id: 3, beneficiary: "Paul Biya", date: new Date("2025-11-01"), status: "current" },
  { id: 4, beneficiary: "Aminata Diallo", date: new Date("2025-12-01"), status: "upcoming" },
  { id: 5, beneficiary: "Fatou Sow", date: new Date("2026-01-01"), status: "upcoming" },
  { id: 6, beneficiary: "À déterminer", date: new Date("2026-02-01"), status: "pending" },
]

export default function CalendarPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const statusColors = {
    completed: "bg-success/10 text-success border-success/20",
    current: "bg-primary/10 text-primary border-primary/20",
    upcoming: "bg-warning/10 text-warning border-warning/20",
    pending: "bg-muted text-muted-foreground border-border",
  }

  const statusIcons = {
    completed: Check,
    current: Crown,
    upcoming: Clock,
    pending: Clock,
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex items-center gap-4 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-semibold text-lg">Calendrier des cycles</h1>
          <p className="text-sm text-muted-foreground">Famille Nguema</p>
        </div>
      </header>

      {/* Month Navigation */}
      <div className="p-4 bg-muted/50 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
          className="rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-semibold">
          {currentMonth.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
          className="rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Timeline */}
      <div className="p-4 space-y-4">
        <h3 className="font-semibold">Ordre des bénéficiaires</h3>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border" />

          <div className="space-y-4">
            {mockCycles.map((cycle, index) => {
              const StatusIcon = statusIcons[cycle.status as keyof typeof statusIcons]
              return (
                <div key={cycle.id} className="flex gap-4 relative">
                  {/* Timeline dot */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${statusColors[cycle.status as keyof typeof statusColors]}`}
                  >
                    <StatusIcon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <Card
                    className={`flex-1 p-4 rounded-2xl ${
                      cycle.status === "current" ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Cycle {cycle.id}</span>
                      <span className="text-sm text-muted-foreground">
                        {cycle.date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <p className="font-semibold">{cycle.beneficiary}</p>
                    {cycle.status === "current" && (
                      <span className="inline-block mt-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                        En cours
                      </span>
                    )}
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
