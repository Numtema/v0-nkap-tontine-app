"use client"

import { useState } from "react"
import { ArrowLeft, ChevronDown, ChevronRight, MessageCircle, Phone, Mail, FileText, Video } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const faqs = [
  {
    question: "Comment créer une tontine ?",
    answer:
      "Pour créer une tontine, allez sur le tableau de bord et appuyez sur le bouton '+' au centre. Suivez les étapes pour définir le nom, les règles, les montants et les caisses de votre tontine.",
  },
  {
    question: "Comment fonctionne le Nkap ?",
    answer:
      "Le Nkap est la monnaie interne de l'application. 1 Nkap = 100 XAF au Cameroun (le taux varie selon le pays). Vous pouvez recharger votre portefeuille via Mobile Money, carte bancaire ou crypto.",
  },
  {
    question: "Comment rejoindre une tontine existante ?",
    answer:
      "Demandez le code unique de la tontine à l'administrateur, puis allez dans 'Rejoindre une tontine' depuis le tableau de bord. Entrez le code et acceptez les règles pour rejoindre.",
  },
  {
    question: "Que se passe-t-il si je rate une contribution ?",
    answer:
      "Les pénalités dépendent des règles définies par l'administrateur de la tontine. Généralement, une amende est appliquée et votre score de réputation peut être affecté.",
  },
  {
    question: "Comment retirer mon argent ?",
    answer:
      "Allez dans Portefeuille > Retirer, choisissez le montant et le moyen de paiement (Mobile Money ou compte bancaire). Le retrait est traité sous 24-48h.",
  },
  {
    question: "L'application est-elle sécurisée ?",
    answer:
      "Oui, Nkap utilise le chiffrement de bout en bout pour toutes les transactions. Nous recommandons d'activer la biométrie et l'authentification à deux facteurs.",
  },
]

const contactOptions = [
  {
    icon: MessageCircle,
    title: "Chat en direct",
    description: "Réponse en moins de 5 min",
    action: "Démarrer le chat",
  },
  {
    icon: Phone,
    title: "Appel téléphonique",
    description: "+237 6 00 00 00 00",
    action: "Appeler",
  },
  {
    icon: Mail,
    title: "Email",
    description: "support@nkap.app",
    action: "Envoyer un email",
  },
]

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-[#2D6A4F] text-white px-6 pt-12 pb-8 rounded-b-[32px]">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/profile">
            <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/20">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold font-sans">Aide et support</h1>
        </div>
        <Input
          placeholder="Rechercher dans l'aide..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-2xl h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60"
        />
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="rounded-2xl p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <Video className="w-8 h-8 mx-auto mb-2 text-[#2D6A4F]" />
            <p className="font-medium text-sm">Tutoriels vidéo</p>
          </Card>
          <Card className="rounded-2xl p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <FileText className="w-8 h-8 mx-auto mb-2 text-[#F4A261]" />
            <p className="font-medium text-sm">Guide utilisateur</p>
          </Card>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-3">Questions fréquentes</h2>
          <div className="space-y-2">
            {filteredFaqs.map((faq, index) => (
              <Card key={index} className="rounded-2xl overflow-hidden">
                <button
                  className="w-full p-4 text-left flex items-center justify-between"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && <div className="px-4 pb-4 text-gray-600 text-sm">{faq.answer}</div>}
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Options */}
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-3">Nous contacter</h2>
          <div className="space-y-3">
            {contactOptions.map((option, index) => (
              <Card key={index} className="rounded-2xl p-4 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#2D6A4F]/10 flex items-center justify-center">
                    <option.icon className="w-6 h-6 text-[#2D6A4F]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{option.title}</p>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
