"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Wallet, Plus, MessageCircle, User } from "lucide-react"

const navItems = [
  { href: "/dashboard", icon: Home, label: "Accueil" },
  { href: "/dashboard/wallet", icon: Wallet, label: "Portefeuille" },
  { href: "/dashboard/create", icon: Plus, label: "Créer", isMain: true },
  { href: "/dashboard/chat", icon: MessageCircle, label: "Messages" },
  { href: "/dashboard/profile", icon: User, label: "Profil" },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="mx-2 mb-2 sm:mx-4 sm:mb-4">
        <div className="glass rounded-2xl sm:rounded-3xl border border-border/30 shadow-xl shadow-black/5 px-2 py-2 sm:px-4 sm:py-3">
          <div className="max-w-lg mx-auto flex items-center justify-around">
            {navItems.map((item, index) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))

              if (item.isMain) {
                return (
                  <Link key={item.href} href={item.href} className="relative -mt-8 sm:-mt-10 group">
                    <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl scale-75 group-hover:scale-100 transition-transform duration-300" />
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30 relative transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/40 group-hover:-translate-y-1">
                      <div className="absolute inset-1 rounded-full bg-gradient-to-t from-transparent to-white/20" />
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground relative z-10" />
                    </div>
                    <span className="sr-only">{item.label}</span>
                  </Link>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-0.5 sm:gap-1 py-1 px-2 sm:px-3 rounded-xl transition-all duration-300 ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div
                    className={`p-1.5 sm:p-2 rounded-xl transition-all duration-300 ${isActive ? "bg-primary/10" : "hover:bg-secondary"}`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium">{item.label}</span>
                  {isActive && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary" />}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
