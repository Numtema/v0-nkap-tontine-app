"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NkapLogo } from "@/components/nkap-logo"
import { Eye, EyeOff, ArrowLeft, Fingerprint } from "lucide-react"
import { loginAction } from "@/lib/actions/auth"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    try {
      const result = await loginAction(formData)

      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.")
      setIsLoading(false)
    }
  }

  const handleBiometric = async () => {
    setError("La connexion biométrique n'est pas encore disponible")
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/onboarding")} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
          <span className="sr-only">Retour</span>
        </Button>
      </header>

      {/* Content */}
      <div className="flex-1 px-6 pb-6">
        <div className="mb-8">
          <NkapLogo size="md" className="mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Bon retour!</h1>
          <p className="text-muted-foreground">Connectez-vous à votre compte Nkap</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="votre@email.com"
              required
              className="h-14 rounded-2xl text-base"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Oublié?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Votre mot de passe"
                required
                className="h-14 rounded-2xl text-base pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {error && <p className="text-sm text-destructive text-center p-3 bg-destructive/10 rounded-xl">{error}</p>}

          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full rounded-full h-14 text-lg font-semibold"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>

        {/* Biometric option */}
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">ou</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={handleBiometric}
            className="rounded-full h-14 gap-3 bg-transparent"
          >
            <Fingerprint className="w-6 h-6" />
            Connexion biométrique
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-6">
        <p className="text-center text-sm text-muted-foreground">
          Pas encore de compte?{" "}
          <Link href="/signup" className="text-primary font-medium hover:underline">
            Créer un compte
          </Link>
        </p>
      </footer>
    </main>
  )
}
