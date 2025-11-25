"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Smartphone, CreditCard, Building2, Bitcoin, Trash2, Check, MoreVertical } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const paymentMethods = [
  {
    id: "1",
    type: "mobile_money",
    provider: "MTN Mobile Money",
    number: "+237 6 90 12 34 56",
    isDefault: true,
    logo: "/mtn-logo-yellow.jpg",
  },
  {
    id: "2",
    type: "mobile_money",
    provider: "Orange Money",
    number: "+237 6 55 98 76 54",
    isDefault: false,
    logo: "/orange-money-logo.jpg",
  },
  {
    id: "3",
    type: "card",
    provider: "Visa",
    number: "**** **** **** 4532",
    isDefault: false,
    logo: "/visa-card-logo.jpg",
  },
]

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState(paymentMethods)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [addType, setAddType] = useState<string | null>(null)

  const setAsDefault = (id: string) => {
    setMethods(
      methods.map((m) => ({
        ...m,
        isDefault: m.id === id,
      })),
    )
  }

  const deleteMethod = (id: string) => {
    setMethods(methods.filter((m) => m.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "mobile_money":
        return Smartphone
      case "card":
        return CreditCard
      case "bank":
        return Building2
      case "crypto":
        return Bitcoin
      default:
        return CreditCard
    }
  }

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
          <h1 className="text-xl font-semibold font-sans">Moyens de paiement</h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Mobile Money Section */}
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            Mobile Money
          </h2>
          <div className="space-y-3">
            {methods
              .filter((m) => m.type === "mobile_money")
              .map((method) => (
                <Card key={method.id} className="rounded-2xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                      <Image
                        src={method.logo || "/placeholder.svg"}
                        alt={method.provider}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{method.provider}</p>
                        {method.isDefault && (
                          <Badge className="bg-[#2D6A4F]/10 text-[#2D6A4F] text-xs rounded-full">Par défaut</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{method.number}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        {!method.isDefault && (
                          <DropdownMenuItem onClick={() => setAsDefault(method.id)}>
                            <Check className="w-4 h-4 mr-2" />
                            Définir par défaut
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-500" onClick={() => deleteMethod(method.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              ))}
          </div>
        </div>

        {/* Cards Section */}
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Cartes bancaires
          </h2>
          <div className="space-y-3">
            {methods
              .filter((m) => m.type === "card")
              .map((method) => (
                <Card key={method.id} className="rounded-2xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center p-2">
                      <Image
                        src={method.logo || "/placeholder.svg"}
                        alt={method.provider}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{method.provider}</p>
                        {method.isDefault && (
                          <Badge className="bg-[#2D6A4F]/10 text-[#2D6A4F] text-xs rounded-full">Par défaut</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{method.number}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        {!method.isDefault && (
                          <DropdownMenuItem onClick={() => setAsDefault(method.id)}>
                            <Check className="w-4 h-4 mr-2" />
                            Définir par défaut
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-500" onClick={() => deleteMethod(method.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              ))}
          </div>
        </div>

        {/* Add Payment Method */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="w-full rounded-2xl h-14 bg-[#2D6A4F] hover:bg-[#245a42] gap-2">
              <Plus className="w-5 h-5" />
              Ajouter un moyen de paiement
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl mx-4">
            <DialogHeader>
              <DialogTitle className="font-sans">Ajouter un moyen de paiement</DialogTitle>
            </DialogHeader>

            {!addType ? (
              <div className="grid grid-cols-2 gap-3 py-4">
                <button
                  className="p-4 rounded-2xl border-2 hover:border-[#2D6A4F] transition-colors text-center"
                  onClick={() => setAddType("mobile_money")}
                >
                  <Smartphone className="w-8 h-8 mx-auto mb-2 text-[#2D6A4F]" />
                  <p className="font-medium">Mobile Money</p>
                </button>
                <button
                  className="p-4 rounded-2xl border-2 hover:border-[#2D6A4F] transition-colors text-center"
                  onClick={() => setAddType("card")}
                >
                  <CreditCard className="w-8 h-8 mx-auto mb-2 text-[#2D6A4F]" />
                  <p className="font-medium">Carte</p>
                </button>
                <button
                  className="p-4 rounded-2xl border-2 hover:border-[#2D6A4F] transition-colors text-center"
                  onClick={() => setAddType("bank")}
                >
                  <Building2 className="w-8 h-8 mx-auto mb-2 text-[#2D6A4F]" />
                  <p className="font-medium">Banque</p>
                </button>
                <button
                  className="p-4 rounded-2xl border-2 hover:border-[#2D6A4F] transition-colors text-center"
                  onClick={() => setAddType("crypto")}
                >
                  <Bitcoin className="w-8 h-8 mx-auto mb-2 text-[#2D6A4F]" />
                  <p className="font-medium">Crypto</p>
                </button>
              </div>
            ) : (
              <div className="py-4 space-y-4">
                {addType === "mobile_money" && (
                  <>
                    <div className="space-y-2">
                      <Label>Opérateur</Label>
                      <select className="w-full p-3 rounded-xl border-2 focus:border-[#2D6A4F] outline-none">
                        <option>MTN Mobile Money</option>
                        <option>Orange Money</option>
                        <option>Wave</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Numéro de téléphone</Label>
                      <Input placeholder="+237 6 XX XX XX XX" className="rounded-xl h-12" />
                    </div>
                  </>
                )}
                {addType === "card" && (
                  <>
                    <div className="space-y-2">
                      <Label>Numéro de carte</Label>
                      <Input placeholder="1234 5678 9012 3456" className="rounded-xl h-12" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Expiration</Label>
                        <Input placeholder="MM/AA" className="rounded-xl h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label>CVV</Label>
                        <Input placeholder="123" type="password" className="rounded-xl h-12" />
                      </div>
                    </div>
                  </>
                )}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl h-12 bg-transparent"
                    onClick={() => setAddType(null)}
                  >
                    Retour
                  </Button>
                  <Button
                    className="flex-1 rounded-xl h-12 bg-[#2D6A4F] hover:bg-[#245a42]"
                    onClick={() => {
                      setShowAddDialog(false)
                      setAddType(null)
                    }}
                  >
                    Ajouter
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
