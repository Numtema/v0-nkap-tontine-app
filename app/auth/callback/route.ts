import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const error_description = requestUrl.searchParams.get("error_description")

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin

  console.log("[v0] Auth callback - code:", code ? "present" : "missing")
  console.log("[v0] Auth callback - origin:", requestUrl.origin)
  console.log("[v0] Auth callback - siteUrl:", siteUrl)

  // Handle error from Supabase
  if (error) {
    console.log("[v0] Auth callback error:", error, error_description)
    return NextResponse.redirect(`${siteUrl}/auth/error?error=${encodeURIComponent(error_description || error)}`)
  }

  if (code) {
    const supabase = await createClient()
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.log("[v0] Exchange code error:", exchangeError.message)
      return NextResponse.redirect(`${siteUrl}/auth/error?error=${encodeURIComponent(exchangeError.message)}`)
    }

    console.log("[v0] Auth callback success - user:", data.user?.email)
  }

  return NextResponse.redirect(`${siteUrl}/dashboard`)
}
