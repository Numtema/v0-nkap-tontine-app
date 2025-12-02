"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NkapLogo } from "@/components/nkap-logo"
import { Eye, EyeOff, ArrowLeft, Fingerprint, Loader2 } from "lucide-react"
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
    <main className="min-h-screen min-h-[100dvh] bg-gradient-to-b from-background to-secondary/20 flex flex-col safe-top safe-bottom">
      {/* Header */}
      <header className="p-4 sm:p-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/onboarding")}
          className="rounded-full hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="sr-only">Retour</span>
        </Button>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 pb-6 max-w-md mx-auto w-full">
        <div className="mb-8 animate-fade-in">
          <NkapLogo size="md" className="mb-6" animated={false} />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Bon retour!</h1>
          <p className="text-muted-foreground">Connectez-vous à votre compte Nkap</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2 animate-slide-up stagger-1">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="votre@email.com"
              required
              className="h-14 rounded-2xl text-base bg-card/50 backdrop-blur border-border/50 focus:border-primary focus:bg-card transition-all duration-300"
            />
          </div>

          <div className="space-y-2 animate-slide-up stagger-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Mot de passe
              </Label>
              <Link href="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
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
                className="h-14 rounded-2xl text-base pr-12 bg-card/50 backdrop-blur border-border/50 focus:border-primary focus:bg-card transition-all duration-300"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full hover:bg-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Eye className="w-5 h-5 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="animate-scale-in">
              <p className="text-sm text-destructive text-center p-3 bg-destructive/10 rounded-xl border border-destructive/20">
                {error}
              </p>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full rounded-full h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed animate-slide-up stagger-3"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Se connecter"}
          </Button>
        </form>

        {/* Divider */}
        <div className="mt-8 flex items-center gap-4 animate-fade-in stagger-4">
          <div className="flex-1 h-px bg-border/50" />
          <span className="text-sm text-muted-foreground">ou</span>
          <div className="flex-1 h-px bg-border/50" />
        </div>

        {/* Biometric */}
        <Button
          variant="outline"
          size="lg"
          onClick={handleBiometric}
          className="w-full mt-6 rounded-full h-14 gap-3 bg-card/50 backdrop-blur border-border/50 hover:bg-card hover:border-primary/30 transition-all duration-300 animate-slide-up stagger-5"
        >
          <Fingerprint className="w-6 h-6 text-primary" />
          Connexion biométrique
        </Button>
      </div>

      {/* Footer */}
      <footer className="p-4 sm:p-6 safe-bottom">
        <p className="text-center text-sm text-muted-foreground">
          Pas encore de compte?{" "}
          <Link href="/signup" className="text-primary font-semibold hover:text-primary/80 transition-colors">
            Créer un compte
          </Link>
        </p>
      </footer>
    </main>
  )
}
