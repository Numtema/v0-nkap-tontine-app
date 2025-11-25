"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SUPPORTED_COUNTRIES } from "@/lib/types"
import { ArrowLeft, AlertTriangle, Clock, Check, Ban } from "lucide-react"

const mockPenalties = [
  {
    id: "1",
    member: "Fatou Sow",
    avatar: "FS",
    type: "late_payment",
    amount: 50,
    reason: "Retard de paiement - Cycle 3",
    date: new Date("2025-11-15"),
    status: "pending",
    daysLate: 5,
  },
  {
    id: "2",
    member: "Paul Biya",
    avatar: "PB",
    type: "absence",
    amount: 50,
    reason: "Absence non justifiée - Réunion du 01/11",
    date: new Date("2025-11-01"),
    status: "paid",
  },
  {
    id: "3",
    member: "Jean-Baptiste Kamga",
    avatar: "JK",
    type: "late_payment",
    amount: 50,
    reason: "Retard de paiement - Cycle 2",
    date: new Date("2025-10-08"),
    status: "paid",
  },
]

const mockMyPenalties = [
  {
    id: "p1",
    type: "late_payment",
    amount: 50,
    reason: "Retard de paiement - Cycle 1",
    date: new Date("2025-09-05"),
    status: "paid",
  },
]

export default function PenaltiesPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [activeTab, setActiveTab] = useState<"all" | "mine">("all")
  const country = SUPPORTED_COUNTRIES[0]

  const pendingPenalties = mockPenalties.filter((p) => p.status === "pending")
  const totalPending = pendingPenalties.reduce((sum, p) => sum + p.amount, 0)

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-6 rounded-b-[2rem]">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Pénalités & Amendes</h1>
            <p className="text-sm text-primary-foreground/70">Famille Nguema</p>
          </div>
        </div>

        {/* Summary */}
        <Card className="p-4 rounded-2xl bg-primary-foreground/10 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-foreground/70">Total en attente</p>
              <p className="text-2xl font-bold">{totalPending} Nkap</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary-foreground/70">Pénalités actives</p>
              <p className="text-2xl font-bold">{pendingPenalties.length}</p>
            </div>
          </div>
        </Card>
      </header>

      {/* Tabs */}
      <div className="px-4 -mt-4 mb-4">
        <Card className="p-1 rounded-2xl">
          <div className="flex">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "all"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Toutes les pénalités
            </button>
            <button
              onClick={() => setActiveTab("mine")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "mine"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mes pénalités
            </button>
          </div>
        </Card>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === "all" && (
          <>
            {/* Penalty Types Info */}
            <Card className="p-4 rounded-2xl bg-muted/50">
              <h3 className="font-semibold mb-3">Types de pénalités</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-warning" />
                  <span>
                    <strong>Retard de paiement:</strong> 10% du montant dû
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Ban className="w-4 h-4 text-destructive" />
                  <span>
                    <strong>Absence non justifiée:</strong> 50 Nkap
                  </span>
                </div>
              </div>
            </Card>

            {/* All Penalties List */}
            <Card className="rounded-2xl divide-y divide-border">
              {mockPenalties.map((penalty) => (
                <div key={penalty.id} className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <span className="font-medium text-destructive">{penalty.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{penalty.member}</p>
                    <p className="text-sm text-muted-foreground">{penalty.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      {penalty.date.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-destructive">{penalty.amount} Nkap</p>
                    <Badge
                      className={`rounded-full ${
                        penalty.status === "paid" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                      }`}
                    >
                      {penalty.status === "paid" ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Payée
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 mr-1" />
                          En attente
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              ))}
            </Card>
          </>
        )}

        {activeTab === "mine" && (
          <>
            {mockMyPenalties.length > 0 ? (
              <Card className="rounded-2xl divide-y divide-border">
                {mockMyPenalties.map((penalty) => (
                  <div key={penalty.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-warning" />
                        <span className="font-medium">
                          {penalty.type === "late_payment" ? "Retard de paiement" : "Absence"}
                        </span>
                      </div>
                      <Badge
                        className={`rounded-full ${
                          penalty.status === "paid" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                        }`}
                      >
                        {penalty.status === "paid" ? "Payée" : "En attente"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{penalty.reason}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{penalty.date.toLocaleDateString("fr-FR")}</span>
                      <span className="font-semibold">{penalty.amount} Nkap</span>
                    </div>
                  </div>
                ))}
              </Card>
            ) : (
              <Card className="p-8 rounded-2xl text-center">
                <Check className="w-12 h-12 text-success mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Aucune pénalité</h3>
                <p className="text-sm text-muted-foreground">
                  Vous n'avez aucune pénalité en cours. Continuez comme ça !
                </p>
              </Card>
            )}
          </>
        )}
      </div>
    </main>
  )
}
