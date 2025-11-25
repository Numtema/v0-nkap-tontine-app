"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, FileText, Download, Check } from "lucide-react"

const mockRules = {
  general: [
    "Chaque membre doit cotiser le montant fixé à la date convenue.",
    "Les retards de paiement sont pénalisés à hauteur de 10% du montant dû.",
    "Toute absence non justifiée à une réunion entraîne une amende de 50 Nkap.",
    "Le tirage au sort détermine l'ordre des bénéficiaires pour le premier cycle.",
  ],
  meetings: [
    "Les réunions se tiennent le premier samedi de chaque mois à 15h.",
    "Un quorum de 2/3 des membres est requis pour les décisions importantes.",
    "Les décisions sont prises à la majorité simple des présents.",
  ],
  bureau: [
    "Le bureau est élu pour un mandat d'un an.",
    "Le président préside les réunions et représente la tontine.",
    "Le trésorier gère les fonds et tient les comptes à jour.",
    "Le secrétaire rédige les procès-verbaux des réunions.",
  ],
  sanctions: [
    "Trois retards consécutifs entraînent une suspension temporaire.",
    "Le non-paiement après 30 jours entraîne l'exclusion.",
    "L'exclusion ne dispense pas du paiement des dettes.",
  ],
}

export default function RulesPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex items-center gap-4 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-semibold text-lg">Règlement Intérieur</h1>
          <p className="text-sm text-muted-foreground">Famille Nguema</p>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Download className="w-5 h-5" />
        </Button>
      </header>

      <div className="p-4 space-y-6">
        {/* General Rules */}
        <section>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Règles générales
          </h2>
          <Card className="rounded-2xl divide-y divide-border">
            {mockRules.general.map((rule, index) => (
              <div key={index} className="p-4 flex gap-3">
                <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <p className="text-sm">{rule}</p>
              </div>
            ))}
          </Card>
        </section>

        {/* Meeting Rules */}
        <section>
          <h2 className="font-semibold mb-3">Réunions</h2>
          <Card className="rounded-2xl divide-y divide-border">
            {mockRules.meetings.map((rule, index) => (
              <div key={index} className="p-4 flex gap-3">
                <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <p className="text-sm">{rule}</p>
              </div>
            ))}
          </Card>
        </section>

        {/* Bureau Rules */}
        <section>
          <h2 className="font-semibold mb-3">Bureau</h2>
          <Card className="rounded-2xl divide-y divide-border">
            {mockRules.bureau.map((rule, index) => (
              <div key={index} className="p-4 flex gap-3">
                <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <p className="text-sm">{rule}</p>
              </div>
            ))}
          </Card>
        </section>

        {/* Sanctions */}
        <section>
          <h2 className="font-semibold mb-3 text-destructive">Sanctions</h2>
          <Card className="rounded-2xl divide-y divide-border border-destructive/20">
            {mockRules.sanctions.map((rule, index) => (
              <div key={index} className="p-4 flex gap-3">
                <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-destructive">{index + 1}</span>
                </div>
                <p className="text-sm">{rule}</p>
              </div>
            ))}
          </Card>
        </section>

        {/* Agreement */}
        <Card className="p-4 rounded-2xl bg-primary/5 border-primary/20">
          <p className="text-sm text-muted-foreground mb-3">
            En participant à cette tontine, vous acceptez de respecter ce règlement intérieur.
          </p>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-success" />
            <span className="text-sm font-medium">Vous avez accepté le 15 septembre 2025</span>
          </div>
        </Card>
      </div>
    </main>
  )
}
