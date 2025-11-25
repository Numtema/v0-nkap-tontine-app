"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NkapLogo } from "@/components/nkap-logo"
import { NkapBalanceCard } from "@/components/nkap-balance-card"
import { QuickActions } from "@/components/quick-actions"
import { TontineCard } from "@/components/tontine-card"
import { ActivityFeed } from "@/components/activity-feed"
import { Bell, Search } from "lucide-react"
import { SUPPORTED_COUNTRIES } from "@/lib/types"

// Mock data
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
]

const mockActivities = [
  {
    id: "1",
    type: "contribution" as const,
    title: "Contribution reçue",
    description: "Jean-Baptiste a contribué 500 Nkap",
    tontineName: "Famille Nguema",
    time: "2 min",
  },
  {
    id: "2",
    type: "reception" as const,
    title: "Pot reçu",
    description: "Vous avez reçu le pot de 6,000 Nkap",
    tontineName: "Collègues Tech",
    time: "1 heure",
  },
  {
    id: "3",
    type: "reminder" as const,
    title: "Rappel de cotisation",
    description: "Échéance dans 2 jours",
    tontineName: "Diaspora Paris",
    time: "3 heures",
  },
]

export default function DashboardPage() {
  const [showBalance, setShowBalance] = useState(true)
  const [hasNotifications] = useState(true)
  const country = SUPPORTED_COUNTRIES[0]

  return (
    <main className="flex-1">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-6 pb-28 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-lg font-semibold">MN</span>
            </div>
            <div>
              <p className="text-sm text-primary-foreground/70">Bonjour,</p>
              <h1 className="font-semibold">Marie Nguema</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Link href="/dashboard/notifications">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-primary-foreground hover:bg-primary-foreground/20 relative"
              >
                <Bell className="w-5 h-5" />
                {hasNotifications && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-primary" />
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Balance Card - positioned to overlap */}
        <div className="relative">
          <NkapBalanceCard
            balance={15000}
            lockedBalance={5000}
            country={country}
            showBalance={showBalance}
            onToggleVisibility={() => setShowBalance(!showBalance)}
          />
        </div>
      </header>

      {/* Content */}
      <div className="px-4 -mt-16 space-y-6 pb-6">
        {/* Quick Actions */}
        <QuickActions />

        {/* My Tontines */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Mes Tontines</h2>
            <Link href="/dashboard/tontines" className="text-sm text-primary font-medium">
              Voir tout
            </Link>
          </div>
          <div className="space-y-3">
            {mockTontines.slice(0, 2).map((tontine) => (
              <TontineCard key={tontine.id} tontine={tontine} />
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Activité récente</h2>
            <Link href="/dashboard/activity" className="text-sm text-primary font-medium">
              Voir tout
            </Link>
          </div>
          <ActivityFeed activities={mockActivities} />
        </section>

        {/* Exchange Rate Info */}
        <Card className="p-4 rounded-2xl bg-accent/10 border-accent/20">
          <div className="flex items-center gap-3">
            <NkapLogo size="sm" showText={false} />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Taux actuel</p>
              <p className="font-semibold">
                1 Nkap = {country.nkapRate} {country.currencySymbol}
              </p>
            </div>
            <Link href="/dashboard/wallet/rates">
              <Button variant="outline" size="sm" className="rounded-full text-xs bg-transparent">
                Historique
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  )
}
