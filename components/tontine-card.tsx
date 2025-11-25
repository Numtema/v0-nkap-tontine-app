"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, ChevronRight } from "lucide-react"

interface TontineCardProps {
  tontine: {
    id: string
    name: string
    slogan?: string
    contributionAmount: number
    frequency: "daily" | "weekly" | "biweekly" | "monthly" | "yearly"
    currentMembers: number
    maxMembers: number
    status: "pending" | "active" | "completed"
    nextContribution?: Date
    myContributionStatus?: "paid" | "pending" | "late"
  }
}

const frequencyLabels = {
  daily: "Quotidien",
  weekly: "Hebdomadaire",
  biweekly: "Bi-mensuel",
  monthly: "Mensuel",
  yearly: "Annuel",
}

const statusColors = {
  paid: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  late: "bg-destructive/10 text-destructive",
}

const statusLabels = {
  paid: "Payé",
  pending: "En attente",
  late: "En retard",
}

export function TontineCard({ tontine }: TontineCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
    }).format(date)
  }

  return (
    <Link href={`/dashboard/tontines/${tontine.id}`}>
      <Card className="p-4 rounded-2xl hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-primary">{tontine.name.slice(0, 2).toUpperCase()}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground truncate">{tontine.name}</h3>
                {tontine.slogan && <p className="text-xs text-muted-foreground truncate">{tontine.slogan}</p>}
              </div>
              {tontine.myContributionStatus && (
                <Badge
                  variant="secondary"
                  className={`${statusColors[tontine.myContributionStatus]} shrink-0 rounded-full`}
                >
                  {statusLabels[tontine.myContributionStatus]}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>
                  {tontine.currentMembers}/{tontine.maxMembers}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-foreground">{tontine.contributionAmount} Nkap</span>
                <span>/ {frequencyLabels[tontine.frequency].toLowerCase()}</span>
              </div>
            </div>

            {tontine.nextContribution && (
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>Prochaine cotisation: {formatDate(tontine.nextContribution)}</span>
              </div>
            )}
          </div>

          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
        </div>
      </Card>
    </Link>
  )
}
