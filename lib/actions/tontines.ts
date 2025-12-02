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
    is_required: boolean
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
      president_id: user.id,
      invite_code: generateInviteCode(),
      status: "pending",
      current_cycle: 1,
    })
    .select()
    .single()

  if (tontineError) {
    console.log("[v0] Error creating tontine:", tontineError)
    return { error: tontineError.message }
  }

  // Add creator as admin member
  const { error: memberError } = await supabase.from("tontine_members").insert({
    tontine_id: tontine.id,
    user_id: user.id,
    role: "admin",
    status: "active",
    draw_position: 1,
    total_contributed: 0,
    total_received: 0,
  })

  if (memberError) {
    console.log("[v0] Error adding member:", memberError)
  }

  // Create default main caisse
  const { error: caisseError } = await supabase.from("caisses").insert({
    tontine_id: tontine.id,
    name: "Caisse Principale",
    type: "main",
    contribution_amount: data.contribution_amount,
    is_required: true,
    balance: 0,
  })

  if (caisseError) {
    console.log("[v0] Error creating caisse:", caisseError)
  }

  // Create additional caisses if provided
  if (data.caisses && data.caisses.length > 0) {
    const caissesToInsert = data.caisses.map((caisse) => ({
      tontine_id: tontine.id,
      name: caisse.name,
      type: caisse.type,
      contribution_amount: caisse.contribution_amount,
      is_required: caisse.is_required,
      balance: 0,
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

  // Check if already requested
  const { data: existingRequest } = await supabase
    .from("join_requests")
    .select("id")
    .eq("tontine_id", tontine.id)
    .eq("user_id", user.id)
    .eq("status", "pending")
    .single()

  if (existingRequest) {
    return { error: "Vous avez déjà une demande en attente" }
  }

  // Check if tontine is full
  const { count } = await supabase
    .from("tontine_members")
    .select("*", { count: "exact", head: true })
    .eq("tontine_id", tontine.id)

  if (count && count >= tontine.max_members) {
    return { error: "Cette tontine est complète" }
  }

  // Create join request
  const { error: joinError } = await supabase.from("join_requests").insert({
    tontine_id: tontine.id,
    user_id: user.id,
    status: "pending",
  })

  if (joinError) {
    return { error: joinError.message }
  }

  // Create notification for tontine admin
  await supabase.from("notifications").insert({
    user_id: tontine.created_by,
    title: "Nouvelle demande d'adhésion",
    message: `Un utilisateur souhaite rejoindre ${tontine.name}`,
    type: "join_request",
    data: { tontine_id: tontine.id },
  })

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

  const { data: memberships, error } = await supabase
    .from("tontine_members")
    .select(`
      *,
      tontine:tontines(*)
    `)
    .eq("user_id", user.id)
    .neq("status", "removed")

  if (error) {
    console.log("[v0] Error fetching tontines:", error)
    return []
  }

  return (
    memberships?.map((m) => ({
      ...m.tontine,
      myRole: m.role,
      myStatus: m.status,
      myDrawPosition: m.draw_position,
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

  // Get tontine with members and caisses
  const { data: tontine, error } = await supabase
    .from("tontines")
    .select(`
      *,
      members:tontine_members(
        *,
        profile:profiles(id, full_name, avatar_url, email, phone, reputation_score)
      ),
      caisses(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.log("[v0] Error fetching tontine:", error)
    return null
  }

  // Get bureau members
  const bureauIds = [tontine.president_id, tontine.secretary_id, tontine.treasurer_id].filter(Boolean)
  const bureauProfiles: Record<string, any> = {}

  if (bureauIds.length > 0) {
    const { data: profiles } = await supabase.from("profiles").select("*").in("id", bureauIds)

    if (profiles) {
      profiles.forEach((p) => {
        bureauProfiles[p.id] = p
      })
    }
  }

  // Get pending join requests count
  const { count: pendingRequests } = await supabase
    .from("join_requests")
    .select("*", { count: "exact", head: true })
    .eq("tontine_id", id)
    .eq("status", "pending")

  return {
    ...tontine,
    bureau: {
      president: bureauProfiles[tontine.president_id] || null,
      secretary: bureauProfiles[tontine.secretary_id] || null,
      treasurer: bureauProfiles[tontine.treasurer_id] || null,
    },
    pendingRequests: pendingRequests || 0,
  }
}

export async function getTontineMembers(tontineId: string) {
  const supabase = await createClient()

  const { data: members, error } = await supabase
    .from("tontine_members")
    .select(`
      *,
      profile:profiles(id, full_name, avatar_url, email, phone, reputation_score)
    `)
    .eq("tontine_id", tontineId)
    .neq("status", "removed")
    .order("draw_position", { ascending: true })

  if (error) {
    console.log("[v0] Error fetching members:", error)
    return []
  }

  return members || []
}

export async function getTontineCaisses(tontineId: string) {
  const supabase = await createClient()

  const { data: caisses, error } = await supabase.from("caisses").select("*").eq("tontine_id", tontineId)

  if (error) {
    console.log("[v0] Error fetching caisses:", error)
    return []
  }

  return caisses || []
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

  // Get member info
  const { data: member } = await supabase
    .from("tontine_members")
    .select("id")
    .eq("tontine_id", data.tontine_id)
    .eq("user_id", user.id)
    .single()

  if (!member) {
    return { error: "Vous n'êtes pas membre de cette tontine" }
  }

  // Get tontine details
  const { data: tontine } = await supabase
    .from("tontines")
    .select("current_cycle, name")
    .eq("id", data.tontine_id)
    .single()

  // Check user balance
  const { data: profile } = await supabase.from("profiles").select("nkap_balance").eq("id", user.id).single()

  if (!profile || profile.nkap_balance < data.amount) {
    return { error: "Solde insuffisant" }
  }

  // Create contribution
  const { error: contributionError } = await supabase.from("contributions").insert({
    tontine_id: data.tontine_id,
    caisse_id: data.caisse_id,
    member_id: member.id,
    amount: data.amount,
    cycle_number: tontine?.current_cycle || 1,
    payment_method: data.payment_method,
    status: "completed",
    transaction_ref: `TXN-${Date.now()}`,
    paid_at: new Date().toISOString(),
  })

  if (contributionError) {
    console.log("[v0] Error creating contribution:", contributionError)
    return { error: contributionError.message }
  }

  // Update caisse balance
  const { error: caisseError } = await supabase.rpc("increment_caisse_balance", {
    p_caisse_id: data.caisse_id,
    p_amount: data.amount,
  })

  if (caisseError) {
    console.log("[v0] Error updating caisse:", caisseError)
  }

  // Update member total contributed
  await supabase.from("tontine_members").update({ total_contributed: member.id }).eq("id", member.id)

  // Deduct from user balance
  await supabase.rpc("decrement_user_balance", {
    p_user_id: user.id,
    p_amount: data.amount,
  })

  // Create wallet transaction
  await supabase.from("wallet_transactions").insert({
    user_id: user.id,
    type: "contribution",
    amount: data.amount,
    payment_method: data.payment_method,
    reference_id: data.tontine_id,
    reference_type: "tontine",
    status: "completed",
    notes: `Contribution à ${tontine?.name}`,
  })

  revalidatePath(`/dashboard/tontines/${data.tontine_id}`)
  revalidatePath("/dashboard")

  return { success: true }
}

export async function approveJoinRequest(requestId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  // Get request details
  const { data: request } = await supabase
    .from("join_requests")
    .select("*, tontine:tontines(*)")
    .eq("id", requestId)
    .single()

  if (!request) {
    return { error: "Demande non trouvée" }
  }

  // Check if user is admin of tontine
  const { data: membership } = await supabase
    .from("tontine_members")
    .select("role")
    .eq("tontine_id", request.tontine_id)
    .eq("user_id", user.id)
    .single()

  if (!membership || membership.role !== "admin") {
    return { error: "Non autorisé" }
  }

  // Get current member count for draw position
  const { count } = await supabase
    .from("tontine_members")
    .select("*", { count: "exact", head: true })
    .eq("tontine_id", request.tontine_id)

  // Add as member
  const { error: memberError } = await supabase.from("tontine_members").insert({
    tontine_id: request.tontine_id,
    user_id: request.user_id,
    role: "member",
    status: "active",
    draw_position: (count || 0) + 1,
    total_contributed: 0,
    total_received: 0,
  })

  if (memberError) {
    return { error: memberError.message }
  }

  // Update request status
  await supabase
    .from("join_requests")
    .update({ status: "approved", reviewed_by: user.id, reviewed_at: new Date().toISOString() })
    .eq("id", requestId)

  // Notify user
  await supabase.from("notifications").insert({
    user_id: request.user_id,
    title: "Demande acceptée",
    message: `Votre demande pour rejoindre ${request.tontine.name} a été acceptée`,
    type: "join_approved",
    data: { tontine_id: request.tontine_id },
  })

  revalidatePath(`/dashboard/tontines/${request.tontine_id}`)

  return { success: true }
}

export async function rejectJoinRequest(requestId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  // Get request details
  const { data: request } = await supabase
    .from("join_requests")
    .select("*, tontine:tontines(*)")
    .eq("id", requestId)
    .single()

  if (!request) {
    return { error: "Demande non trouvée" }
  }

  // Update request status
  await supabase
    .from("join_requests")
    .update({ status: "rejected", reviewed_by: user.id, reviewed_at: new Date().toISOString() })
    .eq("id", requestId)

  // Notify user
  await supabase.from("notifications").insert({
    user_id: request.user_id,
    title: "Demande refusée",
    message: `Votre demande pour rejoindre ${request.tontine.name} a été refusée`,
    type: "join_rejected",
    data: { tontine_id: request.tontine_id },
  })

  revalidatePath(`/dashboard/tontines/${request.tontine_id}`)

  return { success: true }
}

export async function getJoinRequests(tontineId: string) {
  const supabase = await createClient()

  const { data: requests, error } = await supabase
    .from("join_requests")
    .select(`
      *,
      user:profiles(id, full_name, avatar_url, email, phone, reputation_score)
    `)
    .eq("tontine_id", tontineId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  if (error) {
    console.log("[v0] Error fetching join requests:", error)
    return []
  }

  return requests || []
}

export async function inviteMember(tontineId: string, email: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  // Get tontine
  const { data: tontine } = await supabase.from("tontines").select("name, invite_code").eq("id", tontineId).single()

  if (!tontine) {
    return { error: "Tontine non trouvée" }
  }

  // For now, just return the invite code
  return {
    success: true,
    inviteCode: tontine.invite_code,
    tontineName: tontine.name,
  }
}
