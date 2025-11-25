"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { SUPPORTED_COUNTRIES } from "@/lib/types"
import { ArrowLeft, Smartphone, CreditCard, Building2, Bitcoin, Check, ChevronRight } from "lucide-react"

const paymentMethods = [
  {
    id: "mobile",
    name: "Mobile Money",
    icon: Smartphone,
    options: [
      { id: "mtn", name: "MTN Mobile Money", logo: "/mtn-logo-yellow.jpg" },
      { id: "orange", name: "Orange Money", logo: "/orange-money-logo.jpg" },
      { id: "wave", name: "Wave", logo: "/wave-mobile-money-logo.jpg" },
    ],
  },
  {
    id: "card",
    name: "Carte bancaire",
    icon: CreditCard,
    options: [
      { id: "visa", name: "Visa", logo: "/visa-card-logo.jpg" },
      { id: "mastercard", name: "Mastercard", logo: "/mastercard-logo.png" },
    ],
  },
  {
    id: "bank",
    name: "Virement bancaire",
    icon: Building2,
    options: [],
  },
  {
    id: "crypto",
    name: "Crypto-monnaie",
    icon: Bitcoin,
    options: [
      { id: "usdt", name: "USDT (Tether)", logo: "/usdt-tether-logo.jpg" },
      { id: "celo", name: "Celo", logo: "/celo-crypto-logo.jpg" },
    ],
  },
]

const quickAmounts = [500, 1000, 2500, 5000, 10000]

export default function TopUpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialMethod = searchParams.get("method") || "mobile"

  const [step, setStep] = useState(1)
  const [selectedMethod, setSelectedMethod] = useState(initialMethod)
  const [selectedOption, setSelectedOption] = useState("")
  const [amount, setAmount] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const country = SUPPORTED_COUNTRIES[0]
  const nkapAmount = Number.parseInt(amount) || 0
  const localAmount = nkapAmount * country.nkapRate
  const fee = Math.ceil(nkapAmount * 0.015) // 1.5% fee

  const currentMethod = paymentMethods.find((m) => m.id === selectedMethod)

  const handleContinue = () => {
    if (step === 1 && currentMethod?.options.length) {
      setStep(2)
    } else if (step === 2 || !currentMethod?.options.length) {
      setStep(3)
    } else {
      handleConfirm()
    }
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    router.push("/dashboard/wallet?success=topup")
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex items-center gap-4 sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => (step === 1 ? router.back() : setStep(step - 1))}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-semibold text-lg">Recharger</h1>
          <p className="text-sm text-muted-foreground">
            {step === 1 && "Choisissez un moyen de paiement"}
            {step === 2 && "Sélectionnez l'opérateur"}
            {step === 3 && "Entrez le montant"}
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {step === 1 && (
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon
              return (
                <Card
                  key={method.id}
                  className={`p-4 rounded-2xl cursor-pointer transition-all ${
                    selectedMethod === method.id ? "border-primary bg-primary/5" : "hover:border-muted-foreground"
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        selectedMethod === method.id ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{method.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {method.options.length > 0 ? `${method.options.length} options disponibles` : "Virement direct"}
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedMethod === method.id ? "border-primary bg-primary" : "border-border"
                      }`}
                    >
                      {selectedMethod === method.id && <Check className="w-4 h-4 text-primary-foreground" />}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {step === 2 && currentMethod?.options && (
          <div className="space-y-3">
            {currentMethod.options.map((option) => (
              <Card
                key={option.id}
                className={`p-4 rounded-2xl cursor-pointer transition-all ${
                  selectedOption === option.id ? "border-primary bg-primary/5" : "hover:border-muted-foreground"
                }`}
                onClick={() => setSelectedOption(option.id)}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={option.logo || "/placeholder.svg"}
                    alt={option.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{option.name}</h3>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === option.id ? "border-primary bg-primary" : "border-border"
                    }`}
                  >
                    {selectedOption === option.id && <Check className="w-4 h-4 text-primary-foreground" />}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Montant en Nkap</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-16 rounded-2xl text-2xl font-bold text-center pr-20"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-medium text-primary">Nkap</span>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                ≈ {localAmount.toLocaleString()} {country.currencySymbol}
              </p>
            </div>

            {/* Quick amounts */}
            <div className="flex flex-wrap gap-2 justify-center">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    Number.parseInt(amount) === quickAmount
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {quickAmount.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Phone number for mobile money */}
            {selectedMethod === "mobile" && (
              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="691 234 567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="h-14 rounded-2xl text-base"
                />
              </div>
            )}

            {/* Summary */}
            {nkapAmount > 0 && (
              <Card className="p-4 rounded-2xl bg-muted/50">
                <h3 className="font-medium mb-3">Résumé</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Montant</dt>
                    <dd className="font-medium">{nkapAmount.toLocaleString()} Nkap</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Frais (1.5%)</dt>
                    <dd className="font-medium">{fee.toLocaleString()} Nkap</dd>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <dt className="font-medium">Total à payer</dt>
                    <dd className="font-bold text-primary">{(nkapAmount + fee).toLocaleString()} Nkap</dd>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <dt>En {country.currency}</dt>
                    <dd>
                      {((nkapAmount + fee) * country.nkapRate).toLocaleString()} {country.currencySymbol}
                    </dd>
                  </div>
                </dl>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="p-4 bg-card border-t border-border">
        <Button
          onClick={step === 3 ? handleConfirm : handleContinue}
          disabled={
            isLoading || (step === 2 && !selectedOption) || (step === 3 && (!amount || Number.parseInt(amount) < 100))
          }
          className="w-full h-14 rounded-xl text-lg font-semibold gap-2"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>
              {step === 3 ? "Confirmer" : "Continuer"}
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </footer>
    </main>
  )
}
