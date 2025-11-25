"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ChevronRight, Users, Wallet, Calendar, Shield, Plus, Trash2 } from "lucide-react"
import { SUPPORTED_COUNTRIES } from "@/lib/types"

const frequencies = [
  { value: "daily", label: "Quotidien" },
  { value: "weekly", label: "Hebdomadaire" },
  { value: "biweekly", label: "Bi-mensuel" },
  { value: "monthly", label: "Mensuel" },
  { value: "yearly", label: "Annuel" },
]

const defaultCaisses = [
  { id: "main", name: "Caisse Principale", type: "main", required: true },
  { id: "epargne", name: "Épargne", type: "epargne", required: false },
  { id: "bonheur", name: "Bonheur/Fêtes", type: "bonheur", required: false },
  { id: "solidarite", name: "Solidarité", type: "solidarite", required: false },
]

export default function CreateTontinePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const country = SUPPORTED_COUNTRIES[0]

  const [formData, setFormData] = useState({
    name: "",
    slogan: "",
    description: "",
    maxMembers: 10,
    contributionAmount: 500,
    frequency: "monthly",
    membershipFee: 0,
    latePenaltyPercent: 10,
    selectedCaisses: ["main"],
    customCaisses: [] as { name: string; amount: number }[],
  })

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      handleCreate()
    }
  }

  const handleCreate = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push("/dashboard/tontines")
  }

  const toggleCaisse = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCaisses: prev.selectedCaisses.includes(id)
        ? prev.selectedCaisses.filter((c) => c !== id)
        : [...prev.selectedCaisses, id],
    }))
  }

  const addCustomCaisse = () => {
    setFormData((prev) => ({
      ...prev,
      customCaisses: [...prev.customCaisses, { name: "", amount: 0 }],
    }))
  }

  const stepIcons = [Users, Wallet, Calendar, Shield]
  const stepTitles = ["Informations de base", "Montants et cotisations", "Caisses", "Règles et confirmation"]

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
          <h1 className="font-semibold text-lg">Créer une tontine</h1>
          <p className="text-sm text-muted-foreground">Étape {step} sur 4</p>
        </div>
      </header>

      {/* Progress */}
      <div className="p-4 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((s) => {
            const Icon = stepIcons[s - 1]
            return (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    s <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {s < 4 && <div className={`w-12 h-1 mx-1 rounded ${s < step ? "bg-primary" : "bg-muted"}`} />}
              </div>
            )
          })}
        </div>
        <p className="text-center text-sm font-medium mt-3">{stepTitles[step - 1]}</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la tontine *</Label>
              <Input
                id="name"
                placeholder="Ex: Famille Nguema"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="h-14 rounded-2xl text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slogan">Slogan (optionnel)</Label>
              <Input
                id="slogan"
                placeholder="Ex: Ensemble pour réussir"
                value={formData.slogan}
                onChange={(e) => setFormData((prev) => ({ ...prev, slogan: e.target.value }))}
                className="h-14 rounded-2xl text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Textarea
                id="description"
                placeholder="Décrivez les objectifs de votre tontine..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="min-h-24 rounded-2xl text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxMembers">Nombre maximum de membres</Label>
              <Input
                id="maxMembers"
                type="number"
                min={2}
                max={100}
                value={formData.maxMembers}
                onChange={(e) => setFormData((prev) => ({ ...prev, maxMembers: Number.parseInt(e.target.value) || 2 }))}
                className="h-14 rounded-2xl text-base"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="contributionAmount">Montant de cotisation (Nkap)</Label>
              <div className="relative">
                <Input
                  id="contributionAmount"
                  type="number"
                  min={1}
                  value={formData.contributionAmount}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, contributionAmount: Number.parseInt(e.target.value) || 0 }))
                  }
                  className="h-14 rounded-2xl text-base pr-20"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">Nkap</span>
              </div>
              <p className="text-sm text-muted-foreground">
                ≈ {(formData.contributionAmount * country.nkapRate).toLocaleString()} {country.currencySymbol}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Fréquence des cotisations</Label>
              <div className="grid grid-cols-2 gap-2">
                {frequencies.map((freq) => (
                  <button
                    key={freq.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, frequency: freq.value }))}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                      formData.frequency === freq.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="membershipFee">Frais d'adhésion (Nkap)</Label>
              <Input
                id="membershipFee"
                type="number"
                min={0}
                value={formData.membershipFee}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, membershipFee: Number.parseInt(e.target.value) || 0 }))
                }
                className="h-14 rounded-2xl text-base"
              />
              <p className="text-sm text-muted-foreground">Montant unique payé lors de l'adhésion. 0 = gratuit</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground">
              Sélectionnez les caisses pour votre tontine. La caisse principale est obligatoire.
            </p>

            <div className="space-y-3">
              {defaultCaisses.map((caisse) => (
                <Card
                  key={caisse.id}
                  className={`p-4 rounded-2xl cursor-pointer transition-colors ${
                    formData.selectedCaisses.includes(caisse.id)
                      ? "border-primary bg-primary/5"
                      : "hover:border-muted-foreground"
                  } ${caisse.required ? "opacity-100" : ""}`}
                  onClick={() => !caisse.required && toggleCaisse(caisse.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{caisse.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {caisse.type === "main" && "Pour les cotisations régulières"}
                        {caisse.type === "epargne" && "Épargne collective"}
                        {caisse.type === "bonheur" && "Événements et célébrations"}
                        {caisse.type === "solidarite" && "Urgences et entraide"}
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        formData.selectedCaisses.includes(caisse.id) ? "border-primary bg-primary" : "border-border"
                      }`}
                    >
                      {formData.selectedCaisses.includes(caisse.id) && (
                        <svg
                          className="w-4 h-4 text-primary-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Custom caisses */}
            {formData.customCaisses.map((caisse, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Nom de la caisse"
                  value={caisse.name}
                  onChange={(e) => {
                    const newCaisses = [...formData.customCaisses]
                    newCaisses[index].name = e.target.value
                    setFormData((prev) => ({ ...prev, customCaisses: newCaisses }))
                  }}
                  className="flex-1 h-12 rounded-xl"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      customCaisses: prev.customCaisses.filter((_, i) => i !== index),
                    }))
                  }}
                  className="rounded-full text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <Button variant="outline" onClick={addCustomCaisse} className="w-full h-12 rounded-xl gap-2 bg-transparent">
              <Plus className="w-4 h-4" />
              Ajouter une caisse personnalisée
            </Button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="latePenaltyPercent">Pénalité de retard (%)</Label>
              <Input
                id="latePenaltyPercent"
                type="number"
                min={0}
                max={50}
                value={formData.latePenaltyPercent}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, latePenaltyPercent: Number.parseInt(e.target.value) || 0 }))
                }
                className="h-14 rounded-2xl text-base"
              />
              <p className="text-sm text-muted-foreground">
                {formData.latePenaltyPercent}% de {formData.contributionAmount} Nkap ={" "}
                {((formData.contributionAmount * formData.latePenaltyPercent) / 100).toFixed(0)} Nkap
              </p>
            </div>

            {/* Summary */}
            <Card className="p-5 rounded-2xl bg-muted/50">
              <h3 className="font-semibold mb-4">Résumé</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Nom</dt>
                  <dd className="font-medium">{formData.name || "-"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Membres max</dt>
                  <dd className="font-medium">{formData.maxMembers}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Cotisation</dt>
                  <dd className="font-medium">
                    {formData.contributionAmount} Nkap /{" "}
                    {frequencies.find((f) => f.value === formData.frequency)?.label.toLowerCase()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Frais d'adhésion</dt>
                  <dd className="font-medium">
                    {formData.membershipFee > 0 ? `${formData.membershipFee} Nkap` : "Gratuit"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Caisses</dt>
                  <dd className="font-medium">{formData.selectedCaisses.length + formData.customCaisses.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Pénalité retard</dt>
                  <dd className="font-medium">{formData.latePenaltyPercent}%</dd>
                </div>
              </dl>
            </Card>

            <p className="text-sm text-muted-foreground text-center">
              En créant cette tontine, vous acceptez les conditions d'utilisation de Nkap
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="p-4 bg-card border-t border-border">
        <Button
          onClick={handleNext}
          disabled={isLoading || (step === 1 && !formData.name.trim())}
          className="w-full h-14 rounded-xl text-lg font-semibold gap-2"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>
              {step === 4 ? "Créer la tontine" : "Continuer"}
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </footer>
    </main>
  )
}
