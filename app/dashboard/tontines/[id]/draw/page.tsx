"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Shuffle, Play, Crown, Check, Users, RefreshCw } from "lucide-react"

type DrawPhase = "pending" | "confirming" | "drawing" | "completed"

const mockMembers = [
  { id: "1", name: "Marie Nguema", avatar: "MN", hasConfirmed: true },
  { id: "2", name: "Jean-Baptiste Kamga", avatar: "JK", hasConfirmed: true },
  { id: "3", name: "Aminata Diallo", avatar: "AD", hasConfirmed: false },
  { id: "4", name: "Paul Biya", avatar: "PB", hasConfirmed: true },
  { id: "5", name: "Fatou Sow", avatar: "FS", hasConfirmed: false },
  { id: "6", name: "Kofi Mensah", avatar: "KM", hasConfirmed: true },
]

const mockDrawResults = [
  { order: 1, member: mockMembers[3] }, // Paul Biya
  { order: 2, member: mockMembers[0] }, // Marie Nguema
  { order: 3, member: mockMembers[1] }, // Jean-Baptiste Kamga
  { order: 4, member: mockMembers[5] }, // Kofi Mensah
  { order: 5, member: mockMembers[2] }, // Aminata Diallo
  { order: 6, member: mockMembers[4] }, // Fatou Sow
]

export default function DrawPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [phase, setPhase] = useState<DrawPhase>("confirming")
  const [hasConfirmed, setHasConfirmed] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawResults, setDrawResults] = useState<typeof mockDrawResults | null>(null)
  const [currentDrawIndex, setCurrentDrawIndex] = useState(-1)

  const confirmedCount = mockMembers.filter((m) => m.hasConfirmed).length
  const requiredConfirmations = Math.ceil(mockMembers.length * 0.67) // 2/3 quorum

  const handleConfirm = () => {
    setHasConfirmed(true)
  }

  const handleStartDraw = async () => {
    setPhase("drawing")
    setIsDrawing(true)

    // Animate the draw
    for (let i = 0; i < mockDrawResults.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setCurrentDrawIndex(i)
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
    setDrawResults(mockDrawResults)
    setPhase("completed")
    setIsDrawing(false)
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-6 pb-8 rounded-b-[2rem]">
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
            <h1 className="text-xl font-bold">Tirage au Sort</h1>
            <p className="text-sm text-primary-foreground/70">Famille Nguema</p>
          </div>
        </div>

        {/* Status Card */}
        <Card className="p-4 rounded-2xl bg-primary-foreground/10 border-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shuffle className="w-5 h-5" />
              <span className="font-medium">
                {phase === "confirming"
                  ? "Confirmation en attente"
                  : phase === "drawing"
                    ? "Tirage en cours..."
                    : "Tirage terminé"}
              </span>
            </div>
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 rounded-full">
              {confirmedCount}/{mockMembers.length} confirmés
            </Badge>
          </div>
          <p className="text-xs text-primary-foreground/70">
            {phase === "confirming"
              ? `${requiredConfirmations} confirmations nécessaires (quorum 2/3)`
              : phase === "completed"
                ? "L'ordre des bénéficiaires a été déterminé"
                : "Veuillez patienter..."}
          </p>
        </Card>
      </header>

      <div className="p-4 space-y-6">
        {/* Confirmation Phase */}
        {phase === "confirming" && (
          <>
            {/* My Confirmation */}
            {!hasConfirmed ? (
              <Card className="p-5 rounded-2xl bg-accent/10 border-accent/20">
                <h3 className="font-semibold mb-2">Confirmer votre participation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  En confirmant, vous acceptez que l'ordre des bénéficiaires soit déterminé par tirage au sort.
                </p>
                <Button onClick={handleConfirm} className="w-full h-12 rounded-xl gap-2">
                  <Check className="w-4 h-4" />
                  Je confirme ma participation
                </Button>
              </Card>
            ) : (
              <Card className="p-4 rounded-2xl bg-success/10 border-success/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-success">Participation confirmée</p>
                    <p className="text-sm text-muted-foreground">En attente des autres membres</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Members Status */}
            <section>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Confirmations des membres
              </h3>
              <Card className="rounded-2xl divide-y divide-border">
                {mockMembers.map((member) => (
                  <div key={member.id} className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{member.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{member.name}</p>
                    </div>
                    {member.hasConfirmed ? (
                      <Badge className="bg-success/10 text-success rounded-full gap-1">
                        <Check className="w-3 h-3" />
                        Confirmé
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="rounded-full">
                        En attente
                      </Badge>
                    )}
                  </div>
                ))}
              </Card>
            </section>

            {/* Start Draw Button */}
            {confirmedCount >= requiredConfirmations && (
              <Button onClick={handleStartDraw} className="w-full h-14 rounded-xl text-lg font-semibold gap-2">
                <Play className="w-5 h-5" />
                Lancer le tirage
              </Button>
            )}
          </>
        )}

        {/* Drawing Phase */}
        {phase === "drawing" && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <RefreshCw className="w-12 h-12 text-primary animate-spin" />
            </div>
            <h3 className="text-xl font-bold mb-2">Tirage en cours...</h3>
            <p className="text-muted-foreground">Détermination de l'ordre des bénéficiaires</p>

            {/* Progress */}
            <div className="mt-8 space-y-2">
              {mockDrawResults.slice(0, currentDrawIndex + 1).map((result, index) => (
                <Card
                  key={result.order}
                  className="p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {result.order}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">{result.member.avatar}</span>
                  </div>
                  <span className="font-medium">{result.member.name}</span>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Completed Phase */}
        {phase === "completed" && drawResults && (
          <>
            <Card className="p-4 rounded-2xl bg-success/10 border-success/20 text-center">
              <Crown className="w-8 h-8 text-success mx-auto mb-2" />
              <h3 className="font-semibold text-success">Tirage terminé !</h3>
              <p className="text-sm text-muted-foreground">L'ordre des bénéficiaires a été établi</p>
            </Card>

            <section>
              <h3 className="font-semibold mb-3">Ordre des bénéficiaires</h3>
              <Card className="rounded-2xl divide-y divide-border">
                {drawResults.map((result) => (
                  <div key={result.order} className="p-4 flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        result.order === 1 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {result.order}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-medium text-primary">{result.member.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{result.member.name}</p>
                      {result.order === 1 && <p className="text-xs text-accent-foreground">Premier bénéficiaire</p>}
                    </div>
                    {result.order === 1 && <Crown className="w-5 h-5 text-accent-foreground" />}
                  </div>
                ))}
              </Card>
            </section>

            <Button onClick={() => router.push(`/dashboard/tontines/${id}`)} className="w-full h-12 rounded-xl">
              Retour à la tontine
            </Button>
          </>
        )}
      </div>
    </main>
  )
}
