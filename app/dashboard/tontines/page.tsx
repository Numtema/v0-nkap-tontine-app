import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TontinesPageClient } from "./tontines-client"

export default async function TontinesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get user's tontines
  const { data: memberships } = await supabase
    .from("tontine_members")
    .select(`
      *,
      tontine:tontines(*)
    `)
    .eq("user_id", user.id)
    .neq("status", "removed")

  const tontines =
    memberships?.map((m) => ({
      id: m.tontine.id,
      name: m.tontine.name,
      slogan: m.tontine.slogan || "",
      contributionAmount: m.tontine.contribution_amount,
      frequency: m.tontine.frequency as "daily" | "weekly" | "biweekly" | "monthly" | "yearly",
      currentMembers: 0, // Will be calculated
      maxMembers: m.tontine.max_members,
      status: m.tontine.status as "active" | "pending" | "completed",
      nextContribution: m.tontine.next_session_date ? new Date(m.tontine.next_session_date) : new Date(),
      myContributionStatus: "pending" as "pending" | "paid" | "late",
      myRole: m.role,
    })) || []

  // Get member counts for each tontine
  for (const tontine of tontines) {
    const { count } = await supabase
      .from("tontine_members")
      .select("*", { count: "exact", head: true })
      .eq("tontine_id", tontine.id)
      .eq("status", "active")

    tontine.currentMembers = count || 0
  }

  return <TontinesPageClient initialTontines={tontines} />
}
