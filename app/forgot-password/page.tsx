"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NkapLogo } from "@/components/nkap-logo"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { forgotPasswordAction } from "@/lib/actions/auth"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("email", email)

      const result = await forgotPasswordAction(formData)

      if (result?.error) {
        setError(result.error)
      } else {
        setSent(true)
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
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
              ? "Vérifiez votre email pour le lien de réinitialisation"
              : "Nous vous enverrons un lien pour réinitialiser votre mot de passe"}
          </p>
        </div>

        {sent ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <p className="text-muted-foreground mb-4">
              Un email a été envoyé à <span className="font-medium text-foreground">{email}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Cliquez sur le lien dans l'email pour réinitialiser votre mot de passe
            </p>
            <div className="space-y-3">
              <Button variant="outline" onClick={() => setSent(false)} className="rounded-full">
                Renvoyer l'email
              </Button>
              <Link href="/login" className="block">
                <Button variant="ghost" className="rounded-full">
                  Retour à la connexion
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
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

            {error && <p className="text-sm text-destructive text-center p-3 bg-destructive/10 rounded-xl">{error}</p>}

            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !email}
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

      {/* Footer */}
      <footer className="p-6">
        <p className="text-center text-sm text-muted-foreground">
          Vous vous souvenez?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </footer>
    </main>
  )
}
