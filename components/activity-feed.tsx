"use client"

import { Card } from "@/components/ui/card"
import { ArrowDownLeft, ArrowUpRight, Bell, Users } from "lucide-react"

interface Activity {
  id: string
  type: "contribution" | "reception" | "reminder" | "join"
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
  reception: ArrowUpRight,
  reminder: Bell,
  join: Users,
}

const typeColors = {
  contribution: "bg-primary/10 text-primary",
  reception: "bg-success/10 text-success",
  reminder: "bg-warning/10 text-warning",
  join: "bg-accent/20 text-accent-foreground",
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="rounded-2xl divide-y divide-border">
      {activities.map((activity) => {
        const Icon = typeIcons[activity.type]
        return (
          <div key={activity.id} className="p-4 flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${typeColors[activity.type]} flex items-center justify-center shrink-0`}
            >
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
