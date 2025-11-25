import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NkapLogo } from "@/components/nkap-logo"
import { AlertCircle } from "lucide-react"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <NkapLogo size="md" className="mx-auto mb-6" />
        </div>

        <Card className="rounded-3xl border-0 shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Une erreur est survenue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground">
              {params?.error || "Une erreur inconnue s'est produite lors de l'authentification."}
            </p>

            <div className="flex flex-col gap-3">
              <Link href="/login">
                <Button className="w-full rounded-full h-14 text-lg font-semibold">Retour à la connexion</Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" className="w-full rounded-full h-14 text-lg font-semibold bg-transparent">
                  Créer un compte
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
