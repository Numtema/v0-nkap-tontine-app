"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

function getSiteUrl() {
  // Check for explicitly set production URL first
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "") // Remove trailing slash
  }

  // Check for Vercel deployment URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // Check for Vercel project production URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  // Hardcoded production URL as fallback for Nkap
  if (process.env.NODE_ENV === "production") {
    return "https://nkaptontine.vercel.app"
  }

  // Development: use DEV redirect URL
  if (process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL) {
    try {
      const url = new URL(process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL)
      return url.origin
    } catch {
      // Invalid URL, fall through
    }
  }

  return "http://localhost:3000"
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email et mot de passe requis" }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.log("[v0] Login error:", error.message)
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Email ou mot de passe incorrect" }
    } else if (error.message.includes("Email not confirmed")) {
      return { error: "Veuillez confirmer votre email avant de vous connecter" }
    }
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signupAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const phone = formData.get("phone") as string
  const country = formData.get("country") as string

  if (!email || !password || !fullName || !phone || !country) {
    return { error: "Tous les champs sont requis" }
  }

  const supabase = await createClient()

  const siteUrl = getSiteUrl()
  const redirectUrl = `${siteUrl}/auth/callback`

  console.log("[v0] Signup redirect URL:", redirectUrl)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        full_name: fullName,
        phone,
        country,
      },
    },
  })

  if (error) {
    console.log("[v0] Signup error:", error.message)
    return { error: error.message }
  }

  redirect("/auth/sign-up-success")
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return { error: "Email requis" }
  }

  const supabase = await createClient()

  const siteUrl = getSiteUrl()
  const redirectUrl = `${siteUrl}/auth/reset-password`

  console.log("[v0] Forgot password redirect URL:", redirectUrl)

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  })

  if (error) {
    console.log("[v0] Forgot password error:", error.message)
    return { error: error.message }
  }

  return { success: true }
}

export async function resetPasswordAction(formData: FormData) {
  const password = formData.get("password") as string

  if (!password || password.length < 6) {
    return { error: "Le mot de passe doit contenir au moins 6 caractères" }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    console.log("[v0] Reset password error:", error.message)
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

export async function getProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return profile
}

export async function updateProfile(data: {
  full_name?: string
  phone?: string
  country?: string
  avatar_url?: string
  preferred_language?: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
