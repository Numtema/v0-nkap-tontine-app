"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Bell, Check, Trash2, Settings } from "lucide-react"

const mockNotifications = [
  {
    id: "1",
    type: "contribution",
    title: "Cotisation reçue",
    message: "Jean-Baptiste a contribué 500 Nkap à Famille Nguema",
    time: "2 min",
    read: false,
  },
  {
    id: "2",
    type: "reminder",
    title: "Rappel de cotisation",
    message: "Votre cotisation pour Diaspora Paris est due dans 2 jours",
    time: "1 heure",
    read: false,
  },
  {
    id: "3",
    type: "system",
    title: "Bienvenue sur Nkap",
    message: "Complétez votre profil pour commencer à utiliser Nkap",
    time: "Hier",
    read: true,
  },
  {
    id: "4",
    type: "tontine",
    title: "Nouvelle demande",
    message: "Paul Biya souhaite rejoindre Famille Nguema",
    time: "Hier",
    read: true,
  },
]

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(mockNotifications)

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex items-center gap-4 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-semibold text-lg">Notifications</h1>
          {unreadCount > 0 && <p className="text-sm text-muted-foreground">{unreadCount} non lues</p>}
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      {/* Actions */}
      {unreadCount > 0 && (
        <div className="p-4 border-b border-border">
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="rounded-full gap-2 bg-transparent">
            <Check className="w-4 h-4" />
            Tout marquer comme lu
          </Button>
        </div>
      )}

      {/* Notifications List */}
      <div className="p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune notification</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 rounded-2xl ${!notification.read ? "bg-primary/5 border-primary/20" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    !notification.read ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium">{notification.title}</h3>
                    <span className="text-xs text-muted-foreground shrink-0">{notification.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteNotification(notification.id)}
                  className="rounded-full shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </main>
  )
}
