import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NkapLogo } from "@/components/nkap-logo"
import { NkapBalanceCard } from "@/components/nkap-balance-card"
import { QuickActions } from "@/components/quick-actions"
import { TontineCard } from "@/components/tontine-card"
import { ActivityFeed } from "@/components/activity-feed"
import { Bell, Search } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { SUPPORTED_COUNTRIES } from "@/lib/types"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  let tontines: Array<{
    id: string
    name: string
    slogan: string
    contributionAmount: number
    frequency: "daily" | "weekly" | "biweekly" | "monthly" | "yearly"
    currentMembers: number
    maxMembers: number
    status: "pending" | "active" | "completed"
    nextContribution: Date
    myContributionStatus: "pending" | "paid" | "late"
  }> = []

  let activities: Array<{
    id: string
    type: "contribution" | "payout" | "join" | "penalty" | "vote"
    title: string
    description: string
    tontineName: string
    time: string
  }> = []

  let notificationCount = 0

  try {
    const { data: memberships } = await supabase
      .from("tontine_members")
      .select(`*, tontine:tontines(*)`)
      .eq("user_id", user.id)
      .in("status", ["active", "pending"])
      .limit(3)

    if (memberships) {
      tontines = memberships.map((m) => ({
        id: m.tontine?.id || "",
        name: m.tontine?.name || "",
        slogan: m.tontine?.slogan || "",
        contributionAmount: m.tontine?.contribution_amount || 0,
        frequency: m.tontine?.frequency as "daily" | "weekly" | "biweekly" | "monthly" | "yearly",
        currentMembers: 0,
        maxMembers: m.tontine?.max_members || 0,
        status: m.tontine?.status as "pending" | "active" | "completed",
        nextContribution: m.tontine?.next_session_date ? new Date(m.tontine.next_session_date) : new Date(),
        myContributionStatus: "pending" as const,
      }))
    }
  } catch {
    // Tables don't exist yet
  }

  try {
    const { data: recentContributions } = await supabase
      .from("contributions")
      .select(`*, tontine:tontines(name), profile:profiles(full_name)`)
      .order("created_at", { ascending: false })
      .limit(5)

    if (recentContributions) {
      activities = recentContributions.map((c) => ({
        id: c.id,
        type: "contribution" as const,
        title: "Contribution reçue",
        description: `${c.profile?.full_name || "Membre"} a contribué ${c.amount} Nkap`,
        tontineName: c.tontine?.name || "",
        time: getTimeAgo(new Date(c.created_at)),
      }))
    }
  } catch {
    // Tables don't exist yet
  }

  try {
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false)

    notificationCount = count || 0
  } catch {
    // Table doesn't exist yet
  }

  const country = SUPPORTED_COUNTRIES.find((c) => c.code === profile?.country) || SUPPORTED_COUNTRIES[0]
  const userName = profile?.full_name || user.email?.split("@")[0] || "Utilisateur"
  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <main className="flex-1 min-h-[100dvh] safe-top">
      {/* Header with gradient background */}
      <header className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground p-4 sm:p-6 pb-28 sm:pb-32 rounded-b-[2rem] sm:rounded-b-[2.5rem] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center ring-2 ring-white/30">
              <span className="text-base sm:text-lg font-semibold">{initials}</span>
            </div>
            <div>
              <p className="text-sm text-primary-foreground/70">Bonjour,</p>
              <h1 className="font-semibold text-base sm:text-lg">{userName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-primary-foreground hover:bg-white/20 transition-colors"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Link href="/dashboard/notifications">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-primary-foreground hover:bg-white/20 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent rounded-full ring-2 ring-primary animate-pulse" />
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Balance Card */}
        <div className="relative z-10">
          <NkapBalanceCard
            balance={profile?.nkap_balance || 0}
            lockedBalance={0}
            country={country}
            showBalance={true}
            onToggleVisibility={() => {}}
          />
        </div>
      </header>

      {/* Content */}
      <div className="px-4 sm:px-6 -mt-14 sm:-mt-16 space-y-6 pb-28 sm:pb-32">
        {/* Quick Actions */}
        <div className="animate-slide-up">
          <QuickActions />
        </div>

        {/* My Tontines */}
        <section className="animate-slide-up stagger-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Mes Tontines</h2>
            <Link
              href="/dashboard/tontines"
              className="text-sm text-primary font-medium hover:text-primary/80 transition-colors"
            >
              Voir tout
            </Link>
          </div>
          {tontines.length > 0 ? (
            <div className="space-y-3">
              {tontines.map((tontine, index) => (
                <div key={tontine.id} className={`animate-slide-up stagger-${index + 1}`}>
                  <TontineCard tontine={tontine} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-6 rounded-2xl sm:rounded-3xl text-center glass border-border/30">
              <p className="text-muted-foreground mb-4">Vous n'avez pas encore de tontine</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link href="/dashboard/create">
                  <Button className="rounded-full bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                    Créer une tontine
                  </Button>
                </Link>
                <Link href="/dashboard/join">
                  <Button
                    variant="outline"
                    className="rounded-full bg-card/50 backdrop-blur border-border/50 hover:bg-card hover:border-primary/30 transition-all"
                  >
                    Rejoindre
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </section>

        {/* Recent Activity */}
        <section className="animate-slide-up stagger-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Activité récente</h2>
            <Link
              href="/dashboard/activity"
              className="text-sm text-primary font-medium hover:text-primary/80 transition-colors"
            >
              Voir tout
            </Link>
          </div>
          {activities.length > 0 ? (
            <ActivityFeed activities={activities} />
          ) : (
            <Card className="p-6 rounded-2xl sm:rounded-3xl text-center glass border-border/30">
              <p className="text-muted-foreground">Aucune activité récente</p>
            </Card>
          )}
        </section>

        {/* Exchange Rate Info */}
        <Card className="p-4 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-secondary/50 to-secondary/30 border-primary/10 animate-slide-up stagger-3">
          <div className="flex items-center gap-3">
            <NkapLogo size="sm" showText={false} animated={false} />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Taux actuel</p>
              <p className="font-semibold text-foreground">
                1 Nkap = {country.nkapRate} {country.currencySymbol}
              </p>
            </div>
            <Link href="/dashboard/wallet/rates">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs bg-card/50 backdrop-blur border-border/50 hover:bg-card hover:border-primary/30 transition-all"
              >
                Historique
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  )
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  if (seconds < 60) return "À l'instant"
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} j`
  return `${Math.floor(seconds / 604800)} sem`
}
