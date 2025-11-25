"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Settings,
  Bell,
  Lock,
  Users,
  Trash2,
  ChevronRight,
  Copy,
  QrCode,
  Share2,
  AlertTriangle,
} from "lucide-react"

export default function TontineSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [notifications, setNotifications] = useState({
    contributions: true,
    reminders: true,
    chat: true,
    announcements: true,
  })
  const [inviteCode] = useState("FAMNGU2025")
  const [copied, setCopied] = useState(false)

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex items-center gap-4 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-semibold text-lg">Paramètres</h1>
          <p className="text-sm text-muted-foreground">Famille Nguema</p>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Invite Section */}
        <section>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Inviter des membres
          </h2>
          <Card className="p-5 rounded-2xl">
            <Label className="text-sm text-muted-foreground">Code d'invitation</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={inviteCode}
                readOnly
                className="h-12 rounded-xl text-center font-mono text-lg tracking-widest"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyCode}
                className="h-12 w-12 rounded-xl bg-transparent"
              >
                <Copy className={`w-5 h-5 ${copied ? "text-success" : ""}`} />
              </Button>
            </div>
            {copied && <p className="text-sm text-success mt-2">Code copié !</p>}

            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1 h-12 rounded-xl gap-2 bg-transparent">
                <QrCode className="w-4 h-4" />
                QR Code
              </Button>
              <Button variant="outline" className="flex-1 h-12 rounded-xl gap-2 bg-transparent">
                <Share2 className="w-4 h-4" />
                Partager
              </Button>
            </div>
          </Card>
        </section>

        {/* Notifications */}
        <section>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </h2>
          <Card className="rounded-2xl divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Cotisations</p>
                <p className="text-sm text-muted-foreground">Alertes de paiement</p>
              </div>
              <Switch
                checked={notifications.contributions}
                onCheckedChange={(v) => setNotifications((p) => ({ ...p, contributions: v }))}
              />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Rappels</p>
                <p className="text-sm text-muted-foreground">Rappels avant échéance</p>
              </div>
              <Switch
                checked={notifications.reminders}
                onCheckedChange={(v) => setNotifications((p) => ({ ...p, reminders: v }))}
              />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Chat</p>
                <p className="text-sm text-muted-foreground">Nouveaux messages</p>
              </div>
              <Switch
                checked={notifications.chat}
                onCheckedChange={(v) => setNotifications((p) => ({ ...p, chat: v }))}
              />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Annonces</p>
                <p className="text-sm text-muted-foreground">Annonces officielles</p>
              </div>
              <Switch
                checked={notifications.announcements}
                onCheckedChange={(v) => setNotifications((p) => ({ ...p, announcements: v }))}
              />
            </div>
          </Card>
        </section>

        {/* Privacy & Security */}
        <section>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Confidentialité
          </h2>
          <Card className="rounded-2xl divide-y divide-border">
            <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="text-left">
                <p className="font-medium">Visibilité du profil</p>
                <p className="text-sm text-muted-foreground">Visible par les membres</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="text-left">
                <p className="font-medium">Historique de contributions</p>
                <p className="text-sm text-muted-foreground">Visible par le bureau</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </Card>
        </section>

        {/* Admin Actions */}
        <section>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Administration
          </h2>
          <Card className="rounded-2xl divide-y divide-border">
            <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="text-left">
                <p className="font-medium">Modifier les règles</p>
                <p className="text-sm text-muted-foreground">Éditer le règlement intérieur</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="text-left">
                <p className="font-medium">Gérer les pénalités</p>
                <p className="text-sm text-muted-foreground">Configurer les amendes</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="text-left">
                <p className="font-medium">Demandes d'adhésion</p>
                <p className="text-sm text-muted-foreground">3 demandes en attente</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </Card>
        </section>

        {/* Danger Zone */}
        <section>
          <h2 className="font-semibold mb-3 text-destructive flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Zone dangereuse
          </h2>
          <Card className="rounded-2xl border-destructive/20">
            <button className="w-full p-4 flex items-center justify-between hover:bg-destructive/5 transition-colors text-destructive">
              <div className="text-left">
                <p className="font-medium">Quitter la tontine</p>
                <p className="text-sm opacity-70">Vous perdrez l'accès à cette tontine</p>
              </div>
              <Trash2 className="w-5 h-5" />
            </button>
          </Card>
        </section>
      </div>
    </main>
  )
}
