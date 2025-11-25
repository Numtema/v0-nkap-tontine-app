"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NkapBalanceCard } from "@/components/nkap-balance-card"
import { SUPPORTED_COUNTRIES, type Transaction } from "@/lib/types"
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Filter,
  TrendingUp,
  CreditCard,
  Smartphone,
  Building2,
  Bitcoin,
} from "lucide-react"

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "deposit",
    amount: 5000,
    nkapAmount: 5000,
    localAmount: 500000,
    currency: "XAF",
    status: "completed",
    description: "Recharge via Mobile Money",
    createdAt: new Date("2025-11-24T10:30:00"),
  },
  {
    id: "2",
    type: "contribution",
    amount: -500,
    nkapAmount: 500,
    localAmount: 50000,
    currency: "XAF",
    status: "completed",
    description: "Cotisation Famille Nguema",
    createdAt: new Date("2025-11-23T15:00:00"),
    tontineId: "1",
  },
  {
    id: "3",
    type: "reception",
    amount: 6000,
    nkapAmount: 6000,
    localAmount: 600000,
    currency: "XAF",
    status: "completed",
    description: "Pot reçu - Collègues Tech",
    createdAt: new Date("2025-11-20T12:00:00"),
    tontineId: "2",
  },
  {
    id: "4",
    type: "withdrawal",
    amount: -2000,
    nkapAmount: 2000,
    localAmount: 200000,
    currency: "XAF",
    status: "pending",
    description: "Retrait vers Orange Money",
    createdAt: new Date("2025-11-19T09:00:00"),
  },
  {
    id: "5",
    type: "fee",
    amount: -10,
    nkapAmount: 10,
    localAmount: 1000,
    currency: "XAF",
    status: "completed",
    description: "Frais de transaction",
    createdAt: new Date("2025-11-19T09:00:00"),
  },
]

const transactionTypeConfig = {
  deposit: { icon: ArrowDownLeft, color: "text-success", bgColor: "bg-success/10", label: "Recharge" },
  withdrawal: { icon: ArrowUpRight, color: "text-destructive", bgColor: "bg-destructive/10", label: "Retrait" },
  contribution: { icon: ArrowUpRight, color: "text-primary", bgColor: "bg-primary/10", label: "Cotisation" },
  reception: { icon: ArrowDownLeft, color: "text-success", bgColor: "bg-success/10", label: "Pot reçu" },
  fee: { icon: Clock, color: "text-muted-foreground", bgColor: "bg-muted", label: "Frais" },
  penalty: { icon: Clock, color: "text-destructive", bgColor: "bg-destructive/10", label: "Pénalité" },
}

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const country = SUPPORTED_COUNTRIES[0]

  const filteredTransactions = mockTransactions.filter((t) => {
    if (filter === "all") return true
    return t.type === filter
  })

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return "Aujourd'hui"
    if (days === 1) return "Hier"
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
    }).format(date)
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-6 pb-28 rounded-b-[2rem]">
        <h1 className="text-xl font-semibold mb-6">Mon Portefeuille</h1>

        <NkapBalanceCard
          balance={15000}
          lockedBalance={5000}
          country={country}
          showBalance={showBalance}
          onToggleVisibility={() => setShowBalance(!showBalance)}
        />
      </header>

      {/* Payment Methods Quick Access */}
      <div className="px-4 -mt-16 mb-6">
        <Card className="p-4 rounded-2xl">
          <h2 className="font-medium mb-3">Moyens de paiement</h2>
          <div className="flex gap-3">
            <Link href="/dashboard/wallet/topup?method=mobile" className="flex-1">
              <div className="p-3 bg-secondary/10 rounded-xl flex flex-col items-center gap-2">
                <Smartphone className="w-6 h-6 text-secondary-foreground" />
                <span className="text-xs">Mobile Money</span>
              </div>
            </Link>
            <Link href="/dashboard/wallet/topup?method=card" className="flex-1">
              <div className="p-3 bg-primary/10 rounded-xl flex flex-col items-center gap-2">
                <CreditCard className="w-6 h-6 text-primary" />
                <span className="text-xs">Carte</span>
              </div>
            </Link>
            <Link href="/dashboard/wallet/topup?method=bank" className="flex-1">
              <div className="p-3 bg-accent/20 rounded-xl flex flex-col items-center gap-2">
                <Building2 className="w-6 h-6 text-accent-foreground" />
                <span className="text-xs">Banque</span>
              </div>
            </Link>
            <Link href="/dashboard/wallet/topup?method=crypto" className="flex-1">
              <div className="p-3 bg-muted rounded-xl flex flex-col items-center gap-2">
                <Bitcoin className="w-6 h-6" />
                <span className="text-xs">Crypto</span>
              </div>
            </Link>
          </div>
        </Card>
      </div>

      {/* Exchange Rate */}
      <div className="px-4 mb-6">
        <Link href="/dashboard/wallet/rates">
          <Card className="p-4 rounded-2xl flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taux de change</p>
                <p className="font-semibold">
                  1 Nkap = {country.nkapRate} {country.currencySymbol}
                </p>
              </div>
            </div>
            <span className="text-xs text-success">+0.5%</span>
          </Card>
        </Link>
      </div>

      {/* Transactions */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Transactions</h2>
          <Button variant="outline" size="sm" className="rounded-full gap-2 bg-transparent">
            <Filter className="w-4 h-4" />
            Filtrer
          </Button>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {["all", "deposit", "withdrawal", "contribution", "reception"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              }`}
            >
              {f === "all" ? "Tout" : transactionTypeConfig[f as keyof typeof transactionTypeConfig]?.label}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <Card className="rounded-2xl divide-y divide-border">
          {filteredTransactions.map((transaction) => {
            const config = transactionTypeConfig[transaction.type]
            const Icon = config.icon

            return (
              <div key={transaction.id} className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(transaction.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${transaction.amount > 0 ? "text-success" : ""}`}>
                    {transaction.amount > 0 ? "+" : ""}
                    {transaction.nkapAmount.toLocaleString()} Nkap
                  </p>
                  {transaction.status === "pending" && <span className="text-xs text-warning">En cours</span>}
                </div>
              </div>
            )
          })}
        </Card>
      </div>
    </main>
  )
}
