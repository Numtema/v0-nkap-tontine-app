"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { NkapLogo } from "@/components/nkap-logo"

export default function SplashPage() {
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false)
      // Check if user has seen onboarding
      const hasSeenOnboarding = localStorage.getItem("nkap_onboarding_complete")
      const isLoggedIn = localStorage.getItem("nkap_user")

      if (isLoggedIn) {
        router.push("/dashboard")
      } else if (hasSeenOnboarding) {
        router.push("/login")
      } else {
        router.push("/onboarding")
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className={`transition-all duration-700 ${isAnimating ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}>
        <NkapLogo size="xl" />
      </div>

      <p
        className={`mt-8 text-muted-foreground text-center text-lg transition-all duration-500 delay-500 ${isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        La tontine digitale africaine
      </p>

      {/* Loading indicator */}
      <div className={`mt-12 flex gap-2 transition-opacity duration-300 ${isAnimating ? "opacity-100" : "opacity-0"}`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </main>
  )
}
