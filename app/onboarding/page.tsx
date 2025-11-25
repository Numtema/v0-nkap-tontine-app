"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { NkapLogo } from "@/components/nkap-logo"
import { ChevronRight, ChevronLeft, Users, Wallet, Globe, Shield } from "lucide-react"

const slides = [
  {
    icon: Users,
    title: "Tontines Digitales",
    description:
      "Rejoignez ou créez des tontines avec vos proches, où que vous soyez dans le monde. Gestion simplifiée et transparente.",
    color: "bg-primary",
  },
  {
    icon: Wallet,
    title: "Monnaie Nkap",
    description:
      "Une monnaie virtuelle stable qui s'adapte à votre devise locale. 1 Nkap = une valeur fixe dans votre pays.",
    color: "bg-secondary",
  },
  {
    icon: Globe,
    title: "Sans Frontières",
    description:
      "Connectez-vous avec la diaspora et participez aux tontines familiales depuis n'importe où dans le monde.",
    color: "bg-accent",
  },
  {
    icon: Shield,
    title: "Sécurisé & Fiable",
    description:
      "Vos fonds sont protégés. Transactions transparentes, historique complet et notifications en temps réel.",
    color: "bg-primary",
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1)
    } else {
      completeOnboarding()
    }
  }

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1)
    }
  }

  const completeOnboarding = () => {
    localStorage.setItem("nkap_onboarding_complete", "true")
    router.push("/signup")
  }

  const slide = slides[currentSlide]
  const Icon = slide.icon

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <NkapLogo size="sm" showText={false} />
        <Button variant="ghost" onClick={completeOnboarding} className="text-muted-foreground">
          Passer
        </Button>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Illustration area */}
        <div
          className={`w-40 h-40 rounded-[2.5rem] ${slide.color} flex items-center justify-center mb-12 shadow-lg transition-all duration-500`}
        >
          <Icon className="w-20 h-20 text-white" strokeWidth={1.5} />
        </div>

        {/* Text content */}
        <div className="text-center max-w-sm">
          <h1 className="text-2xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
          <p className="text-muted-foreground leading-relaxed text-balance">{slide.description}</p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 mt-12">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted-foreground"
              }`}
              aria-label={`Aller à la diapositive ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <footer className="p-6 flex gap-4">
        {currentSlide > 0 && (
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrev}
            className="rounded-full w-14 h-14 p-0 bg-transparent"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="sr-only">Précédent</span>
          </Button>
        )}
        <Button size="lg" onClick={handleNext} className="flex-1 rounded-full h-14 text-lg font-semibold">
          {currentSlide === slides.length - 1 ? "Commencer" : "Suivant"}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </footer>
    </main>
  )
}
