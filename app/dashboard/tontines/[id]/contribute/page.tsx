"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { SUPPORTED_COUNTRIES } from "@/lib/types"
import { ArrowLeft, Wallet, Check, ChevronRight, Info } from "lucide-react"

const mockCaisses = [
  { id: "1", name: "Caisse Principale", amount: 500, required: true },
  { id: "2", name: "Épargne", amount: 100, required: false },
  { id: "3", name: "Solidarité", amount: 50, required: false },
]

export default function ContributePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [step, setStep] = useState(1)
  const [selectedCaisses, setSelectedCaisses] = useState<string[]>(["1"])
  const [isLoading, setIsLoading] = useState(false)
  const [pin, setPin] = useState("")

  const country = SUPPORTED_COUNTRIES[0]
  const walletBalance = 10000 // Mock wallet balance

  const totalAmount = mockCaisses.filter((c) => selectedCaisses.includes(c.id)).reduce((sum, c) => sum + c.amount, 0)

  const toggleCaisse = (id: string) => {
    const caisse = mockCaisses.find((c) => c.id === id)
    if (caisse?.required) return

    setSelectedCaisses((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    router.push(`/dashboard/tontines/${id}?success=contribution`)
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex items-center gap-4 sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => (step === 1 ? router.back() : setStep(1))}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-semibold text-lg">Cotiser</h1>
          <p className="text-sm text-muted-foreground">Famille Nguema</p>
        </div>
      </header>

      {/* Wallet Balance */}
      <div className="p-4 bg-primary/5 border-b border-primary/10">
        <div className="flex items-center gap-3">
          <Wallet className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Solde disponible</p>
            <p className="font-semibold">{walletBalance.toLocaleString()} Nkap</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {step === 1 && (
          <>
            <p className="text-sm text-muted-foreground">Sélectionnez les caisses pour votre cotisation</p>

            <div className="space-y-3">
              {mockCaisses.map((caisse) => (
                <Card
                  key={caisse.id}
                  className={`p-4 rounded-2xl cursor-pointer transition-all ${
                    selectedCaisses.includes(caisse.id)
                      ? "border-primary bg-primary/5"
                      : caisse.required
                        ? "border-primary/50 bg-primary/5 cursor-not-allowed"
                        : "hover:border-muted-foreground"
                  }`}
                  onClick={() => toggleCaisse(caisse.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{caisse.name}</h3>
                        {caisse.required && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                            Obligatoire
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{caisse.amount} Nkap</p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedCaisses.includes(caisse.id) ? "border-primary bg-primary" : "border-border"
                      }`}
                    >
                      {selectedCaisses.includes(caisse.id) && <Check className="w-4 h-4 text-primary-foreground" />}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Info */}
            <Card className="p-4 rounded-2xl bg-muted/50 flex gap-3">
              <Info className="w-5 h-5 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground">
                La cotisation principale est obligatoire. Les caisses optionnelles peuvent être ajoutées selon vos
                moyens.
              </p>
            </Card>
          </>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {/* Summary */}
            <Card className="p-5 rounded-2xl">
              <h3 className="font-semibold mb-4">Résumé de la cotisation</h3>
              <dl className="space-y-3">
                {mockCaisses
                  .filter((c) => selectedCaisses.includes(c.id))
                  .map((caisse) => (
                    <div key={caisse.id} className="flex justify-between text-sm">
                      <dt className="text-muted-foreground">{caisse.name}</dt>
                      <dd className="font-medium">{caisse.amount} Nkap</dd>
                    </div>
                  ))}
                <div className="flex justify-between pt-3 border-t border-border">
                  <dt className="font-medium">Total</dt>
                  <dd className="font-bold text-primary">{totalAmount} Nkap</dd>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <dt>Équivalent</dt>
                  <dd>
                    {(totalAmount * country.nkapRate).toLocaleString()} {country.currencySymbol}
                  </dd>
                </div>
              </dl>
            </Card>

            {/* PIN Input */}
            <div className="space-y-2">
              <Label htmlFor="pin">Code PIN de sécurité</Label>
              <Input
                id="pin"
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                className="h-14 rounded-2xl text-center text-2xl tracking-widest"
              />
            </div>

            {/* Balance after */}
            <Card className="p-4 rounded-2xl bg-muted/50">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Solde actuel</span>
                <span>{walletBalance.toLocaleString()} Nkap</span>
              </div>
              <div className="flex justify-between text-sm text-destructive mt-1">
                <span>Cotisation</span>
                <span>-{totalAmount} Nkap</span>
              </div>
              <div className="flex justify-between font-medium mt-2 pt-2 border-t border-border">
                <span>Nouveau solde</span>
                <span>{(walletBalance - totalAmount).toLocaleString()} Nkap</span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="p-4 bg-card border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground">Total à payer</span>
          <span className="text-xl font-bold text-primary">{totalAmount} Nkap</span>
        </div>
        <Button
          onClick={step === 1 ? () => setStep(2) : handleConfirm}
          disabled={isLoading || (step === 2 && pin.length < 4)}
          className="w-full h-14 rounded-xl text-lg font-semibold gap-2"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>
              {step === 1 ? "Continuer" : "Confirmer le paiement"}
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </footer>
    </main>
  )
}
