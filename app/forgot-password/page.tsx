"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NkapLogo } from "@/components/nkap-logo"
import { CountrySelector } from "@/components/country-selector"
import { SUPPORTED_COUNTRIES, type Country } from "@/lib/types"
import { ArrowLeft, Mail, Phone } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [method, setMethod] = useState<"phone" | "email">("phone")
  const [country, setCountry] = useState<Country>(SUPPORTED_COUNTRIES[0])
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSent(true)
    setIsLoading(false)
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
          <span className="sr-only">Retour</span>
        </Button>
      </header>

      {/* Content */}
      <div className="flex-1 px-6 pb-6">
        <div className="mb-8">
          <NkapLogo size="sm" showText={false} className="mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Mot de passe oublié</h1>
          <p className="text-muted-foreground">
            {sent
              ? "Vérifiez vos messages pour le lien de réinitialisation"
              : "Nous vous enverrons un lien pour réinitialiser votre mot de passe"}
          </p>
        </div>

        {sent ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-success" />
            </div>
            <p className="text-muted-foreground mb-8">
              {method === "phone" ? "Un SMS a été envoyé à votre numéro" : "Un email a été envoyé à votre adresse"}
            </p>
            <Button variant="outline" onClick={() => setSent(false)} className="rounded-full">
              Renvoyer
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Method selector */}
            <div className="flex gap-2 p-1 bg-muted rounded-2xl">
              <button
                type="button"
                onClick={() => setMethod("phone")}
                className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                  method === "phone" ? "bg-card shadow-sm" : ""
                }`}
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">Téléphone</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod("email")}
                className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                  method === "email" ? "bg-card shadow-sm" : ""
                }`}
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">Email</span>
              </button>
            </div>

            {method === "phone" ? (
              <>
                <div className="space-y-2">
                  <Label>Pays</Label>
                  <CountrySelector value={country} onChange={setCountry} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="691 234 567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-14 rounded-2xl text-base"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 rounded-2xl text-base"
                />
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isLoading || (method === "phone" ? !phone : !email)}
              className="w-full rounded-full h-14 text-lg font-semibold"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                "Envoyer le lien"
              )}
            </Button>
          </form>
        )}
      </div>
    </main>
  )
}
