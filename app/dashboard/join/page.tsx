"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowLeft, QrCode, Search, Users, Clock, CheckCircle } from "lucide-react"

export default function JoinTontinePage() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [foundTontine, setFoundTontine] = useState<any>(null)

  const handleSearch = async () => {
    if (!code.trim()) return
    setIsSearching(true)

    // Simulate search
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setFoundTontine({
      id: "found-1",
      name: "Association Camerounaise",
      slogan: "La solidarité avant tout",
      contributionAmount: 500,
      frequency: "monthly",
      currentMembers: 15,
      maxMembers: 20,
      membershipFee: 100,
    })
    setIsSearching(false)
  }

  const handleJoin = async () => {
    // Simulate join request
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/dashboard/tontines")
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex items-center gap-4 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-semibold text-lg">Rejoindre une tontine</h1>
      </header>

      <div className="p-4 space-y-6">
        {/* Code Input */}
        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Entrez le code d'invitation"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="h-14 rounded-2xl text-base text-center tracking-widest font-mono uppercase pr-12"
              maxLength={8}
            />
            <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full">
              <QrCode className="w-5 h-5" />
            </Button>
          </div>

          <Button
            onClick={handleSearch}
            disabled={!code.trim() || isSearching}
            className="w-full h-12 rounded-xl gap-2"
          >
            {isSearching ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                Rechercher
              </>
            )}
          </Button>
        </div>

        {/* Or divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">ou</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Scan QR */}
        <Button variant="outline" className="w-full h-14 rounded-2xl gap-2 bg-transparent">
          <QrCode className="w-5 h-5" />
          Scanner un code QR
        </Button>

        {/* Found Tontine */}
        {foundTontine && (
          <Card className="p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{foundTontine.name}</h3>
                <p className="text-sm text-muted-foreground">{foundTontine.slogan}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted rounded-xl">
                <p className="text-xs text-muted-foreground">Cotisation</p>
                <p className="font-semibold">{foundTontine.contributionAmount} Nkap/mois</p>
              </div>
              <div className="p-3 bg-muted rounded-xl">
                <p className="text-xs text-muted-foreground">Membres</p>
                <p className="font-semibold">
                  {foundTontine.currentMembers}/{foundTontine.maxMembers}
                </p>
              </div>
            </div>

            {foundTontine.membershipFee > 0 && (
              <div className="p-3 bg-accent/10 rounded-xl flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent-foreground" />
                <span className="text-sm">
                  Frais d'adhésion: <strong>{foundTontine.membershipFee} Nkap</strong>
                </span>
              </div>
            )}

            <Button onClick={handleJoin} className="w-full h-12 rounded-xl gap-2">
              <CheckCircle className="w-4 h-4" />
              Demander à rejoindre
            </Button>
          </Card>
        )}

        {/* Help text */}
        <p className="text-center text-sm text-muted-foreground">
          Demandez le code d'invitation à l'administrateur de la tontine que vous souhaitez rejoindre
        </p>
      </div>
    </main>
  )
}
