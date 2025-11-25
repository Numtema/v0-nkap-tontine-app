"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { SUPPORTED_COUNTRIES } from "@/lib/types"
import { ArrowLeft, Smartphone, Building2, Bitcoin, Check, ChevronRight, AlertCircle } from "lucide-react"

const withdrawMethods = [
  {
    id: "mobile",
    name: "Mobile Money",
    icon: Smartphone,
    description: "MTN MoMo, Orange Money, Wave",
    minAmount: 100,
    maxAmount: 50000,
    fee: 0.02, // 2%
  },
  {
    id: "bank",
    name: "Virement bancaire",
    icon: Building2,
    description: "Vers votre compte bancaire",
    minAmount: 1000,
    maxAmount: 100000,
    fee: 0.01, // 1%
  },
  {
    id: "crypto",
    name: "Crypto-monnaie",
    icon: Bitcoin,
    description: "USDT, Celo",
    minAmount: 500,
    maxAmount: 100000,
    fee: 0.005, // 0.5%
  },
]

export default function WithdrawPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedMethod, setSelectedMethod] = useState("")
  const [amount, setAmount] = useState("")
  const [destination, setDestination] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const country = SUPPORTED_COUNTRIES[0]
  const availableBalance = 10000 // Mock available balance
  const nkapAmount = Number.parseInt(amount) || 0

  const currentMethod = withdrawMethods.find((m) => m.id === selectedMethod)
  const fee = currentMethod ? Math.ceil(nkapAmount * currentMethod.fee) : 0
  const netAmount = nkapAmount - fee
  const localAmount = netAmount * country.nkapRate

  const isAmountValid =
    currentMethod &&
    nkapAmount >= currentMethod.minAmount &&
    nkapAmount <= currentMethod.maxAmount &&
    nkapAmount <= availableBalance

  const handleContinue = () => {
    if (step === 1) {
      setStep(2)
    } else {
      handleConfirm()
    }
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    router.push("/dashboard/wallet?success=withdraw")
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
          <h1 className="font-semibold text-lg">Retirer</h1>
          <p className="text-sm text-muted-foreground">Solde disponible: {availableBalance.toLocaleString()} Nkap</p>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">Choisissez comment recevoir vos fonds</p>

            {withdrawMethods.map((method) => {
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
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                      <p className="text-xs text-primary mt-1">
                        Frais: {method.fee * 100}% | Min: {method.minAmount} Nkap
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

        {step === 2 && currentMethod && (
          <div className="space-y-6">
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Montant à retirer (Nkap)</Label>
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

              {/* Validation messages */}
              {nkapAmount > 0 && nkapAmount < currentMethod.minAmount && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Minimum {currentMethod.minAmount} Nkap
                </p>
              )}
              {nkapAmount > availableBalance && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Solde insuffisant
                </p>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setAmount(availableBalance.toString())}
                className="rounded-full"
              >
                Retirer tout ({availableBalance.toLocaleString()} Nkap)
              </Button>
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <Label htmlFor="destination">
                {selectedMethod === "mobile" && "Numéro de téléphone"}
                {selectedMethod === "bank" && "Numéro de compte"}
                {selectedMethod === "crypto" && "Adresse du wallet"}
              </Label>
              <Input
                id="destination"
                type={selectedMethod === "mobile" ? "tel" : "text"}
                placeholder={
                  selectedMethod === "mobile"
                    ? "691 234 567"
                    : selectedMethod === "bank"
                      ? "CM21 10003 00100 12345678901 57"
                      : "0x..."
                }
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="h-14 rounded-2xl text-base"
              />
            </div>

            {/* Summary */}
            {isAmountValid && (
              <Card className="p-4 rounded-2xl bg-muted/50">
                <h3 className="font-medium mb-3">Résumé du retrait</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Montant demandé</dt>
                    <dd className="font-medium">{nkapAmount.toLocaleString()} Nkap</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Frais ({currentMethod.fee * 100}%)</dt>
                    <dd className="font-medium text-destructive">-{fee.toLocaleString()} Nkap</dd>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <dt className="font-medium">Vous recevrez</dt>
                    <dd className="font-bold text-success">{netAmount.toLocaleString()} Nkap</dd>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <dt>En {country.currency}</dt>
                    <dd>
                      {localAmount.toLocaleString()} {country.currencySymbol}
                    </dd>
                  </div>
                </dl>
              </Card>
            )}

            <p className="text-xs text-muted-foreground text-center">Les retraits sont généralement traités sous 24h</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="p-4 bg-card border-t border-border">
        <Button
          onClick={handleContinue}
          disabled={isLoading || (step === 1 && !selectedMethod) || (step === 2 && (!isAmountValid || !destination))}
          className="w-full h-14 rounded-xl text-lg font-semibold gap-2"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>
              {step === 2 ? "Confirmer le retrait" : "Continuer"}
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </footer>
    </main>
  )
}
