"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NkapLogo } from "@/components/nkap-logo"
import { CountrySelector } from "@/components/country-selector"
import { SUPPORTED_COUNTRIES, type Country } from "@/lib/types"
import { Eye, EyeOff, ArrowLeft, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: SUPPORTED_COUNTRIES[0],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) newErrors.firstName = "Prénom requis"
    if (!formData.lastName.trim()) newErrors.lastName = "Nom requis"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.email.trim()) newErrors.email = "Email requis"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email invalide"
    if (formData.password.length < 6) newErrors.password = "Minimum 6 caractères"
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setErrors({})

    try {
      const supabase = createClient()

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
            country: formData.country.code,
          },
        },
      })

      if (error) {
        setErrors({ submit: error.message })
        setIsLoading(false)
        return
      }

      if (data.user) {
        router.push("/auth/sign-up-success")
      }
    } catch (err) {
      setErrors({ submit: "Une erreur est survenue. Veuillez réessayer." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCountryChange = (country: Country) => {
    setFormData((prev) => ({ ...prev, country }))
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => (step === 1 ? router.back() : setStep(1))}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="sr-only">Retour</span>
        </Button>
        <div className="flex-1">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-6 pb-6">
        <div className="mb-8">
          <NkapLogo size="sm" showText={false} className="mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {step === 1 ? "Créer un compte" : "Vos coordonnées"}
          </h1>
          <p className="text-muted-foreground">
            {step === 1 ? "Rejoignez la communauté Nkap" : "Sécurisez votre compte"}
          </p>
        </div>

        {step === 1 ? (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                placeholder="Entrez votre prénom"
                value={formData.firstName}
                onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                className="h-14 rounded-2xl text-base"
              />
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                placeholder="Entrez votre nom"
                value={formData.lastName}
                onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                className="h-14 rounded-2xl text-base"
              />
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
            </div>

            <div className="space-y-2">
              <Label>Pays de résidence</Label>
              <CountrySelector value={formData.country} onChange={handleCountryChange} />
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="phone">Numéro de téléphone (optionnel)</Label>
              <div className="flex gap-2">
                <div className="h-14 px-4 rounded-2xl bg-muted flex items-center gap-2 text-sm">
                  <span>{formData.country.flag}</span>
                  <span className="text-muted-foreground">+{getCountryCode(formData.country.code)}</span>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="691 234 567"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="flex-1 h-14 rounded-2xl text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="h-14 rounded-2xl text-base"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 caractères"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
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
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirmez votre mot de passe"
                value={formData.confirmPassword}
                onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                className="h-14 rounded-2xl text-base"
              />
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
            </div>

            {errors.submit && (
              <p className="text-sm text-destructive text-center p-3 bg-destructive/10 rounded-xl">{errors.submit}</p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="p-6 space-y-4">
        <Button
          size="lg"
          onClick={handleNext}
          disabled={isLoading}
          className="w-full rounded-full h-14 text-lg font-semibold"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>
              {step === 1 ? "Continuer" : "S'inscrire"}
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Déjà un compte?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </footer>
    </main>
  )
}

function getCountryCode(countryCode: string): string {
  const codes: Record<string, string> = {
    CM: "237",
    SN: "221",
    CI: "225",
    NG: "234",
    KE: "254",
    GH: "233",
    CD: "243",
    FR: "33",
    US: "1",
  }
  return codes[countryCode] || "237"
}
