"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { nanoid } from "nanoid"

export type TontineSettings = {
  id: string
  name: string
  invite_code: string
  is_public: boolean
  notifications: {
    contributions: boolean
    reminders: boolean
    chat: boolean
    announcements: boolean
  }
  pending_requests: number
  user_role: "admin" | "president" | "secretary" | "treasurer" | "member"
}

export async function getTontineSettings(tontineId: string): Promise<{
  settings: TontineSettings | null
  error: string | null
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { settings: null, error: "Non authentifié" }
  }

  // Get tontine info
  const { data: tontine, error: tontineError } = await supabase
    .from("tontines")
    .select("id, name, invite_code, is_public")
    .eq("id", tontineId)
    .single()

  if (tontineError) {
    return { settings: null, error: tontineError.message }
  }

  // Get user's membership and role
  const { data: membership } = await supabase
    .from("tontine_members")
    .select("role")
    .eq("tontine_id", tontineId)
    .eq("user_id", user.id)
    .single()

  // Get pending requests count
  const { count: pendingRequests } = await supabase
    .from("tontine_members")
    .select("id", { count: "exact", head: true })
    .eq("tontine_id", tontineId)
    .eq("status", "pending")

  // Get user's notification preferences (from profile or tontine-specific)
  const { data: profile } = await supabase
    .from("profiles")
    .select("notification_preferences")
    .eq("id", user.id)
    .single()

  const defaultNotifications = {
    contributions: true,
    reminders: true,
    chat: true,
    announcements: true,
  }

  return {
    settings: {
      id: tontine.id,
      name: tontine.name,
      invite_code: tontine.invite_code || nanoid(8).toUpperCase(),
      is_public: tontine.is_public || false,
      notifications: profile?.notification_preferences || defaultNotifications,
      pending_requests: pendingRequests || 0,
      user_role: membership?.role || "member",
    },
    error: null,
  }
}

export async function updateTontineSettings(
  tontineId: string,
  updates: Partial<{
    name: string
    is_public: boolean
    notifications: {
      contributions: boolean
      reminders: boolean
      chat: boolean
      announcements: boolean
    }
  }>,
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Non authentifié" }
  }

  // Check if user has admin rights
  const { data: membership } = await supabase
    .from("tontine_members")
    .select("role")
    .eq("tontine_id", tontineId)
    .eq("user_id", user.id)
    .single()

  const adminRoles = ["admin", "president"]
  if (!membership || !adminRoles.includes(membership.role)) {
    return { success: false, error: "Vous n'avez pas les droits pour modifier ces paramètres" }
  }

  // Update tontine settings
  if (updates.name || updates.is_public !== undefined) {
    const { error } = await supabase
      .from("tontines")
      .update({
        ...(updates.name && { name: updates.name }),
        ...(updates.is_public !== undefined && { is_public: updates.is_public }),
      })
      .eq("id", tontineId)

    if (error) {
      return { success: false, error: error.message }
    }
  }

  // Update user's notification preferences
  if (updates.notifications) {
    const { error } = await supabase
      .from("profiles")
      .update({ notification_preferences: updates.notifications })
      .eq("id", user.id)

    if (error) {
      return { success: false, error: error.message }
    }
  }

  revalidatePath(`/dashboard/tontines/${tontineId}/settings`)
  return { success: true, error: null }
}

export async function regenerateInviteCode(tontineId: string): Promise<{
  success: boolean
  newCode?: string
  error: string | null
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Non authentifié" }
  }

  // Check admin rights
  const { data: membership } = await supabase
    .from("tontine_members")
    .select("role")
    .eq("tontine_id", tontineId)
    .eq("user_id", user.id)
    .single()

  if (!membership || !["admin", "president"].includes(membership.role)) {
    return { success: false, error: "Droits insuffisants" }
  }

  const newCode = nanoid(8).toUpperCase()

  const { error } = await supabase.from("tontines").update({ invite_code: newCode }).eq("id", tontineId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/dashboard/tontines/${tontineId}/settings`)
  return { success: true, newCode, error: null }
}

export async function leaveTontine(tontineId: string): Promise<{
  success: boolean
  error: string | null
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Non authentifié" }
  }

  // Check if user has pending contributions
  const { data: membership } = await supabase
    .from("tontine_members")
    .select("id, role")
    .eq("tontine_id", tontineId)
    .eq("user_id", user.id)
    .single()

  if (!membership) {
    return { success: false, error: "Vous n'êtes pas membre de cette tontine" }
  }

  // Check for pending contributions
  const { data: pendingContribs } = await supabase
    .from("contributions")
    .select("id")
    .eq("member_id", membership.id)
    .eq("status", "pending")

  if (pendingContribs && pendingContribs.length > 0) {
    return { success: false, error: "Vous avez des cotisations en attente. Veuillez les régler avant de quitter." }
  }

  // Can't leave if admin/president without transferring role
  if (["admin", "president"].includes(membership.role)) {
    return {
      success: false,
      error: "Vous devez transférer votre rôle d'administrateur avant de quitter la tontine.",
    }
  }

  // Update status to "left"
  const { error } = await supabase.from("tontine_members").update({ status: "left" }).eq("id", membership.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/tontines")
  return { success: true, error: null }
}
