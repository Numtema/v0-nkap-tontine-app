"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, UserPlus, Check, X, Clock, Star, Shield } from "lucide-react"

const mockRequests = [
  {
    id: "1",
    name: "Amadou Ba",
    avatar: "AB",
    phone: "+221 77 123 4567",
    requestDate: new Date("2025-11-20"),
    status: "pending",
    referredBy: "Marie Nguema",
    reputationScore: 4.8,
  },
  {
    id: "2",
    name: "Grace Okonkwo",
    avatar: "GO",
    phone: "+234 80 987 6543",
    requestDate: new Date("2025-11-18"),
    status: "pending",
    referredBy: null,
    reputationScore: 0,
  },
  {
    id: "3",
    name: "Moussa Diop",
    avatar: "MD",
    phone: "+221 76 555 1234",
    requestDate: new Date("2025-11-15"),
    status: "approved",
    referredBy: "Jean-Baptiste Kamga",
    reputationScore: 4.5,
  },
]

export default function InvitationsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [requests, setRequests] = useState(mockRequests)
  const [processingId, setProcessingId] = useState<string | null>(null)

  const pendingRequests = requests.filter((r) => r.status === "pending")
  const processedRequests = requests.filter((r) => r.status !== "pending")

  const handleApprove = async (requestId: string) => {
    setProcessingId(requestId)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: "approved" } : r)))
    setProcessingId(null)
  }

  const handleReject = async (requestId: string) => {
    setProcessingId(requestId)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: "rejected" } : r)))
    setProcessingId(null)
  }

  return (
    <main className="min-h-screen bg-background pb-6">
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
            <h1 className="text-xl font-bold">Demandes d'adhésion</h1>
            <p className="text-sm text-primary-foreground/70">Famille Nguema</p>
          </div>
          <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 rounded-full">
            {pendingRequests.length} en attente
          </Badge>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <section>
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
              En attente ({pendingRequests.length})
            </h2>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <Card key={request.id} className="p-4 rounded-2xl">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">{request.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{request.name}</h3>
                      <p className="text-sm text-muted-foreground">{request.phone}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Demande le{" "}
                        {request.requestDate.toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Info badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {request.referredBy && (
                      <Badge variant="secondary" className="rounded-full gap-1">
                        <Shield className="w-3 h-3" />
                        Référé par {request.referredBy}
                      </Badge>
                    )}
                    {request.reputationScore > 0 && (
                      <Badge variant="secondary" className="rounded-full gap-1 bg-accent/10 text-accent-foreground">
                        <Star className="w-3 h-3" />
                        {request.reputationScore}/5
                      </Badge>
                    )}
                    {!request.referredBy && request.reputationScore === 0 && (
                      <Badge variant="secondary" className="rounded-full">
                        Nouveau membre
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleReject(request.id)}
                      disabled={processingId === request.id}
                      className="flex-1 h-11 rounded-xl gap-1 bg-transparent text-destructive border-destructive/30 hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                      Refuser
                    </Button>
                    <Button
                      onClick={() => handleApprove(request.id)}
                      disabled={processingId === request.id}
                      className="flex-1 h-11 rounded-xl gap-1"
                    >
                      {processingId === request.id ? (
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Accepter
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* No Pending Requests */}
        {pendingRequests.length === 0 && (
          <Card className="p-8 rounded-2xl text-center">
            <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Aucune demande en attente</h3>
            <p className="text-sm text-muted-foreground">Les nouvelles demandes d'adhésion apparaîtront ici</p>
          </Card>
        )}

        {/* Processed Requests */}
        {processedRequests.length > 0 && (
          <section>
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-success" />
              Traitées
            </h2>
            <Card className="rounded-2xl divide-y divide-border">
              {processedRequests.map((request) => (
                <div key={request.id} className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium text-muted-foreground">{request.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{request.name}</p>
                    <p className="text-xs text-muted-foreground">{request.requestDate.toLocaleDateString("fr-FR")}</p>
                  </div>
                  <Badge
                    className={`rounded-full ${
                      request.status === "approved"
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {request.status === "approved" ? "Acceptée" : "Refusée"}
                  </Badge>
                </div>
              ))}
            </Card>
          </section>
        )}
      </div>
    </main>
  )
}
