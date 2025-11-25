"use client"

import Link from "next/link"
import { Users, UserPlus, ClipboardList, Gift } from "lucide-react"

const actions = [
  {
    href: "/dashboard/tontines",
    icon: Users,
    label: "Mes Tontines",
    color: "bg-primary/10 text-primary",
  },
  {
    href: "/dashboard/join",
    icon: UserPlus,
    label: "Rejoindre",
    color: "bg-secondary/20 text-secondary-foreground",
  },
  {
    href: "/dashboard/reports",
    icon: ClipboardList,
    label: "Rapports",
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    href: "/dashboard/rewards",
    icon: Gift,
    label: "Récompenses",
    color: "bg-success/10 text-success",
  },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Link
            key={action.href}
            href={action.href}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-center">{action.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
