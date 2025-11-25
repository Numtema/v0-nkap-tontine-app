"use client"

import type React from "react"

import { useState, useRef, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Users, MoreVertical, Send, Image, Paperclip, Smile, Bell, Info } from "lucide-react"

// Mock group messages
const mockGroupMessages = [
  {
    id: "1",
    type: "system",
    content: "Marie Nguema a créé le groupe",
    time: "01 Sep",
  },
  {
    id: "2",
    type: "announcement",
    senderId: "marie",
    senderName: "Marie Nguema",
    senderAvatar: "MN",
    content: "Bienvenue dans notre tontine familiale! N'hésitez pas à poser vos questions ici.",
    time: "01 Sep, 15:00",
    isPinned: true,
  },
  {
    id: "3",
    type: "message",
    senderId: "jean",
    senderName: "Jean-Baptiste",
    senderAvatar: "JK",
    content: "Merci Marie! Heureux de faire partie de cette tontine.",
    time: "01 Sep, 15:30",
  },
  {
    id: "4",
    type: "message",
    senderId: "me",
    senderName: "Moi",
    senderAvatar: "MN",
    content: "Bonjour à tous! 👋",
    time: "01 Sep, 16:00",
  },
  {
    id: "5",
    type: "message",
    senderId: "paul",
    senderName: "Paul Biya",
    senderAvatar: "PB",
    content: "N'oubliez pas la cotisation de demain!",
    time: "Aujourd'hui, 10:30",
  },
  {
    id: "6",
    type: "message",
    senderId: "fatou",
    senderName: "Fatou Sow",
    senderAvatar: "FS",
    content: "Merci pour le rappel Paul!",
    time: "Aujourd'hui, 10:35",
  },
]

const mockGroup = {
  id: "1",
  name: "Famille Nguema",
  memberCount: 12,
}

export default function GroupChatPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [messages, setMessages] = useState(mockGroupMessages)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now().toString(),
      type: "message" as const,
      senderId: "me",
      senderName: "Moi",
      senderAvatar: "MN",
      content: newMessage,
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const pinnedMessage = messages.find((m) => "isPinned" in m && m.isPinned)

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex items-center gap-3 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-primary" />
        </div>

        <div className="flex-1">
          <h1 className="font-semibold">{mockGroup.name}</h1>
          <p className="text-xs text-muted-foreground">{mockGroup.memberCount} membres</p>
        </div>

        <Button variant="ghost" size="icon" className="rounded-full">
          <Info className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </header>

      {/* Pinned Message */}
      {pinnedMessage && "content" in pinnedMessage && (
        <div className="bg-accent/10 border-b border-accent/20 p-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-accent-foreground shrink-0" />
          <p className="text-sm truncate flex-1">{pinnedMessage.content}</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          if (message.type === "system") {
            return (
              <div key={message.id} className="text-center">
                <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">{message.content}</span>
              </div>
            )
          }

          if (message.type === "announcement") {
            return (
              <Card key={message.id} className="p-4 rounded-2xl bg-accent/10 border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="w-4 h-4 text-accent-foreground" />
                  <span className="text-sm font-medium text-accent-foreground">Annonce</span>
                </div>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {"senderName" in message && message.senderName} • {message.time}
                </p>
              </Card>
            )
          }

          const isMe = message.senderId === "me"

          return (
            <div key={message.id} className={`flex gap-2 ${isMe ? "justify-end" : ""}`}>
              {!isMe && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 self-end">
                  <span className="text-xs font-medium text-primary">
                    {"senderAvatar" in message && message.senderAvatar}
                  </span>
                </div>
              )}
              <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                {!isMe && (
                  <p className="text-xs text-muted-foreground mb-1 ml-1">
                    {"senderName" in message && message.senderName}
                  </p>
                )}
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    isMe ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted rounded-bl-md"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <p className={`text-xs text-muted-foreground mt-1 ${isMe ? "text-right mr-1" : "ml-1"}`}>
                  {message.time}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-card border-t border-border p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full shrink-0">
            <Paperclip className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full shrink-0">
            <Image className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder="Votre message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-12 rounded-full pr-12"
            />
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full">
              <Smile className="w-5 h-5" />
            </Button>
          </div>
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="rounded-full w-12 h-12 shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </main>
  )
}
