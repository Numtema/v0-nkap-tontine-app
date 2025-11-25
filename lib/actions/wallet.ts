"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getWalletBalance() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { balance: 0, locked: 0 }
  }

  const { data: profile } = await supabase.from("profiles").select("nkap_balance").eq("id", user.id).single()

  // Calculate locked balance (in active tontines)
  const { data: memberships } = await supabase
    .from("tontine_members")
    .select("total_contributed")
    .eq("user_id", user.id)
    .eq("status", "active")

  const locked = memberships?.reduce((sum, m) => sum + (m.total_contributed || 0), 0) || 0

  return {
    balance: profile?.nkap_balance || 0,
    locked,
  }
}

export async function getWalletTransactions(limit = 20) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data: transactions } = await supabase
    .from("wallet_transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit)

  return transactions || []
}

export async function topUpWallet(data: {
  amount: number
  payment_method: string
  local_currency: string
  local_amount: number
  exchange_rate: number
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  // Create transaction
  const { error: txError } = await supabase.from("wallet_transactions").insert({
    user_id: user.id,
    type: "topup",
    amount: data.amount,
    local_currency: data.local_currency,
    local_amount: data.local_amount,
    exchange_rate: data.exchange_rate,
    payment_method: data.payment_method,
    status: "completed",
    external_ref: `TOP-${Date.now()}`,
  })

  if (txError) {
    return { error: txError.message }
  }

  // Update balance
  const { error: updateError } = await supabase.rpc("increment_nkap_balance", {
    user_id: user.id,
    amount: data.amount,
  })

  if (updateError) {
    return { error: updateError.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/wallet")

  return { success: true }
}

export async function withdrawFromWallet(data: {
  amount: number
  payment_method: string
  local_currency: string
  local_amount: number
  exchange_rate: number
  fee: number
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  // Check balance
  const { data: profile } = await supabase.from("profiles").select("nkap_balance").eq("id", user.id).single()

  const totalAmount = data.amount + data.fee
  if (!profile || profile.nkap_balance < totalAmount) {
    return { error: "Solde insuffisant" }
  }

  // Create transaction
  const { error: txError } = await supabase.from("wallet_transactions").insert({
    user_id: user.id,
    type: "withdraw",
    amount: -data.amount,
    fee: data.fee,
    local_currency: data.local_currency,
    local_amount: data.local_amount,
    exchange_rate: data.exchange_rate,
    payment_method: data.payment_method,
    status: "completed",
    external_ref: `WIT-${Date.now()}`,
  })

  if (txError) {
    return { error: txError.message }
  }

  // Update balance
  const { error: updateError } = await supabase.rpc("decrement_nkap_balance", {
    user_id: user.id,
    amount: totalAmount,
  })

  if (updateError) {
    return { error: updateError.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/wallet")

  return { success: true }
}

export async function getExchangeRates() {
  const supabase = await createClient()

  const { data: rates } = await supabase.from("exchange_rates").select("*").order("country")

  return rates || []
}
