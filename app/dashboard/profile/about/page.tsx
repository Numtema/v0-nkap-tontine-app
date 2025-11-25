"use client"

import { ArrowLeft, ExternalLink, Heart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NkapLogo } from "@/components/nkap-logo"

export default function AboutPage() {
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
          <h1 className="text-xl font-semibold font-sans">À propos de Nkap</h1>
        </div>
      </div>

      <div className="px-6 py-8 space-y-6">
        {/* Logo and Version */}
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <NkapLogo size={80} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 font-sans">Nkap</h2>
          <p className="text-gray-500">Version 1.0.0</p>
          <p className="text-sm text-[#2D6A4F] mt-2">La tontine moderne pour l'Afrique</p>
        </div>

        {/* Mission Statement */}
        <Card className="rounded-2xl p-6 bg-gradient-to-br from-[#2D6A4F]/5 to-[#F4A261]/5">
          <h3 className="font-semibold text-gray-900 mb-3">Notre mission</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Nkap digitalise la tradition africaine des tontines pour créer une communauté financière solidaire,
            transparente et accessible à tous, où qu'ils soient dans le monde. Nous croyons en la force du collectif
            pour bâtir un avenir financier meilleur.
          </p>
        </Card>

        {/* Links */}
        <div className="space-y-2">
          <Link href="#">
            <Card className="rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-shadow">
              <span className="font-medium">Conditions d'utilisation</span>
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </Card>
          </Link>
          <Link href="#">
            <Card className="rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-shadow">
              <span className="font-medium">Politique de confidentialité</span>
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </Card>
          </Link>
          <Link href="#">
            <Card className="rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-shadow">
              <span className="font-medium">Licences open source</span>
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </Card>
          </Link>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Suivez-nous</h3>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-xl h-12 bg-transparent">
              Facebook
            </Button>
            <Button variant="outline" className="flex-1 rounded-xl h-12 bg-transparent">
              Twitter
            </Button>
            <Button variant="outline" className="flex-1 rounded-xl h-12 bg-transparent">
              Instagram
            </Button>
          </div>
        </div>

        {/* Made with Love */}
        <div className="text-center pt-8">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            Fait avec <Heart className="w-4 h-4 fill-red-500 text-red-500" /> en Afrique
          </p>
          <p className="text-xs text-gray-400 mt-2">© 2025 Nkap. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  )
}
