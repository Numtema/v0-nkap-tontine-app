"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import type { Country } from "@/lib/types"
import Link from "next/link"

interface NkapBalanceCardProps {
  balance: number
  lockedBalance: number
  country: Country
  showBalance: boolean
  onToggleVisibility: () => void
}

export function NkapBalanceCard({
  balance,
  lockedBalance,
  country,
  showBalance,
  onToggleVisibility,
}: NkapBalanceCardProps) {
  const availableBalance = balance - lockedBalance
  const localEquivalent = balance * country.nkapRate

  return (
    <Card className="bg-card rounded-3xl p-5 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Solde total</p>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold text-foreground">{showBalance ? balance.toLocaleString() : "••••••"}</h2>
            <span className="text-lg font-medium text-primary">Nkap</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {showBalance ? `≈ ${localEquivalent.toLocaleString()} ${country.currencySymbol}` : "≈ ••••••"}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggleVisibility} className="rounded-full">
          {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </Button>
      </div>

      {/* Balance breakdown */}
      <div className="flex gap-4 mb-5">
        <div className="flex-1 p-3 bg-muted rounded-2xl">
          <p className="text-xs text-muted-foreground">Disponible</p>
          <p className="font-semibold text-foreground">{showBalance ? availableBalance.toLocaleString() : "••••"}</p>
        </div>
        <div className="flex-1 p-3 bg-muted rounded-2xl">
          <p className="text-xs text-muted-foreground">En tontines</p>
          <p className="font-semibold text-foreground">{showBalance ? lockedBalance.toLocaleString() : "••••"}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Link href="/dashboard/wallet/topup" className="flex-1">
          <Button className="w-full rounded-xl h-12 gap-2">
            <ArrowDownLeft className="w-4 h-4" />
            Recharger
          </Button>
        </Link>
        <Link href="/dashboard/wallet/withdraw" className="flex-1">
          <Button variant="outline" className="w-full rounded-xl h-12 gap-2 bg-transparent">
            <ArrowUpRight className="w-4 h-4" />
            Retirer
          </Button>
        </Link>
      </div>
    </Card>
  )
}
