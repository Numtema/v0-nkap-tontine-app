"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Phone,
  Mail,
  Star,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Crown,
  MessageCircle,
} from "lucide-react"

// Mock member data
const mockMember = {
  id: "1",
  name: "Marie Nguema",
  phone: "+237 691 234 567",
  email: "marie@example.com",
  role: "president",
  joinedAt: new Date("2025-09-01"),
  reputationScore: 4.8,
  avatar: "MN",
  contributionHistory: [
    { cycle: 3, date: new Date("2025-11-01"), status: "paid", amount: 500 },
    { cycle: 2, date: new Date("2025-10-01"), status: "paid", amount: 500 },
    { cycle: 1, date: new Date("2025-09-01"), status: "paid", amount: 500 },
  ],
  stats: {
    totalContributed: 1500,
    onTimePayments: 3,
    latePayments: 0,
    missedPayments: 0,
  },
}

const roleLabels: Record<string, string> = {
  president: "Président",
  secretary: "Secrétaire",
  treasurer: "Trésorier",
  member: "Membre",
}

export default function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string; memberId: string }>
}) {
  const router = useRouter()
  const { id, memberId } = use(params)

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
          <h1 className="text-lg font-semibold">Profil membre</h1>
        </div>

        {/* Member Info */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center relative">
            <span className="text-2xl font-bold">{mockMember.avatar}</span>
            {mockMember.role !== "member" && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-accent flex items-center justify-center">
                <Crown className="w-4 h-4 text-accent-foreground" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{mockMember.name}</h2>
            <Badge
              variant="secondary"
              className="bg-primary-foreground/20 text-primary-foreground border-0 rounded-full mt-1"
            >
              {roleLabels[mockMember.role]}
            </Badge>
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="font-medium">{mockMember.reputationScore}</span>
              <span className="text-sm text-primary-foreground/70">/ 5.0</span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Contact Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 rounded-xl h-12 gap-2 bg-transparent">
            <Phone className="w-4 h-4" />
            Appeler
          </Button>
          <Button variant="outline" className="flex-1 rounded-xl h-12 gap-2 bg-transparent">
            <MessageCircle className="w-4 h-4" />
            Message
          </Button>
        </div>

        {/* Contact Info */}
        <Card className="p-4 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Téléphone</p>
              <p className="font-medium">{mockMember.phone}</p>
            </div>
          </div>
          {mockMember.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{mockMember.email}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Membre depuis</p>
              <p className="font-medium">
                {mockMember.joinedAt.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 rounded-2xl">
            <p className="text-2xl font-bold text-primary">{mockMember.stats.totalContributed}</p>
            <p className="text-sm text-muted-foreground">Nkap cotisés</p>
          </Card>
          <Card className="p-4 rounded-2xl">
            <p className="text-2xl font-bold text-success">{mockMember.stats.onTimePayments}</p>
            <p className="text-sm text-muted-foreground">Paiements à temps</p>
          </Card>
          <Card className="p-4 rounded-2xl">
            <p className="text-2xl font-bold text-warning">{mockMember.stats.latePayments}</p>
            <p className="text-sm text-muted-foreground">Retards</p>
          </Card>
          <Card className="p-4 rounded-2xl">
            <p className="text-2xl font-bold text-destructive">{mockMember.stats.missedPayments}</p>
            <p className="text-sm text-muted-foreground">Manqués</p>
          </Card>
        </div>

        {/* Contribution History */}
        <div>
          <h3 className="font-semibold mb-3">Historique des cotisations</h3>
          <Card className="rounded-2xl divide-y divide-border">
            {mockMember.contributionHistory.map((contribution) => (
              <div key={contribution.cycle} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      contribution.status === "paid"
                        ? "bg-success/10"
                        : contribution.status === "pending"
                          ? "bg-warning/10"
                          : "bg-destructive/10"
                    }`}
                  >
                    {contribution.status === "paid" && <CheckCircle className="w-5 h-5 text-success" />}
                    {contribution.status === "pending" && <Clock className="w-5 h-5 text-warning" />}
                    {contribution.status === "late" && <AlertCircle className="w-5 h-5 text-destructive" />}
                  </div>
                  <div>
                    <p className="font-medium">Cycle {contribution.cycle}</p>
                    <p className="text-sm text-muted-foreground">
                      {contribution.date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{contribution.amount} Nkap</p>
                  <p
                    className={`text-xs ${
                      contribution.status === "paid"
                        ? "text-success"
                        : contribution.status === "pending"
                          ? "text-warning"
                          : "text-destructive"
                    }`}
                  >
                    {contribution.status === "paid"
                      ? "Payé"
                      : contribution.status === "pending"
                        ? "En attente"
                        : "En retard"}
                  </p>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </main>
  )
}
