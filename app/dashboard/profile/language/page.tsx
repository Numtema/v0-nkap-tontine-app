"use client"

import { useState } from "react"
import { ArrowLeft, Check, Globe, MapPin } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const languages = [
  { code: "fr", name: "Français", native: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", native: "English", flag: "🇬🇧" },
  { code: "sw", name: "Swahili", native: "Kiswahili", flag: "🇰🇪" },
  { code: "wo", name: "Wolof", native: "Wolof", flag: "🇸🇳" },
  { code: "ln", name: "Lingala", native: "Lingála", flag: "🇨🇩" },
  { code: "pcm", name: "Pidgin", native: "Pidgin", flag: "🇳🇬" },
]

const countries = [
  { code: "CM", name: "Cameroun", currency: "XAF", flag: "🇨🇲" },
  { code: "NG", name: "Nigeria", currency: "NGN", flag: "🇳🇬" },
  { code: "SN", name: "Sénégal", currency: "XOF", flag: "🇸🇳" },
  { code: "KE", name: "Kenya", currency: "KES", flag: "🇰🇪" },
  { code: "CI", name: "Côte d'Ivoire", currency: "XOF", flag: "🇨🇮" },
  { code: "GH", name: "Ghana", currency: "GHS", flag: "🇬🇭" },
  { code: "CD", name: "RD Congo", currency: "CDF", flag: "🇨🇩" },
  { code: "FR", name: "France (Diaspora)", currency: "EUR", flag: "🇫🇷" },
  { code: "US", name: "USA (Diaspora)", currency: "USD", flag: "🇺🇸" },
]

export default function LanguagePage() {
  const [selectedLanguage, setSelectedLanguage] = useState("fr")
  const [selectedCountry, setSelectedCountry] = useState("CM")

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/profile">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold font-sans">Langue et région</h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Language Selection */}
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Langue de l'application
          </h2>
          <div className="space-y-2">
            {languages.map((lang) => (
              <Card
                key={lang.code}
                className={`rounded-2xl p-4 cursor-pointer transition-all ${
                  selectedLanguage === lang.code ? "border-2 border-[#2D6A4F] bg-[#2D6A4F]/5" : "hover:shadow-md"
                }`}
                onClick={() => setSelectedLanguage(lang.code)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{lang.name}</p>
                    <p className="text-sm text-gray-500">{lang.native}</p>
                  </div>
                  {selectedLanguage === lang.code && (
                    <div className="w-6 h-6 rounded-full bg-[#2D6A4F] flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Country/Region Selection */}
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Pays / Région
          </h2>
          <div className="space-y-2">
            {countries.map((country) => (
              <Card
                key={country.code}
                className={`rounded-2xl p-4 cursor-pointer transition-all ${
                  selectedCountry === country.code ? "border-2 border-[#2D6A4F] bg-[#2D6A4F]/5" : "hover:shadow-md"
                }`}
                onClick={() => setSelectedCountry(country.code)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{country.flag}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{country.name}</p>
                    <p className="text-sm text-gray-500">Devise: {country.currency}</p>
                  </div>
                  {selectedCountry === country.code && (
                    <div className="w-6 h-6 rounded-full bg-[#2D6A4F] flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Info */}
        <Card className="rounded-2xl p-4 bg-[#E9C46A]/10 border-[#E9C46A]/30">
          <p className="text-sm text-gray-700">
            Le pays sélectionné détermine la devise locale affichée à côté du Nkap et les taux de conversion appliqués.
          </p>
        </Card>
      </div>
    </div>
  )
}
