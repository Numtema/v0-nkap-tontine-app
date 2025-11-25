import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NkapLogo } from "@/components/nkap-logo"
import { Mail, CheckCircle2 } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <NkapLogo size="md" className="mx-auto mb-6" />
        </div>

        <Card className="rounded-3xl border-0 shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Vérifiez votre email</CardTitle>
            <CardDescription className="text-base">Nous vous avons envoyé un lien de confirmation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-2xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Ouvrez votre boîte de réception et cliquez sur le lien de confirmation
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Si vous ne trouvez pas l'email, vérifiez votre dossier spam
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">Après confirmation, vous pourrez vous connecter à Nkap</p>
              </div>
            </div>

            <Link href="/login" className="block">
              <Button className="w-full rounded-full h-14 text-lg font-semibold">Aller à la connexion</Button>
            </Link>

            <p className="text-center text-sm text-muted-foreground">
              Pas reçu d'email? <button className="text-primary font-medium hover:underline">Renvoyer</button>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
