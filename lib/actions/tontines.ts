"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function createTontine(data: {
  name: string
  description?: string
  slogan?: string
  country: string
  contribution_amount: number
  frequency: string
  membership_fee?: number
  late_penalty_percent?: number
  min_members?: number
  max_members?: number
  rules?: object
  caisses?: Array<{
    name: string
    type: string
    contribution_amount: number
    is_mandatory: boolean
  }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  // Create tontine
  const { data: tontine, error: tontineError } = await supabase
    .from("tontines")
    .insert({
      name: data.name,
      description: data.description,
      slogan: data.slogan,
      country: data.country,
      contribution_amount: data.contribution_amount,
      frequency: data.frequency,
      membership_fee: data.membership_fee || 0,
      late_penalty_percent: data.late_penalty_percent || 10,
      min_members: data.min_members || 5,
      max_members: data.max_members || 50,
      rules: data.rules,
      created_by: user.id,
      invite_code: generateInviteCode(),
      status: "pending",
    })
    .select()
    .single()

  if (tontineError) {
    return { error: tontineError.message }
  }

  // Add creator as admin member
  await supabase.from("tontine_members").insert({
    tontine_id: tontine.id,
    user_id: user.id,
    role: "admin",
    status: "active",
    order_number: 1,
  })

  // Create default main caisse
  await supabase.from("caisses").insert({
    tontine_id: tontine.id,
    name: "Caisse Principale",
    type: "main",
    contribution_amount: data.contribution_amount,
    is_mandatory: true,
  })

  // Create additional caisses if provided
  if (data.caisses && data.caisses.length > 0) {
    const caissesToInsert = data.caisses.map((caisse) => ({
      tontine_id: tontine.id,
      name: caisse.name,
      type: caisse.type,
      contribution_amount: caisse.contribution_amount,
      is_mandatory: caisse.is_mandatory,
    }))
    await supabase.from("caisses").insert(caissesToInsert)
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/tontines")

  return { success: true, tontine }
}

export async function joinTontine(inviteCode: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  // Find tontine by invite code
  const { data: tontine, error: tontineError } = await supabase
    .from("tontines")
    .select("*")
    .eq("invite_code", inviteCode.toUpperCase())
    .single()

  if (tontineError || !tontine) {
    return { error: "Code d'invitation invalide" }
  }

  // Check if already a member
  const { data: existingMember } = await supabase
    .from("tontine_members")
    .select("id")
    .eq("tontine_id", tontine.id)
    .eq("user_id", user.id)
    .single()

  if (existingMember) {
    return { error: "Vous êtes déjà membre de cette tontine" }
  }

  // Check if tontine is full
  const { count } = await supabase
    .from("tontine_members")
    .select("*", { count: "exact", head: true })
    .eq("tontine_id", tontine.id)

  if (count && count >= tontine.max_members) {
    return { error: "Cette tontine est complète" }
  }

  // Create join request or add directly based on tontine settings
  const { error: joinError } = await supabase.from("join_requests").insert({
    tontine_id: tontine.id,
    user_id: user.id,
    status: "pending",
  })

  if (joinError) {
    return { error: joinError.message }
  }

  revalidatePath("/dashboard")

  return { success: true, tontine }
}

export async function getUserTontines() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data: memberships } = await supabase
    .from("tontine_members")
    .select(`
      *,
      tontine:tontines(*)
    `)
    .eq("user_id", user.id)
    .eq("status", "active")

  return (
    memberships?.map((m) => ({
      ...m.tontine,
      myRole: m.role,
      myStatus: m.status,
    })) || []
  )
}

export async function getTontineDetails(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: tontine } = await supabase
    .from("tontines")
    .select(`
      *,
      members:tontine_members(
        *,
        profile:profiles(*)
      ),
      caisses(*),
      president:profiles!tontines_president_id_fkey(*),
      secretary:profiles!tontines_secretary_id_fkey(*),
      treasurer:profiles!tontines_treasurer_id_fkey(*)
    `)
    .eq("id", id)
    .single()

  return tontine
}

export async function makeContribution(data: {
  tontine_id: string
  caisse_id: string
  amount: number
  payment_method: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  // Get tontine details
  const { data: tontine } = await supabase.from("tontines").select("current_cycle").eq("id", data.tontine_id).single()

  // Create contribution
  const { error: contributionError } = await supabase.from("contributions").insert({
    tontine_id: data.tontine_id,
    caisse_id: data.caisse_id,
    user_id: user.id,
    amount: data.amount,
    cycle_number: tontine?.current_cycle || 1,
    payment_method: data.payment_method,
    status: "completed",
    transaction_ref: `TXN-${Date.now()}`,
  })

  if (contributionError) {
    return { error: contributionError.message }
  }

  // Update caisse balance
  await supabase.rpc("increment_caisse_balance", {
    caisse_id: data.caisse_id,
    amount: data.amount,
  })

  // Update member total contributed
  await supabase.rpc("increment_member_contribution", {
    tontine_id: data.tontine_id,
    user_id: user.id,
    amount: data.amount,
  })

  // Create wallet transaction
  await supabase.from("wallet_transactions").insert({
    user_id: user.id,
    type: "contribution",
    amount: -data.amount,
    payment_method: data.payment_method,
    reference_id: data.tontine_id,
    reference_type: "tontine",
    status: "completed",
  })

  revalidatePath(`/dashboard/tontines/${data.tontine_id}`)

  return { success: true }
}
