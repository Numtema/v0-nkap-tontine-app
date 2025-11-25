"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SUPPORTED_COUNTRIES } from "@/lib/types"
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Filter,
} from "lucide-react"

const mockCaisse = {
  id: "1",
  name: "Caisse Principale",
  type: "main",
  balance: 6000,
  contributionAmount: 500,
  totalContributions: 45,
  totalWithdrawals: 3,
  lastActivity: new Date("2025-11-20"),
}

const mockTransactions = [
  {
    id: "1",
    type: "contribution",
    amount: 500,
    member: "Marie Nguema",
    date: new Date("2025-11-20"),
    status: "completed",
  },
  {
    id: "2",
    type: "contribution",
    amount: 500,
    member: "Jean-Baptiste Kamga",
    date: new Date("2025-11-19"),
    status: "completed",
  },
  {
    id: "3",
    type: "withdrawal",
    amount: 6000,
    member: "Paul Biya",
    description: "Pot du cycle 2",
    date: new Date("2025-11-15"),
    status: "completed",
  },
  {
    id: "4",
    type: "contribution",
    amount: 500,
    member: "Aminata Diallo",
    date: new Date("2025-11-14"),
    status: "completed",
  },
  {
    id: "5",
    type: "contribution",
    amount: 500,
    member: "Fatou Sow",
    date: new Date("2025-11-13"),
    status: "pending",
  },
]

export default function CaisseDetailPage({ params }: { params: Promise<{ id: string; caisseId: string }> }) {
  const router = useRouter()
  const { id, caisseId } = use(params)
  const country = SUPPORTED_COUNTRIES[0]

  const totalIn = mockTransactions.filter((t) => t.type === "contribution").reduce((sum, t) => sum + t.amount, 0)
  const totalOut = mockTransactions.filter((t) => t.type === "withdrawal").reduce((sum, t) => sum + t.amount, 0)

  return (
    <main className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-6 pb-24 rounded-b-[2rem]">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{mockCaisse.name}</h1>
            <p className="text-sm text-primary-foreground/70">Famille Nguema</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-primary-foreground hover:bg-primary-foreground/20"
          >
            <Download className="w-5 h-5" />
          </Button>
        </div>

        {/* Balance Card */}
        <Card className="p-6 rounded-3xl bg-card text-card-foreground shadow-lg mx-auto max-w-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Solde actuel</p>
              <p className="text-2xl font-bold">{mockCaisse.balance.toLocaleString()} Nkap</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            ≈ {(mockCaisse.balance * country.nkapRate).toLocaleString()} {country.currencySymbol}
          </p>

          {/* Quick Stats */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-border">
            <div className="flex-1">
              <div className="flex items-center gap-1 text-success">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Entrées</span>
              </div>
              <p className="text-lg font-semibold">{totalIn.toLocaleString()}</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 text-destructive">
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm font-medium">Sorties</span>
              </div>
              <p className="text-lg font-semibold">{totalOut.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </header>

      {/* Stats */}
      <div className="px-4 -mt-8 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 rounded-2xl">
            <p className="text-2xl font-bold text-primary">{mockCaisse.totalContributions}</p>
            <p className="text-sm text-muted-foreground">Cotisations reçues</p>
          </Card>
          <Card className="p-4 rounded-2xl">
            <p className="text-2xl font-bold text-secondary-foreground">{mockCaisse.totalWithdrawals}</p>
            <p className="text-sm text-muted-foreground">Retraits effectués</p>
          </Card>
        </div>
      </div>

      {/* Transactions */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Historique</h2>
          <Button variant="outline" size="sm" className="rounded-full gap-1 bg-transparent">
            <Filter className="w-4 h-4" />
            Filtrer
          </Button>
        </div>

        <Card className="rounded-2xl divide-y divide-border">
          {mockTransactions.map((transaction) => (
            <div key={transaction.id} className="p-4 flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === "contribution" ? "bg-success/10" : "bg-destructive/10"
                }`}
              >
                {transaction.type === "contribution" ? (
                  <ArrowDownLeft className="w-5 h-5 text-success" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-destructive" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{transaction.member}</p>
                <p className="text-xs text-muted-foreground">
                  {transaction.description || (transaction.type === "contribution" ? "Cotisation" : "Retrait")} •{" "}
                  {transaction.date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${transaction.type === "contribution" ? "text-success" : "text-destructive"}`}
                >
                  {transaction.type === "contribution" ? "+" : "-"}
                  {transaction.amount} Nkap
                </p>
                <Badge
                  variant="secondary"
                  className={`text-xs rounded-full ${
                    transaction.status === "completed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  }`}
                >
                  {transaction.status === "completed" ? "Complété" : "En attente"}
                </Badge>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </main>
  )
}
