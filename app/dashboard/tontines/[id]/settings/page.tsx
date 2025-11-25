import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getTontineSettings } from "@/lib/actions/settings"
import { SettingsPageClient } from "./settings-client"

export default async function TontineSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { settings, error } = await getTontineSettings(id)

  if (error || !settings) {
    redirect("/dashboard/tontines")
  }

  return <SettingsPageClient tontineId={id} initialSettings={settings} />
}
