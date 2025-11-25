"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { TontineSettings } from "@/lib/actions/settings"
import { updateTontineSettings, regenerateInviteCode, leaveTontine } from "@/lib/actions/settings"
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
  Loader2,
  RefreshCw,
  Check,
} from "lucide-react"

type SettingsPageClientProps = {
  tontineId: string
  initialSettings: TontineSettings
}

export function SettingsPageClient({ tontineId, initialSettings }: SettingsPageClientProps) {
  const router = useRouter()
  const [settings, setSettings] = useState(initialSettings)
  const [notifications, setNotifications] = useState(initialSettings.notifications)
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)

  const isAdmin = ["admin", "president"].includes(settings.user_role)

  const handleCopyCode = () => {
    navigator.clipboard.writeText(settings.invite_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Rejoindre ${settings.name}`,
        text: `Utilisez le code ${settings.invite_code} pour rejoindre notre tontine sur Nkap !`,
        url: `https://nkap.app/join?code=${settings.invite_code}`,
      })
    } else {
      handleCopyCode()
    }
  }

  const handleNotificationChange = async (key: keyof typeof notifications, value: boolean) => {
    const newNotifications = { ...notifications, [key]: value }
    setNotifications(newNotifications)

    setSaving(true)
    try {
      await updateTontineSettings(tontineId, { notifications: newNotifications })
    } catch (error) {
      // Revert on error
      setNotifications(notifications)
    } finally {
      setSaving(false)
    }
  }

  const handleRegenerateCode = async () => {
    setRegenerating(true)
    try {
      const result = await regenerateInviteCode(tontineId)
      if (result.success && result.newCode) {
        setSettings((prev) => ({ ...prev, invite_code: result.newCode! }))
      } else if (result.error) {
        alert(result.error)
      }
    } catch (error) {
      console.error("Error regenerating code:", error)
    } finally {
      setRegenerating(false)
    }
  }

  const handleLeaveTontine = async () => {
    setLeaving(true)
    try {
      const result = await leaveTontine(tontineId)
      if (result.success) {
        router.push("/dashboard/tontines")
      } else if (result.error) {
        alert(result.error)
        setShowLeaveConfirm(false)
      }
    } catch (error) {
      console.error("Error leaving tontine:", error)
    } finally {
      setLeaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex items-center gap-4 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-semibold text-lg">Parametres</h1>
          <p className="text-sm text-muted-foreground">{settings.name}</p>
        </div>
        {saving && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
      </header>

      <div className="p-4 space-y-6">
        {/* Invite Section */}
        <section>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Inviter des membres
          </h2>
          <Card className="p-5 rounded-2xl">
            <Label className="text-sm text-muted-foreground">Code d invitation</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={settings.invite_code}
                readOnly
                className="h-12 rounded-xl text-center font-mono text-lg tracking-widest"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyCode}
                className="h-12 w-12 rounded-xl bg-transparent"
              >
                {copied ? <Check className="w-5 h-5 text-success" /> : <Copy className="w-5 h-5" />}
              </Button>
            </div>
            {copied && <p className="text-sm text-success mt-2">Code copie !</p>}

            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1 h-12 rounded-xl gap-2 bg-transparent">
                <QrCode className="w-4 h-4" />
                QR Code
              </Button>
              <Button variant="outline" className="flex-1 h-12 rounded-xl gap-2 bg-transparent" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
                Partager
              </Button>
            </div>

            {isAdmin && (
              <Button
                variant="ghost"
                className="w-full mt-3 h-10 rounded-xl gap-2 text-muted-foreground"
                onClick={handleRegenerateCode}
                disabled={regenerating}
              >
                {regenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Regenerer le code
              </Button>
            )}
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
                onCheckedChange={(v) => handleNotificationChange("contributions", v)}
              />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Rappels</p>
                <p className="text-sm text-muted-foreground">Rappels avant echeance</p>
              </div>
              <Switch
                checked={notifications.reminders}
                onCheckedChange={(v) => handleNotificationChange("reminders", v)}
              />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Chat</p>
                <p className="text-sm text-muted-foreground">Nouveaux messages</p>
              </div>
              <Switch checked={notifications.chat} onCheckedChange={(v) => handleNotificationChange("chat", v)} />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Annonces</p>
                <p className="text-sm text-muted-foreground">Annonces officielles</p>
              </div>
              <Switch
                checked={notifications.announcements}
                onCheckedChange={(v) => handleNotificationChange("announcements", v)}
              />
            </div>
          </Card>
        </section>

        {/* Privacy & Security */}
        <section>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Confidentialite
          </h2>
          <Card className="rounded-2xl divide-y divide-border">
            <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="text-left">
                <p className="font-medium">Visibilite du profil</p>
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
        {isAdmin && (
          <section>
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Administration
            </h2>
            <Card className="rounded-2xl divide-y divide-border">
              <button
                className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                onClick={() => router.push(`/dashboard/tontines/${tontineId}/rules`)}
              >
                <div className="text-left">
                  <p className="font-medium">Modifier les regles</p>
                  <p className="text-sm text-muted-foreground">Editer le reglement interieur</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                onClick={() => router.push(`/dashboard/tontines/${tontineId}/penalties`)}
              >
                <div className="text-left">
                  <p className="font-medium">Gerer les penalites</p>
                  <p className="text-sm text-muted-foreground">Configurer les amendes</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                onClick={() => router.push(`/dashboard/tontines/${tontineId}/invitations`)}
              >
                <div className="text-left">
                  <p className="font-medium">Demandes d adhesion</p>
                  <p className="text-sm text-muted-foreground">
                    {settings.pending_requests > 0
                      ? `${settings.pending_requests} demande${settings.pending_requests > 1 ? "s" : ""} en attente`
                      : "Aucune demande en attente"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {settings.pending_requests > 0 && (
                    <span className="w-6 h-6 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
                      {settings.pending_requests}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </button>
            </Card>
          </section>
        )}

        {/* Danger Zone */}
        <section>
          <h2 className="font-semibold mb-3 text-destructive flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Zone dangereuse
          </h2>
          <Card className="rounded-2xl border-destructive/20">
            {!showLeaveConfirm ? (
              <button
                className="w-full p-4 flex items-center justify-between hover:bg-destructive/5 transition-colors text-destructive"
                onClick={() => setShowLeaveConfirm(true)}
              >
                <div className="text-left">
                  <p className="font-medium">Quitter la tontine</p>
                  <p className="text-sm opacity-70">Vous perdrez l acces a cette tontine</p>
                </div>
                <Trash2 className="w-5 h-5" />
              </button>
            ) : (
              <div className="p-4 space-y-3">
                <p className="text-sm text-destructive font-medium">Etes-vous sur de vouloir quitter cette tontine ?</p>
                <p className="text-sm text-muted-foreground">
                  Cette action est irreversible. Vous devrez demander une nouvelle invitation pour rejoindre.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl bg-transparent"
                    onClick={() => setShowLeaveConfirm(false)}
                    disabled={leaving}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 rounded-xl"
                    onClick={handleLeaveTontine}
                    disabled={leaving}
                  >
                    {leaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmer"}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </section>
      </div>
    </main>
  )
}
