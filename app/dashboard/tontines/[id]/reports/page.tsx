"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SUPPORTED_COUNTRIES } from "@/lib/types"
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  PieChart,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react"

const mockReports = [
  {
    id: "1",
    type: "session",
    title: "Rapport Session #3",
    date: new Date("2025-11-01"),
    status: "completed",
  },
  {
    id: "2",
    type: "session",
    title: "Rapport Session #2",
    date: new Date("2025-10-01"),
    status: "completed",
  },
  {
    id: "3",
    type: "financial",
    title: "Bilan Financier Q4 2025",
    date: new Date("2025-10-15"),
    status: "completed",
  },
  {
    id: "4",
    type: "session",
    title: "Rapport Session #1",
    date: new Date("2025-09-01"),
    status: "completed",
  },
]

const mockStats = {
  totalContributions: 45000,
  totalDistributed: 36000,
  currentBalance: 9000,
  contributionRate: 94,
  averageDelay: 1.2,
  membersOnTime: 10,
  membersLate: 2,
}

export default function ReportsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [activeTab, setActiveTab] = useState<"overview" | "sessions" | "export">("overview")
  const country = SUPPORTED_COUNTRIES[0]

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-6 rounded-b-[2rem]">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Rapports & Analyses</h1>
            <p className="text-sm text-primary-foreground/70">Famille Nguema</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 -mt-4 mb-4">
        <Card className="p-1 rounded-2xl">
          <div className="flex">
            {[
              { id: "overview", label: "Vue d'ensemble" },
              { id: "sessions", label: "Sessions" },
              { id: "export", label: "Exporter" },
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
            {/* Financial Overview */}
            <Card className="p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Aperçu financier</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total cotisé</span>
                  <span className="font-semibold text-success">
                    +{mockStats.totalContributions.toLocaleString()} Nkap
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total distribué</span>
                  <span className="font-semibold text-destructive">
                    -{mockStats.totalDistributed.toLocaleString()} Nkap
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Solde actuel</span>
                  <span className="text-lg font-bold text-primary">
                    {mockStats.currentBalance.toLocaleString()} Nkap
                  </span>
                </div>
                <p className="text-sm text-muted-foreground text-right">
                  ≈ {(mockStats.currentBalance * country.nkapRate).toLocaleString()} {country.currencySymbol}
                </p>
              </div>
            </Card>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-success mb-2" />
                <p className="text-2xl font-bold">{mockStats.contributionRate}%</p>
                <p className="text-sm text-muted-foreground">Taux de cotisation</p>
              </Card>
              <Card className="p-4 rounded-2xl">
                <Clock className="w-6 h-6 text-warning mb-2" />
                <p className="text-2xl font-bold">{mockStats.averageDelay}j</p>
                <p className="text-sm text-muted-foreground">Retard moyen</p>
              </Card>
            </div>

            {/* Member Performance */}
            <Card className="p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Performance membres</h3>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 p-3 rounded-xl bg-success/10">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-success">À jour</span>
                  </div>
                  <p className="text-2xl font-bold">{mockStats.membersOnTime}</p>
                </div>
                <div className="flex-1 p-3 rounded-xl bg-destructive/10">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <span className="text-sm text-destructive">En retard</span>
                  </div>
                  <p className="text-2xl font-bold">{mockStats.membersLate}</p>
                </div>
              </div>
            </Card>
          </>
        )}

        {activeTab === "sessions" && (
          <>
            <Card className="rounded-2xl divide-y divide-border">
              {mockReports.map((report) => (
                <button
                  key={report.id}
                  className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      report.type === "session" ? "bg-primary/10" : "bg-accent/10"
                    }`}
                  >
                    <FileText
                      className={`w-6 h-6 ${report.type === "session" ? "text-primary" : "text-accent-foreground"}`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{report.title}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {report.date.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </Card>
          </>
        )}

        {activeTab === "export" && (
          <>
            <Card className="p-5 rounded-2xl">
              <h3 className="font-semibold mb-4">Exporter les données</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full h-14 rounded-xl justify-between bg-transparent">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-destructive" />
                    <span>Rapport complet (PDF)</span>
                  </div>
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="w-full h-14 rounded-xl justify-between bg-transparent">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-success" />
                    <span>Transactions (CSV)</span>
                  </div>
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="w-full h-14 rounded-xl justify-between bg-transparent">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <span>Liste des membres (PDF)</span>
                  </div>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            <Card className="p-4 rounded-2xl bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Les rapports générés incluent toutes les données de la tontine depuis sa création. Vous pouvez les
                partager avec les membres du bureau.
              </p>
            </Card>
          </>
        )}
      </div>
    </main>
  )
}
