"use client"

import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardNav } from "@/components/dashboard-nav"
import Link from "next/link"
import { AuthProvider } from "@/lib/auth-context"
import { usePathname } from "next/navigation"
import { Home, Wallet, Plus, MessageCircle, User } from "lucide-react"

const navItems = [
  { href: "/dashboard", icon: Home, label: "Accueil" },
  { href: "/dashboard/wallet", icon: Wallet, label: "Portefeuille" },
  { href: "/dashboard/create", icon: Plus, label: "Créer", isMain: true },
  { href: "/dashboard/chat", icon: MessageCircle, label: "Messages" },
  { href: "/dashboard/profile", icon: User, label: "Profil" },
]

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  const pathname = usePathname() // Moved usePathname call to the top level

  if (error || !user) {
    redirect("/login")
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background flex flex-col pb-20">
        {children}
        <DashboardNav />
        {/* Bottom Navigation */}
        {/* Moved DashboardNav above Bottom Navigation for clarity */}
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-2 z-50">
          <div className="max-w-lg mx-auto flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))

              if (item.isMain) {
                return (
                  <Link key={item.href} href={item.href} className="relative -mt-6">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="sr-only">{item.label}</span>
                  </Link>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </AuthProvider>
  )
}
