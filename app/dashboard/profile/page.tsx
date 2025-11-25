import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileClient } from "@/components/profile-client"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  // Get profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get tontine count
  const { count: tontineCount } = await supabase
    .from("tontine_members")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "active")

  // Calculate months active
  const createdAt = profile?.created_at ? new Date(profile.created_at) : new Date()
  const monthsActive = Math.max(
    1,
    Math.floor((new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)),
  )

  return (
    <ProfileClient
      user={{
        id: user.id,
        email: user.email || "",
        name: profile?.full_name || user.email?.split("@")[0] || "",
        phone: profile?.phone || "",
        avatarUrl: profile?.avatar_url || "",
        country: profile?.country || "CM",
        reputationScore: profile?.reputation_score || 100,
      }}
      stats={{
        tontineCount: tontineCount || 0,
        monthsActive,
        reputation: (profile?.reputation_score || 100) / 20,
      }}
    />
  )
}
