"use client"

import type React from "react"

import { useState, useRef, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Phone, Video, MoreVertical, Send, Image, Paperclip, Smile } from "lucide-react"

// Mock messages for direct chat
const mockMessages = [
  {
    id: "1",
    senderId: "other",
    content: "Salut! Comment vas-tu?",
    time: "10:00",
    status: "read",
  },
  {
    id: "2",
    senderId: "me",
    content: "Ça va bien merci! Et toi?",
    time: "10:02",
    status: "read",
  },
  {
    id: "3",
    senderId: "other",
    content: "Très bien! Tu as reçu le rappel pour la cotisation de demain?",
    time: "10:05",
    status: "read",
  },
  {
    id: "4",
    senderId: "me",
    content: "Oui, je vais cotiser ce soir. Merci pour le rappel!",
    time: "10:08",
    status: "delivered",
  },
]

const mockContact = {
  id: "3",
  name: "Jean-Baptiste Kamga",
  avatar: "JK",
  status: "En ligne",
}

export default function DirectChatPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now().toString(),
      senderId: "me",
      content: newMessage,
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
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

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex items-center gap-3 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="font-semibold text-primary">{mockContact.avatar}</span>
        </div>

        <div className="flex-1">
          <h1 className="font-semibold">{mockContact.name}</h1>
          <p className="text-xs text-success">{mockContact.status}</p>
        </div>

        <Button variant="ghost" size="icon" className="rounded-full">
          <Phone className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Video className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                message.senderId === "me"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted rounded-bl-md"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.senderId === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              >
                {message.time}
              </p>
            </div>
          </div>
        ))}
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
