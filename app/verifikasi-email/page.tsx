import AnimationSection from "@/components/LandingPage/AnimationSection"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Clock8Icon } from "lucide-react"
import { redirect } from "next/navigation"

const VerifikasiEmail = async () => {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const user = data?.claims;
    if(user) return redirect("/dashboard");
    
    return (
        <div className="min-h-dvh flex items-center justify-center bg-background relative overflow-hidden">
            {/* ANIMATION */}
            <AnimationSection />

            <Card className="w-[96%] max-w-md animate-fade-in bg-card/70">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 shadow-[1px_1px_5px_rgba(0,0,0,0.3)]">
                        <Clock8Icon className="h-6 w-6 text-accent animate-pulse" />
                    </div>
                    <CardTitle className="font-display text-2xl">Konfirmasi Email</CardTitle>
                    <CardDescription>Terima kasih telah mendaftar di Tugasku! Untuk mengaktifkan akun Anda, silakan pergi ke email anda untuk memverifikasi alamat email Anda.</CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}

export default VerifikasiEmail
