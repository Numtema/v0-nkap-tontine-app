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

  // Get user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  // Get profile
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
    // Try to get user's tontines
    const { data: memberships } = await supabase
      .from("tontine_members")
      .select(`
        *,
        tontine:tontines(*)
      `)
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
    // Tables don't exist yet - continue with empty array
  }

  try {
    // Get recent activity
    const { data: recentContributions } = await supabase
      .from("contributions")
      .select(`
        *,
        tontine:tontines(name),
        profile:profiles(full_name)
      `)
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
    // Tables don't exist yet - continue with empty array
  }

  try {
    // Get notifications count
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
    <main className="flex-1">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-6 pb-28 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-lg font-semibold">{initials}</span>
            </div>
            <div>
              <p className="text-sm text-primary-foreground/70">Bonjour,</p>
              <h1 className="font-semibold">{userName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Link href="/dashboard/notifications">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-primary-foreground hover:bg-primary-foreground/20 relative"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-primary" />
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Balance Card */}
        <div className="relative">
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
      <div className="px-4 -mt-16 space-y-6 pb-6">
        {/* Quick Actions */}
        <QuickActions />

        {/* My Tontines */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Mes Tontines</h2>
            <Link href="/dashboard/tontines" className="text-sm text-primary font-medium">
              Voir tout
            </Link>
          </div>
          {tontines.length > 0 ? (
            <div className="space-y-3">
              {tontines.map((tontine) => (
                <TontineCard key={tontine.id} tontine={tontine} />
              ))}
            </div>
          ) : (
            <Card className="p-6 rounded-2xl text-center">
              <p className="text-muted-foreground mb-4">Vous n'avez pas encore de tontine</p>
              <div className="flex gap-3 justify-center">
                <Link href="/dashboard/create">
                  <Button className="rounded-full">Créer une tontine</Button>
                </Link>
                <Link href="/dashboard/join">
                  <Button variant="outline" className="rounded-full bg-transparent">
                    Rejoindre
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Activité récente</h2>
            <Link href="/dashboard/activity" className="text-sm text-primary font-medium">
              Voir tout
            </Link>
          </div>
          {activities.length > 0 ? (
            <ActivityFeed activities={activities} />
          ) : (
            <Card className="p-6 rounded-2xl text-center">
              <p className="text-muted-foreground">Aucune activité récente</p>
            </Card>
          )}
        </section>

        {/* Exchange Rate Info */}
        <Card className="p-4 rounded-2xl bg-accent/10 border-accent/20">
          <div className="flex items-center gap-3">
            <NkapLogo size="sm" showText={false} />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Taux actuel</p>
              <p className="font-semibold">
                1 Nkap = {country.nkapRate} {country.currencySymbol}
              </p>
            </div>
            <Link href="/dashboard/wallet/rates">
              <Button variant="outline" size="sm" className="rounded-full text-xs bg-transparent">
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
