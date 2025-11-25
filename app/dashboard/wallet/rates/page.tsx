"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SUPPORTED_COUNTRIES } from "@/lib/types"
import { ArrowLeft, TrendingUp, TrendingDown, Bell, RefreshCw } from "lucide-react"

const historicalRates = [
  { date: "25 Nov", rate: 100 },
  { date: "24 Nov", rate: 99.5 },
  { date: "23 Nov", rate: 99.8 },
  { date: "22 Nov", rate: 99.2 },
  { date: "21 Nov", rate: 99.0 },
  { date: "20 Nov", rate: 98.5 },
  { date: "19 Nov", rate: 98.8 },
]

export default function ExchangeRatesPage() {
  const router = useRouter()
  const [selectedCountry, setSelectedCountry] = useState(SUPPORTED_COUNTRIES[0])

  const currentRate = selectedCountry.nkapRate
  const previousRate = 99.5 // Mock previous rate
  const change = ((currentRate - previousRate) / previousRate) * 100
  const isPositive = change >= 0

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-6 pb-8 rounded-b-[2rem]">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Taux de change</h1>
        </div>

        {/* Current Rate Card */}
        <Card className="p-5 rounded-2xl bg-card text-card-foreground">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">1 Nkap =</p>
              <p className="text-3xl font-bold">
                {currentRate} {selectedCountry.currencySymbol}
              </p>
            </div>
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              }`}
            >
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-medium">
                {isPositive ? "+" : ""}
                {change.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Dernière mise à jour: il y a 5 min</span>
            <Button variant="ghost" size="sm" className="gap-1 h-auto p-0">
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </Button>
          </div>
        </Card>
      </header>

      <div className="p-4 space-y-6">
        {/* Country Selector */}
        <div className="space-y-3">
          <h2 className="font-semibold">Sélectionner un pays</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {SUPPORTED_COUNTRIES.map((country) => (
              <button
                key={country.code}
                onClick={() => setSelectedCountry(country)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCountry.code === country.code
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <span>{country.flag}</span>
                <span className="font-medium">{country.currency}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Rate Chart Placeholder */}
        <Card className="p-4 rounded-2xl">
          <h3 className="font-medium mb-4">Évolution sur 7 jours</h3>
          <div className="h-40 flex items-end justify-between gap-2">
            {historicalRates.map((item, index) => {
              const height = ((item.rate - 98) / 3) * 100 // Normalize to percentage
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/30"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* All Rates */}
        <div className="space-y-3">
          <h2 className="font-semibold">Tous les taux</h2>
          <Card className="rounded-2xl divide-y divide-border">
            {SUPPORTED_COUNTRIES.map((country) => (
              <div key={country.code} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <p className="font-medium">{country.name}</p>
                    <p className="text-sm text-muted-foreground">{country.currency}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {country.nkapRate} {country.currencySymbol}
                  </p>
                  <p className="text-xs text-success">+0.5%</p>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Rate Alert */}
        <Card className="p-4 rounded-2xl bg-accent/10 border-accent/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Alertes de taux</p>
              <p className="text-sm text-muted-foreground">Soyez notifié des changements</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-full bg-transparent">
              Configurer
            </Button>
          </div>
        </Card>
      </div>
    </main>
  )
}
