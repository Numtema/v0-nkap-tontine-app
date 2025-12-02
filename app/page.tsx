"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { NkapLogo } from "@/components/nkap-logo"

export default function SplashPage() {
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 40)

    const checkOnboarding = () => {
      const hasSeenOnboarding = localStorage.getItem("nkap_onboarding_complete")

      setTimeout(() => {
        setIsAnimating(false)
        setTimeout(() => {
          if (hasSeenOnboarding) {
            router.push("/login")
          } else {
            router.push("/onboarding")
          }
        }, 300)
      }, 2500)
    }

    checkOnboarding()

    return () => clearInterval(progressInterval)
  }, [router])

  return (
    <main className="min-h-screen min-h-[100dvh] bg-gradient-to-b from-background via-background to-secondary/30 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <div
        className={`transition-all duration-700 ease-out ${isAnimating ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
      >
        <NkapLogo size="xl" animated={isAnimating} />
      </div>

      {/* Tagline */}
      <p
        className={`mt-8 text-muted-foreground text-center text-lg font-medium transition-all duration-500 delay-300 ${isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        La tontine digitale africaine
      </p>

      {/* Progress bar */}
      <div className={`mt-12 w-48 transition-opacity duration-300 ${isAnimating ? "opacity-100" : "opacity-0"}`}>
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3">Chargement...</p>
      </div>

      {/* Version info */}
      <div className={`absolute bottom-8 transition-opacity duration-500 ${isAnimating ? "opacity-60" : "opacity-0"}`}>
        <p className="text-xs text-muted-foreground">Version 1.0.0</p>
      </div>
    </main>
  )
}
