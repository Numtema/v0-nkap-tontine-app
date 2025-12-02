"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, ArrowUpRight, ArrowDownLeft, TrendingUp } from "lucide-react"
import type { Country } from "@/lib/types"
import Link from "next/link"

interface NkapBalanceCardProps {
  balance: number
  lockedBalance: number
  country: Country
  showBalance?: boolean
  onToggleVisibility?: () => void
}

export function NkapBalanceCard({ balance, lockedBalance, country }: NkapBalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true)
  const availableBalance = balance - lockedBalance
  const localEquivalent = balance * country.nkapRate

  return (
    <Card className="glass rounded-3xl p-5 sm:p-6 shadow-xl border-white/20 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div>
          <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
            Solde total
            <span className="inline-flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" />
              +2.5%
            </span>
          </p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tabular-nums">
              {showBalance ? balance.toLocaleString() : "••••••"}
            </h2>
            <span className="text-lg font-semibold text-primary">Nkap</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {showBalance ? `≈ ${localEquivalent.toLocaleString()} ${country.currencySymbol}` : "≈ ••••••"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowBalance(!showBalance)}
          className="rounded-full hover:bg-secondary/80 transition-colors"
        >
          {showBalance ? (
            <Eye className="w-5 h-5 text-muted-foreground" />
          ) : (
            <EyeOff className="w-5 h-5 text-muted-foreground" />
          )}
        </Button>
      </div>

      {/* Balance breakdown */}
      <div className="flex gap-3 sm:gap-4 mb-5 relative z-10">
        <div className="flex-1 p-3 bg-secondary/50 rounded-2xl backdrop-blur border border-border/30">
          <p className="text-xs text-muted-foreground">Disponible</p>
          <p className="font-semibold text-foreground tabular-nums">
            {showBalance ? availableBalance.toLocaleString() : "••••"}
          </p>
        </div>
        <div className="flex-1 p-3 bg-secondary/50 rounded-2xl backdrop-blur border border-border/30">
          <p className="text-xs text-muted-foreground">En tontines</p>
          <p className="font-semibold text-foreground tabular-nums">
            {showBalance ? lockedBalance.toLocaleString() : "••••"}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 relative z-10">
        <Link href="/dashboard/wallet/topup" className="flex-1">
          <Button className="w-full rounded-xl h-12 gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5">
            <ArrowDownLeft className="w-4 h-4" />
            Recharger
          </Button>
        </Link>
        <Link href="/dashboard/wallet/withdraw" className="flex-1">
          <Button
            variant="outline"
            className="w-full rounded-xl h-12 gap-2 bg-card/50 backdrop-blur border-border/50 hover:bg-card hover:border-primary/30 transition-all hover:-translate-y-0.5"
          >
            <ArrowUpRight className="w-4 h-4" />
            Retirer
          </Button>
        </Link>
      </div>
    </Card>
  )
}
