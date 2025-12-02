"use client"

import { Card } from "@/components/ui/card"
import { ArrowDownLeft, ArrowUpRight, Bell, Users, Vote, AlertTriangle } from "lucide-react"

interface Activity {
  id: string
  type: "contribution" | "payout" | "join" | "penalty" | "vote" | "reception" | "reminder"
  title: string
  description: string
  tontineName?: string
  time: string
}

interface ActivityFeedProps {
  activities: Activity[]
}

const typeIcons = {
  contribution: ArrowDownLeft,
  payout: ArrowUpRight,
  reception: ArrowUpRight,
  reminder: Bell,
  join: Users,
  vote: Vote,
  penalty: AlertTriangle,
}

const typeColors = {
  contribution: "bg-primary/10 text-primary",
  payout: "bg-success/10 text-success",
  reception: "bg-success/10 text-success",
  reminder: "bg-warning/10 text-warning",
  join: "bg-accent/20 text-accent-foreground",
  vote: "bg-primary/10 text-primary",
  penalty: "bg-destructive/10 text-destructive",
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="rounded-2xl sm:rounded-3xl divide-y divide-border/50 overflow-hidden glass border-border/30">
      {activities.map((activity, index) => {
        const Icon = typeIcons[activity.type] || ArrowDownLeft
        const color = typeColors[activity.type] || "bg-primary/10 text-primary"
        return (
          <div
            key={activity.id}
            className={`p-4 flex items-start gap-3 hover:bg-secondary/30 transition-colors animate-slide-up`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">{activity.title}</p>
              <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
              {activity.tontineName && <p className="text-xs text-primary mt-1">{activity.tontineName}</p>}
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
          </div>
        )
      })}
    </Card>
  )
}
