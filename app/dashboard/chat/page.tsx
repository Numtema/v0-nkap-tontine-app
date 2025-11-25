"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, MessageCircle, Users, Bell, Pin } from "lucide-react"

const mockConversations = [
  {
    id: "1",
    type: "group",
    name: "Famille Nguema",
    avatar: "FN",
    lastMessage: "N'oubliez pas la cotisation de demain!",
    lastMessageTime: "10:30",
    unreadCount: 3,
    isPinned: true,
  },
  {
    id: "2",
    type: "group",
    name: "Collègues Tech",
    avatar: "CT",
    lastMessage: "Le prochain bénéficiaire est Paul",
    lastMessageTime: "Hier",
    unreadCount: 0,
    isPinned: true,
  },
  {
    id: "3",
    type: "direct",
    name: "Jean-Baptiste Kamga",
    avatar: "JK",
    lastMessage: "Merci pour le rappel!",
    lastMessageTime: "Hier",
    unreadCount: 1,
    isPinned: false,
  },
  {
    id: "4",
    type: "group",
    name: "Diaspora Paris",
    avatar: "DP",
    lastMessage: "Bienvenue aux nouveaux membres",
    lastMessageTime: "Lun",
    unreadCount: 0,
    isPinned: false,
  },
  {
    id: "5",
    type: "announcement",
    name: "Annonces Nkap",
    avatar: "NK",
    lastMessage: "Nouvelle fonctionnalité disponible!",
    lastMessageTime: "Sam",
    unreadCount: 0,
    isPinned: false,
  },
]

export default function ChatPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "groups" | "direct">("all")

  const filteredConversations = mockConversations.filter((c) => {
    if (filter === "groups" && c.type !== "group") return false
    if (filter === "direct" && c.type !== "direct") return false
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const pinnedConversations = filteredConversations.filter((c) => c.isPinned)
  const otherConversations = filteredConversations.filter((c) => !c.isPinned)

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <h1 className="text-xl font-semibold mb-4">Messages</h1>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 rounded-xl pl-12"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {[
            { value: "all", label: "Tout", icon: MessageCircle },
            { value: "groups", label: "Groupes", icon: Users },
            { value: "direct", label: "Direct", icon: MessageCircle },
          ].map((f) => {
            const Icon = f.icon
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value as typeof filter)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === f.value ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                {f.label}
              </button>
            )
          })}
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Pinned Conversations */}
        {pinnedConversations.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Pin className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-medium text-muted-foreground">Épinglés</h2>
            </div>
            <div className="space-y-2">
              {pinnedConversations.map((conversation) => (
                <ConversationItem key={conversation.id} conversation={conversation} />
              ))}
            </div>
          </section>
        )}

        {/* Other Conversations */}
        {otherConversations.length > 0 && (
          <section>
            {pinnedConversations.length > 0 && (
              <h2 className="text-sm font-medium text-muted-foreground mb-3">Récents</h2>
            )}
            <div className="space-y-2">
              {otherConversations.map((conversation) => (
                <ConversationItem key={conversation.id} conversation={conversation} />
              ))}
            </div>
          </section>
        )}

        {filteredConversations.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune conversation trouvée</p>
          </div>
        )}
      </div>
    </main>
  )
}

function ConversationItem({ conversation }: { conversation: (typeof mockConversations)[0] }) {
  const href =
    conversation.type === "group" ? `/dashboard/tontines/${conversation.id}/chat` : `/dashboard/chat/${conversation.id}`

  return (
    <Link href={href}>
      <Card className="p-4 rounded-2xl hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
              conversation.type === "announcement"
                ? "bg-primary text-primary-foreground"
                : conversation.type === "group"
                  ? "bg-secondary/20"
                  : "bg-primary/10"
            }`}
          >
            {conversation.type === "announcement" ? (
              <Bell className="w-5 h-5" />
            ) : conversation.type === "group" ? (
              <Users className="w-5 h-5 text-secondary-foreground" />
            ) : (
              <span className="font-semibold text-primary">{conversation.avatar}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-medium truncate">{conversation.name}</h3>
              <span className="text-xs text-muted-foreground shrink-0">{conversation.lastMessageTime}</span>
            </div>
            <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
          </div>
          {conversation.unreadCount > 0 && (
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-xs font-medium text-primary-foreground">{conversation.unreadCount}</span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
