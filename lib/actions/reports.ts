"use server"

import { createClient } from "@/lib/supabase/server"

export type ReportData = {
  totalContributions: number
  totalDistributed: number
  currentBalance: number
  contributionRate: number
  averageDelay: number
  membersOnTime: number
  membersLate: number
}

export type SessionReport = {
  id: string
  type: "session" | "financial"
  title: string
  date: Date
  status: "completed" | "pending"
  session_number: number
  total_collected: number
  beneficiary_name: string | null
}

export async function getTontineReportData(tontineId: string): Promise<{
  stats: ReportData
  reports: SessionReport[]
  tontineName: string
  error: string | null
}> {
  const supabase = await createClient()

  // Get tontine info
  const { data: tontine, error: tontineError } = await supabase
    .from("tontines")
    .select("name, contribution_amount")
    .eq("id", tontineId)
    .single()

  if (tontineError) {
    return {
      stats: {
        totalContributions: 0,
        totalDistributed: 0,
        currentBalance: 0,
        contributionRate: 0,
        averageDelay: 0,
        membersOnTime: 0,
        membersLate: 0,
      },
      reports: [],
      tontineName: "",
      error: tontineError.message,
    }
  }

  // Get all contributions
  const { data: contributions } = await supabase
    .from("contributions")
    .select("amount, status, paid_at, due_date, member:tontine_members(user:profiles(full_name))")
    .eq("tontine_id", tontineId)

  // Get all caisses for total balance
  const { data: caisses } = await supabase.from("caisses").select("balance").eq("tontine_id", tontineId)

  // Get draw results for distributions
  const { data: draws } = await supabase
    .from("draws")
    .select("*, results:draw_results(*, member:tontine_members(user:profiles(full_name)))")
    .eq("tontine_id", tontineId)
    .order("created_at", { ascending: false })

  // Calculate stats
  const totalContributions = contributions?.reduce((sum, c) => sum + (c.status === "completed" ? c.amount : 0), 0) || 0
  const totalBalance = caisses?.reduce((sum, c) => sum + c.balance, 0) || 0
  const totalDistributed = totalContributions - totalBalance

  // Calculate contribution rate
  const completedCount = contributions?.filter((c) => c.status === "completed").length || 0
  const totalCount = contributions?.length || 1
  const contributionRate = Math.round((completedCount / totalCount) * 100)

  // Calculate average delay (in days)
  const lateContributions =
    contributions?.filter((c) => {
      if (!c.paid_at || !c.due_date) return false
      return new Date(c.paid_at) > new Date(c.due_date)
    }) || []

  const totalDelayDays = lateContributions.reduce((sum, c) => {
    const diff = new Date(c.paid_at!).getTime() - new Date(c.due_date!).getTime()
    return sum + diff / (1000 * 60 * 60 * 24)
  }, 0)
  const averageDelay = lateContributions.length > 0 ? totalDelayDays / lateContributions.length : 0

  // Get unique members and their status
  const { data: members } = await supabase
    .from("tontine_members")
    .select("id, user:profiles(full_name)")
    .eq("tontine_id", tontineId)
    .eq("status", "active")

  const membersWithStatus = await Promise.all(
    (members || []).map(async (member) => {
      const { data: pendingContribs } = await supabase
        .from("contributions")
        .select("id")
        .eq("member_id", member.id)
        .eq("status", "pending")
      return {
        ...member,
        hasLatePayment: (pendingContribs?.length || 0) > 0,
      }
    }),
  )

  const membersOnTime = membersWithStatus.filter((m) => !m.hasLatePayment).length
  const membersLate = membersWithStatus.filter((m) => m.hasLatePayment).length

  // Build session reports from draws
  const reports: SessionReport[] = (draws || []).map((draw, index) => {
    const beneficiary = draw.results?.[0]?.member?.user?.full_name || null
    return {
      id: draw.id,
      type: "session" as const,
      title: `Rapport Session #${draws!.length - index}`,
      date: new Date(draw.created_at),
      status: draw.status === "completed" ? ("completed" as const) : ("pending" as const),
      session_number: draws!.length - index,
      total_collected: tontine.contribution_amount * (members?.length || 0),
      beneficiary_name: beneficiary,
    }
  })

  return {
    stats: {
      totalContributions,
      totalDistributed,
      currentBalance: totalBalance,
      contributionRate,
      averageDelay: Math.round(averageDelay * 10) / 10,
      membersOnTime,
      membersLate,
    },
    reports,
    tontineName: tontine.name,
    error: null,
  }
}

export async function exportTontineReport(
  tontineId: string,
  format: "pdf" | "csv",
): Promise<{ success: boolean; url?: string; error?: string }> {
  // In production, this would generate and return a download URL
  // For now, we simulate success
  return { success: true, url: `/api/reports/${tontineId}?format=${format}` }
}
