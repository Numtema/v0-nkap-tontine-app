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
  paid: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  late: "bg-destructive/10 text-destructive border-destructive/20",
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
      <Card className="p-4 rounded-2xl sm:rounded-3xl glass border-border/30 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5 group">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0 group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
            <span className="text-base sm:text-lg font-bold text-primary">
              {tontine.name.slice(0, 2).toUpperCase()}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground truncate text-sm sm:text-base">{tontine.name}</h3>
                {tontine.slogan && <p className="text-xs text-muted-foreground truncate">{tontine.slogan}</p>}
              </div>
              {tontine.myContributionStatus && (
                <Badge
                  variant="outline"
                  className={`${statusColors[tontine.myContributionStatus]} shrink-0 rounded-full text-xs border`}
                >
                  {statusLabels[tontine.myContributionStatus]}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>
                  {tontine.currentMembers}/{tontine.maxMembers}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-foreground">{tontine.contributionAmount} Nkap</span>
                <span className="hidden sm:inline">/ {frequencyLabels[tontine.frequency].toLowerCase()}</span>
              </div>
            </div>

            {tontine.nextContribution && (
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>Prochaine: {formatDate(tontine.nextContribution)}</span>
              </div>
            )}
          </div>

          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>
      </Card>
    </Link>
  )
}
