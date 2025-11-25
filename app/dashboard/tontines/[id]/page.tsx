"use client"

import { useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SUPPORTED_COUNTRIES } from "@/lib/types"
import {
  ArrowLeft,
  MoreVertical,
  Users,
  Wallet,
  Calendar,
  MessageCircle,
  Settings,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Crown,
  FileText,
  Vote,
  Shuffle,
} from "lucide-react"

// Mock tontine data
const mockTontine = {
  id: "1",
  name: "Famille Nguema",
  slogan: "Ensemble pour réussir",
  description: "Tontine familiale pour soutenir les projets de chaque membre.",
  contributionAmount: 500,
  frequency: "monthly",
  currentMembers: 12,
  maxMembers: 15,
  status: "active",
  currentCycle: 3,
  totalCycles: 12,
  nextContribution: new Date("2025-12-01"),
  startDate: new Date("2025-09-01"),
  bureau: {
    president: "Marie Nguema",
    secretary: "Jean-Baptiste Kamga",
    treasurer: "Aminata Diallo",
  },
  caisses: [
    { id: "1", name: "Caisse Principale", type: "main", balance: 6000 },
    { id: "2", name: "Épargne", type: "epargne", balance: 1500 },
    { id: "3", name: "Solidarité", type: "solidarite", balance: 800 },
  ],
  members: [
    { id: "1", name: "Marie Nguema", role: "president", status: "paid", avatar: "MN" },
    { id: "2", name: "Jean-Baptiste Kamga", role: "secretary", status: "paid", avatar: "JK" },
    { id: "3", name: "Aminata Diallo", role: "treasurer", status: "pending", avatar: "AD" },
    { id: "4", name: "Paul Biya", role: "member", status: "paid", avatar: "PB" },
    { id: "5", name: "Fatou Sow", role: "member", status: "late", avatar: "FS" },
  ],
  nextBeneficiary: "Paul Biya",
}

const frequencyLabels: Record<string, string> = {
  daily: "Quotidien",
  weekly: "Hebdomadaire",
  biweekly: "Bi-mensuel",
  monthly: "Mensuel",
  yearly: "Annuel",
}

const roleLabels: Record<string, string> = {
  president: "Président",
  secretary: "Secrétaire",
  treasurer: "Trésorier",
  censor: "Censeur",
  member: "Membre",
}

const statusColors: Record<string, string> = {
  paid: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  late: "bg-destructive/10 text-destructive",
}

export default function TontineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [activeTab, setActiveTab] = useState<"overview" | "members" | "caisses">("overview")
  const country = SUPPORTED_COUNTRIES[0]

  const totalCaisseBalance = mockTontine.caisses.reduce((sum, c) => sum + c.balance, 0)
  const daysUntilContribution = Math.ceil((mockTontine.nextContribution.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-6 pb-8 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/tontines/${id}/chat`}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-primary-foreground hover:bg-primary-foreground/20"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-primary-foreground hover:bg-primary-foreground/20"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Tontine Info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
            <span className="text-2xl font-bold">{mockTontine.name.slice(0, 2).toUpperCase()}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">{mockTontine.name}</h1>
            <p className="text-sm text-primary-foreground/70">{mockTontine.slogan}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="secondary"
                className="bg-primary-foreground/20 text-primary-foreground border-0 rounded-full"
              >
                Cycle {mockTontine.currentCycle}/{mockTontine.totalCycles}
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-3">
          <div className="flex-1 p-3 rounded-xl bg-primary-foreground/10">
            <p className="text-2xl font-bold">{mockTontine.currentMembers}</p>
            <p className="text-xs text-primary-foreground/70">Membres</p>
          </div>
          <div className="flex-1 p-3 rounded-xl bg-primary-foreground/10">
            <p className="text-2xl font-bold">{mockTontine.contributionAmount}</p>
            <p className="text-xs text-primary-foreground/70">Nkap/mois</p>
          </div>
          <div className="flex-1 p-3 rounded-xl bg-primary-foreground/10">
            <p className="text-2xl font-bold">{daysUntilContribution}</p>
            <p className="text-xs text-primary-foreground/70">Jours restants</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 -mt-4">
        <Card className="p-1 rounded-2xl">
          <div className="flex">
            {[
              { id: "overview", label: "Aperçu" },
              { id: "members", label: "Membres" },
              { id: "caisses", label: "Caisses" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === "overview" && (
          <>
            {/* Next Contribution Alert */}
            <Card className="p-4 rounded-2xl bg-warning/10 border-warning/20">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-warning" />
                <div className="flex-1">
                  <p className="font-medium">Prochaine cotisation</p>
                  <p className="text-sm text-muted-foreground">
                    {mockTontine.nextContribution.toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
                <Link href={`/dashboard/tontines/${id}/contribute`}>
                  <Button size="sm" className="rounded-full">
                    Cotiser
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Next Beneficiary */}
            <Card className="p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Prochain bénéficiaire</p>
                  <p className="font-semibold">{mockTontine.nextBeneficiary}</p>
                </div>
                <Link href={`/dashboard/tontines/${id}/draw`}>
                  <Button variant="outline" size="sm" className="rounded-full gap-1 bg-transparent">
                    <Shuffle className="w-4 h-4" />
                    Tirage
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Bureau */}
            <Card className="p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Bureau</h3>
                <Link href={`/dashboard/tontines/${id}/vote`}>
                  <Button variant="ghost" size="sm" className="rounded-full gap-1">
                    <Vote className="w-4 h-4" />
                    Élections
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {Object.entries(mockTontine.bureau).map(([role, name]) => (
                  <div key={role} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{name}</p>
                      <p className="text-xs text-muted-foreground">{roleLabels[role]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Link href={`/dashboard/tontines/${id}/rules`}>
                <Card className="p-4 rounded-2xl hover:shadow-md transition-shadow">
                  <FileText className="w-6 h-6 text-primary mb-2" />
                  <p className="font-medium text-sm">Règlement</p>
                </Card>
              </Link>
              <Link href={`/dashboard/tontines/${id}/calendar`}>
                <Card className="p-4 rounded-2xl hover:shadow-md transition-shadow">
                  <Calendar className="w-6 h-6 text-secondary-foreground mb-2" />
                  <p className="font-medium text-sm">Calendrier</p>
                </Card>
              </Link>
              <Link href={`/dashboard/tontines/${id}/reports`}>
                <Card className="p-4 rounded-2xl hover:shadow-md transition-shadow">
                  <FileText className="w-6 h-6 text-accent-foreground mb-2" />
                  <p className="font-medium text-sm">Rapports</p>
                </Card>
              </Link>
              <Link href={`/dashboard/tontines/${id}/settings`}>
                <Card className="p-4 rounded-2xl hover:shadow-md transition-shadow">
                  <Settings className="w-6 h-6 text-muted-foreground mb-2" />
                  <p className="font-medium text-sm">Paramètres</p>
                </Card>
              </Link>
            </div>
          </>
        )}

        {activeTab === "members" && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {mockTontine.currentMembers}/{mockTontine.maxMembers} membres
              </p>
              <Button variant="outline" size="sm" className="rounded-full gap-1 bg-transparent">
                <Users className="w-4 h-4" />
                Inviter
              </Button>
            </div>

            <Card className="rounded-2xl divide-y divide-border">
              {mockTontine.members.map((member) => (
                <Link
                  key={member.id}
                  href={`/dashboard/tontines/${id}/members/${member.id}`}
                  className="p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center relative">
                    <span className="font-medium text-primary">{member.avatar}</span>
                    {member.role !== "member" && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                        <Crown className="w-3 h-3 text-accent-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{roleLabels[member.role]}</p>
                  </div>
                  <Badge className={`${statusColors[member.status]} rounded-full`}>
                    {member.status === "paid" && <CheckCircle className="w-3 h-3 mr-1" />}
                    {member.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                    {member.status === "late" && <AlertCircle className="w-3 h-3 mr-1" />}
                    {member.status === "paid" ? "Payé" : member.status === "pending" ? "En attente" : "En retard"}
                  </Badge>
                </Link>
              ))}
            </Card>
          </>
        )}

        {activeTab === "caisses" && (
          <>
            {/* Total Balance */}
            <Card className="p-5 rounded-2xl bg-primary/5 border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Solde total des caisses</p>
              <p className="text-3xl font-bold text-primary">{totalCaisseBalance.toLocaleString()} Nkap</p>
              <p className="text-sm text-muted-foreground">
                ≈ {(totalCaisseBalance * country.nkapRate).toLocaleString()} {country.currencySymbol}
              </p>
            </Card>

            {/* Individual Caisses */}
            <div className="space-y-3">
              {mockTontine.caisses.map((caisse) => (
                <Link key={caisse.id} href={`/dashboard/tontines/${id}/caisses/${caisse.id}`}>
                  <Card className="p-4 rounded-2xl hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            caisse.type === "main"
                              ? "bg-primary/10"
                              : caisse.type === "epargne"
                                ? "bg-success/10"
                                : "bg-secondary/10"
                          }`}
                        >
                          <Wallet
                            className={`w-6 h-6 ${
                              caisse.type === "main"
                                ? "text-primary"
                                : caisse.type === "epargne"
                                  ? "text-success"
                                  : "text-secondary-foreground"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{caisse.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {((caisse.balance / totalCaisseBalance) * 100).toFixed(0)}% du total
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{caisse.balance.toLocaleString()} Nkap</p>
                        <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
