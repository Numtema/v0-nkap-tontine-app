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
    gradient: "from-primary to-primary/70",
  },
  {
    icon: Wallet,
    title: "Monnaie Nkap",
    description:
      "Une monnaie virtuelle stable qui s'adapte à votre devise locale. 1 Nkap = une valeur fixe dans votre pays.",
    gradient: "from-accent to-accent/70",
  },
  {
    icon: Globe,
    title: "Sans Frontières",
    description:
      "Connectez-vous avec la diaspora et participez aux tontines familiales depuis n'importe où dans le monde.",
    gradient: "from-primary/80 to-accent/80",
  },
  {
    icon: Shield,
    title: "Sécurisé & Fiable",
    description:
      "Vos fonds sont protégés. Transactions transparentes, historique complet et notifications en temps réel.",
    gradient: "from-primary to-primary/70",
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState<"next" | "prev">("next")

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setDirection("next")
      setCurrentSlide((prev) => prev + 1)
    } else {
      completeOnboarding()
    }
  }

  const handlePrev = () => {
    if (currentSlide > 0) {
      setDirection("prev")
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
    <main className="min-h-screen min-h-[100dvh] bg-gradient-to-b from-background to-secondary/20 flex flex-col safe-top safe-bottom">
      {/* Header */}
      <header className="p-4 sm:p-6 flex items-center justify-between">
        <NkapLogo size="sm" showText={false} animated={false} />
        <Button
          variant="ghost"
          onClick={completeOnboarding}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Passer
        </Button>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Illustration */}
        <div
          key={currentSlide}
          className={`w-36 h-36 sm:w-44 sm:h-44 rounded-[2.5rem] bg-gradient-to-br ${slide.gradient} flex items-center justify-center mb-10 sm:mb-12 shadow-2xl shadow-primary/20 ${direction === "next" ? "animate-slide-in-right" : "animate-slide-in-left"}`}
        >
          <div className="absolute inset-2 rounded-[2rem] bg-gradient-to-t from-transparent to-white/20" />
          <Icon className="w-16 h-16 sm:w-20 sm:h-20 text-white relative z-10" strokeWidth={1.5} />
        </div>

        {/* Text */}
        <div
          key={`text-${currentSlide}`}
          className={`text-center max-w-sm ${direction === "next" ? "animate-slide-up" : "animate-slide-down"}`}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
          <p className="text-muted-foreground leading-relaxed text-balance text-sm sm:text-base">{slide.description}</p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2.5 mt-10 sm:mt-12">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentSlide ? "next" : "prev")
                setCurrentSlide(index)
              }}
              className={`h-2 rounded-full transition-all duration-500 ease-out ${
                index === currentSlide
                  ? "w-8 bg-primary shadow-md shadow-primary/30"
                  : "w-2 bg-border hover:bg-muted-foreground/50"
              }`}
              aria-label={`Aller à la diapositive ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <footer className="p-4 sm:p-6 flex gap-3 sm:gap-4 safe-bottom">
        {currentSlide > 0 && (
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrev}
            className="rounded-full w-14 h-14 p-0 bg-card/50 backdrop-blur border-border/50 hover:bg-card hover:border-primary/30 transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="sr-only">Précédent</span>
          </Button>
        )}
        <Button
          size="lg"
          onClick={handleNext}
          className="flex-1 rounded-full h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
        >
          {currentSlide === slides.length - 1 ? "Commencer" : "Suivant"}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </footer>
    </main>
  )
}
