"use client"

import { useState } from "react"
import { ArrowLeft, Key, Fingerprint, Smartphone, Shield, ChevronRight, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function SecurityPage() {
  const [biometricEnabled, setBiometricEnabled] = useState(true)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
          <h1 className="text-xl font-semibold font-sans">Sécurité</h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Password Section */}
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-3">Authentification</h2>
          <div className="space-y-3">
            <Card
              className="rounded-2xl p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setShowPasswordDialog(true)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#2D6A4F]/10 flex items-center justify-center">
                  <Key className="w-6 h-6 text-[#2D6A4F]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Mot de passe</p>
                  <p className="text-sm text-gray-500">Dernière modification il y a 30 jours</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Card>

            <Card
              className="rounded-2xl p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setShowPinDialog(true)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F4A261]/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#F4A261]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Code PIN de transaction</p>
                  <p className="text-sm text-gray-500">Requis pour les paiements</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Card>
          </div>
        </div>

        {/* Biometric Section */}
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-3">Connexion rapide</h2>
          <Card className="rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E9C46A]/10 flex items-center justify-center">
                <Fingerprint className="w-6 h-6 text-[#E9C46A]" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Biométrie</p>
                <p className="text-sm text-gray-500">Empreinte digitale ou Face ID</p>
              </div>
              <Switch
                checked={biometricEnabled}
                onCheckedChange={setBiometricEnabled}
                className="data-[state=checked]:bg-[#2D6A4F]"
              />
            </div>
          </Card>
        </div>

        {/* Two Factor Section */}
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-3">Sécurité avancée</h2>
          <Card className="rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#2D6A4F]/10 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-[#2D6A4F]" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Authentification à deux facteurs</p>
                <p className="text-sm text-gray-500">Code SMS pour chaque connexion</p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
                className="data-[state=checked]:bg-[#2D6A4F]"
              />
            </div>
          </Card>
        </div>

        {/* Security Tips */}
        <Card className="rounded-2xl p-4 bg-[#2D6A4F]/5 border-[#2D6A4F]/20">
          <h3 className="font-semibold text-[#2D6A4F] mb-2">Conseils de sécurité</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Ne partagez jamais votre code PIN</li>
            <li>• Utilisez un mot de passe unique pour Nkap</li>
            <li>• Activez la biométrie pour plus de sécurité</li>
            <li>• Vérifiez régulièrement vos transactions</li>
          </ul>
        </Card>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="rounded-3xl mx-4">
          <DialogHeader>
            <DialogTitle className="font-sans">Changer le mot de passe</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Mot de passe actuel</Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} className="rounded-xl h-12 pr-12" />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Nouveau mot de passe</Label>
              <Input type="password" className="rounded-xl h-12" />
            </div>
            <div className="space-y-2">
              <Label>Confirmer le nouveau mot de passe</Label>
              <Input type="password" className="rounded-xl h-12" />
            </div>
            <Button
              className="w-full rounded-xl h-12 bg-[#2D6A4F] hover:bg-[#245a42] mt-4"
              onClick={() => setShowPasswordDialog(false)}
            >
              Mettre à jour
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change PIN Dialog */}
      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent className="rounded-3xl mx-4">
          <DialogHeader>
            <DialogTitle className="font-sans">Changer le code PIN</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Code PIN actuel</Label>
              <Input
                type="password"
                maxLength={4}
                className="rounded-xl h-12 text-center text-2xl tracking-widest"
                placeholder="••••"
              />
            </div>
            <div className="space-y-2">
              <Label>Nouveau code PIN</Label>
              <Input
                type="password"
                maxLength={4}
                className="rounded-xl h-12 text-center text-2xl tracking-widest"
                placeholder="••••"
              />
            </div>
            <div className="space-y-2">
              <Label>Confirmer le nouveau code PIN</Label>
              <Input
                type="password"
                maxLength={4}
                className="rounded-xl h-12 text-center text-2xl tracking-widest"
                placeholder="••••"
              />
            </div>
            <Button
              className="w-full rounded-xl h-12 bg-[#2D6A4F] hover:bg-[#245a42] mt-4"
              onClick={() => setShowPinDialog(false)}
            >
              Mettre à jour
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
