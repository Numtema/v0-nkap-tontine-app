"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SUPPORTED_COUNTRIES } from "@/lib/types"
import type { ReportData, SessionReport } from "@/lib/actions/reports"
import { exportTontineReport } from "@/lib/actions/reports"
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
  Loader2,
} from "lucide-react"

type ReportsPageClientProps = {
  tontineId: string
  tontineName: string
  initialStats: ReportData
  initialReports: SessionReport[]
}

export function ReportsPageClient({ tontineId, tontineName, initialStats, initialReports }: ReportsPageClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"overview" | "sessions" | "export">("overview")
  const [exporting, setExporting] = useState<string | null>(null)
  const country = SUPPORTED_COUNTRIES[0]

  const handleExport = async (format: "pdf" | "csv", type: string) => {
    setExporting(type)
    try {
      const result = await exportTontineReport(tontineId, format)
      if (result.success && result.url) {
        // In production, this would trigger a download
        alert(`Export ${format.toUpperCase()} prêt !`)
      }
    } catch (error) {
      console.error("Export error:", error)
    } finally {
      setExporting(null)
    }
  }

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
            <p className="text-sm text-primary-foreground/70">{tontineName}</p>
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
                <h3 className="font-semibold">Apercu financier</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total cotise</span>
                  <span className="font-semibold text-success">
                    +{initialStats.totalContributions.toLocaleString()} Nkap
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total distribue</span>
                  <span className="font-semibold text-destructive">
                    -{initialStats.totalDistributed.toLocaleString()} Nkap
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Solde actuel</span>
                  <span className="text-lg font-bold text-primary">
                    {initialStats.currentBalance.toLocaleString()} Nkap
                  </span>
                </div>
                <p className="text-sm text-muted-foreground text-right">
                  Environ {(initialStats.currentBalance * country.nkapRate).toLocaleString()} {country.currencySymbol}
                </p>
              </div>
            </Card>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-success mb-2" />
                <p className="text-2xl font-bold">{initialStats.contributionRate}%</p>
                <p className="text-sm text-muted-foreground">Taux de cotisation</p>
              </Card>
              <Card className="p-4 rounded-2xl">
                <Clock className="w-6 h-6 text-warning mb-2" />
                <p className="text-2xl font-bold">{initialStats.averageDelay}j</p>
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
                    <span className="text-sm text-success">A jour</span>
                  </div>
                  <p className="text-2xl font-bold">{initialStats.membersOnTime}</p>
                </div>
                <div className="flex-1 p-3 rounded-xl bg-destructive/10">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <span className="text-sm text-destructive">En retard</span>
                  </div>
                  <p className="text-2xl font-bold">{initialStats.membersLate}</p>
                </div>
              </div>
            </Card>
          </>
        )}

        {activeTab === "sessions" && (
          <>
            {initialReports.length === 0 ? (
              <Card className="p-8 rounded-2xl text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun rapport de session disponible</p>
                <p className="text-sm text-muted-foreground mt-1">Les rapports apparaitront apres le premier tirage</p>
              </Card>
            ) : (
              <Card className="rounded-2xl divide-y divide-border">
                {initialReports.map((report) => (
                  <button
                    key={report.id}
                    className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{report.title}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(report.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      {report.beneficiary_name && (
                        <p className="text-sm text-primary mt-1">Beneficiaire: {report.beneficiary_name}</p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                ))}
              </Card>
            )}
          </>
        )}

        {activeTab === "export" && (
          <>
            <Card className="p-5 rounded-2xl">
              <h3 className="font-semibold mb-4">Exporter les donnees</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-14 rounded-xl justify-between bg-transparent"
                  onClick={() => handleExport("pdf", "full")}
                  disabled={exporting !== null}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-destructive" />
                    <span>Rapport complet (PDF)</span>
                  </div>
                  {exporting === "full" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-14 rounded-xl justify-between bg-transparent"
                  onClick={() => handleExport("csv", "transactions")}
                  disabled={exporting !== null}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-success" />
                    <span>Transactions (CSV)</span>
                  </div>
                  {exporting === "transactions" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-14 rounded-xl justify-between bg-transparent"
                  onClick={() => handleExport("pdf", "members")}
                  disabled={exporting !== null}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <span>Liste des membres (PDF)</span>
                  </div>
                  {exporting === "members" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </Card>

            <Card className="p-4 rounded-2xl bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Les rapports generes incluent toutes les donnees de la tontine depuis sa creation. Vous pouvez les
                partager avec les membres du bureau.
              </p>
            </Card>
          </>
        )}
      </div>
    </main>
  )
}
