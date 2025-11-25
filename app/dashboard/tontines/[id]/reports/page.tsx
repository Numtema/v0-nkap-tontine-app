import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getTontineReportData } from "@/lib/actions/reports"
import { ReportsPageClient } from "./reports-client"

export default async function ReportsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { stats, reports, tontineName, error } = await getTontineReportData(id)

  if (error) {
    redirect("/dashboard/tontines")
  }

  return <ReportsPageClient tontineId={id} tontineName={tontineName} initialStats={stats} initialReports={reports} />
}
