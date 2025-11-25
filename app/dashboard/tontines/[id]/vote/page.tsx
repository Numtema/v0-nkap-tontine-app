"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Vote, Crown, Users, Check, Clock, Trophy, ChevronRight } from "lucide-react"

type VotePhase = "not_started" | "nominating" | "voting" | "results"

const mockCandidates = {
  president: [
    { id: "1", name: "Marie Nguema", avatar: "MN", votes: 8, isCurrentUser: false },
    { id: "2", name: "Jean-Baptiste Kamga", avatar: "JK", votes: 4, isCurrentUser: false },
  ],
  secretary: [
    { id: "3", name: "Aminata Diallo", avatar: "AD", votes: 7, isCurrentUser: false },
    { id: "4", name: "Paul Biya", avatar: "PB", votes: 5, isCurrentUser: false },
  ],
  treasurer: [
    { id: "5", name: "Fatou Sow", avatar: "FS", votes: 10, isCurrentUser: false },
    { id: "2", name: "Jean-Baptiste Kamga", avatar: "JK", votes: 2, isCurrentUser: false },
  ],
}

const roleLabels: Record<string, string> = {
  president: "Président(e)",
  secretary: "Secrétaire",
  treasurer: "Trésorier(ère)",
}

const roleIcons: Record<string, typeof Crown> = {
  president: Crown,
  secretary: Users,
  treasurer: Vote,
}

export default function VotePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [phase, setPhase] = useState<VotePhase>("voting")
  const [selectedVotes, setSelectedVotes] = useState<Record<string, string>>({})
  const [hasVoted, setHasVoted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalMembers = 12
  const votedMembers = 8
  const votingDeadline = new Date("2025-12-01")

  const handleVote = (role: string, candidateId: string) => {
    if (hasVoted) return
    setSelectedVotes((prev) => ({ ...prev, [role]: candidateId }))
  }

  const handleSubmitVotes = async () => {
    if (Object.keys(selectedVotes).length < 3) return
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setHasVoted(true)
    setIsSubmitting(false)
  }

  const getWinner = (role: string) => {
    const candidates = mockCandidates[role as keyof typeof mockCandidates]
    return candidates.reduce((prev, curr) => (curr.votes > prev.votes ? curr : prev))
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
            <h1 className="text-xl font-bold">Élections du Bureau</h1>
            <p className="text-sm text-primary-foreground/70">Famille Nguema</p>
          </div>
        </div>

        {/* Voting Status */}
        <Card className="p-4 rounded-2xl bg-primary-foreground/10 border-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Vote className="w-5 h-5" />
              <span className="font-medium">
                {phase === "voting" ? "Vote en cours" : phase === "results" ? "Résultats" : "En attente"}
              </span>
            </div>
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 rounded-full">
              {votedMembers}/{totalMembers} ont voté
            </Badge>
          </div>
          <div className="w-full bg-primary-foreground/20 rounded-full h-2">
            <div
              className="bg-primary-foreground h-2 rounded-full transition-all"
              style={{ width: `${(votedMembers / totalMembers) * 100}%` }}
            />
          </div>
          <p className="text-xs text-primary-foreground/70 mt-2 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Fin du vote:{" "}
            {votingDeadline.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </Card>
      </header>

      <div className="p-4 space-y-6">
        {/* Instructions */}
        {phase === "voting" && !hasVoted && (
          <Card className="p-4 rounded-2xl bg-accent/10 border-accent/20">
            <p className="text-sm">
              Votez pour un candidat pour chaque poste du bureau. Votre vote est confidentiel et ne peut être modifié
              après soumission.
            </p>
          </Card>
        )}

        {/* Success Message */}
        {hasVoted && (
          <Card className="p-4 rounded-2xl bg-success/10 border-success/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-success">Vote enregistré</p>
                <p className="text-sm text-muted-foreground">
                  Les résultats seront annoncés le{" "}
                  {votingDeadline.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Voting Cards */}
        {Object.entries(mockCandidates).map(([role, candidates]) => {
          const RoleIcon = roleIcons[role]
          const winner = phase === "results" ? getWinner(role) : null

          return (
            <section key={role}>
              <div className="flex items-center gap-2 mb-3">
                <RoleIcon className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">{roleLabels[role]}</h2>
              </div>

              <div className="space-y-2">
                {candidates.map((candidate) => {
                  const isSelected = selectedVotes[role] === candidate.id
                  const isWinner = winner?.id === candidate.id

                  return (
                    <Card
                      key={candidate.id}
                      className={`p-4 rounded-2xl transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : isWinner
                            ? "border-success bg-success/5"
                            : "hover:border-muted-foreground"
                      } ${hasVoted && !isWinner ? "opacity-60" : ""}`}
                      onClick={() => handleVote(role, candidate.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isWinner ? "bg-success/20" : "bg-primary/10"
                          }`}
                        >
                          <span className={`font-medium ${isWinner ? "text-success" : "text-primary"}`}>
                            {candidate.avatar}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{candidate.name}</p>
                          {(phase === "results" || hasVoted) && (
                            <p className="text-sm text-muted-foreground">{candidate.votes} votes</p>
                          )}
                        </div>
                        {isWinner && (
                          <Badge className="bg-success/10 text-success rounded-full gap-1">
                            <Trophy className="w-3 h-3" />
                            Élu(e)
                          </Badge>
                        )}
                        {!hasVoted && phase === "voting" && (
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? "border-primary bg-primary" : "border-border"
                            }`}
                          >
                            {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
                          </div>
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      {/* Footer */}
      {phase === "voting" && !hasVoted && (
        <footer className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
          <Button
            onClick={handleSubmitVotes}
            disabled={Object.keys(selectedVotes).length < 3 || isSubmitting}
            className="w-full h-14 rounded-xl text-lg font-semibold gap-2"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                Soumettre mon vote
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </footer>
      )}
    </main>
  )
}
