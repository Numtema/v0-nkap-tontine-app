"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { NkapLogo } from "@/components/nkap-logo"
import { ArrowLeft } from "lucide-react"

export default function VerifyPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(60)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when complete
    if (newOtp.every((digit) => digit) && newOtp.join("").length === 6) {
      handleVerify(newOtp.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6)
    setOtp(newOtp)

    if (pastedData.length === 6) {
      handleVerify(pastedData)
    }
  }

  const handleVerify = async (code: string) => {
    setIsLoading(true)
    setError("")

    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo, accept "123456"
    if (code === "123456") {
      localStorage.setItem("nkap_user", JSON.stringify({ verified: true }))
      router.push("/dashboard")
    } else {
      setError("Code incorrect. Veuillez réessayer.")
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    }
    setIsLoading(false)
  }

  const handleResend = () => {
    setCountdown(60)
    // Simulate resend
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
      <div className="flex-1 px-6 pb-6 flex flex-col">
        <div className="mb-8">
          <NkapLogo size="sm" showText={false} className="mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Vérification</h1>
          <p className="text-muted-foreground">Entrez le code à 6 chiffres envoyé par SMS</p>
        </div>

        {/* OTP Input */}
        <div className="flex gap-3 justify-center mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={`w-12 h-14 text-center text-xl font-semibold rounded-2xl border-2 transition-all
                ${error ? "border-destructive" : digit ? "border-primary bg-primary/5" : "border-border"}
                focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
              `}
              disabled={isLoading}
            />
          ))}
        </div>

        {error && <p className="text-center text-sm text-destructive mb-4">{error}</p>}

        {/* Resend */}
        <div className="text-center mt-auto">
          {countdown > 0 ? (
            <p className="text-sm text-muted-foreground">
              Renvoyer le code dans <span className="text-primary font-medium">{countdown}s</span>
            </p>
          ) : (
            <Button variant="ghost" onClick={handleResend} className="text-primary">
              Renvoyer le code
            </Button>
          )}
        </div>

        {/* Demo hint */}
        <p className="text-center text-xs text-muted-foreground mt-4 p-3 bg-muted rounded-xl">
          Demo: utilisez le code <span className="font-mono font-bold">123456</span>
        </p>
      </div>

      {/* Footer */}
      <footer className="p-6">
        <Button
          size="lg"
          onClick={() => handleVerify(otp.join(""))}
          disabled={isLoading || otp.some((d) => !d)}
          className="w-full rounded-full h-14 text-lg font-semibold"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            "Vérifier"
          )}
        </Button>
      </footer>
    </main>
  )
}
