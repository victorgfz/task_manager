import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { auth, signIn } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Chrome } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

type Providers = "google"

export default async function LoginPage() {

    const session = await auth()
    if (session?.user) { redirect("/dashboard/teams") }

    const handleLogin = async (form: FormData) => {
        "use server"
        const provider = form.get("provider") as Providers
        await signIn(provider, { redirectTo: "/dashboard/teams" })
    }
    return (<main className="relative w-full h-screen grid md:grid-cols-[1.5fr,1fr] overflow-hidden">
        <aside className="z-10">
            <Image
                width={1000}
                height={800}
                src="/images/login_img.jpg"
                alt="Imagem de Login"
                className="w-full h-full object-cover"
                quality={100}
            />
        </aside>
        <div className="p-12 flex flex-col justify-center gap-4">
            <h1 className="font-bold text-4xl text-center text-accent z-10">TaskManager</h1>
            <div>
                <h2 className="font-bold text-5xl md:text-6xl text-center leading-none z-10">Entre em sua conta</h2>
                <p className="text-center text-muted-foreground z-10">Se não tiver uma conta, ela será criada automaticamente!</p>
            </div>
            <div className="flex gap-4 z-10">
                <form className="flex-1" action={handleLogin}>
                    <Button
                        variant="outline"
                        className="w-full"
                        type="submit"
                        name="provider"
                        value="google"
                    >
                        <Chrome size={20} />
                        Entrar com o Google
                    </Button>
                </form>
                <ThemeToggle />
            </div>

        </div>
        <InteractiveGridPattern
            width={40}
            height={40}
            squares={[48, 48]}
            className={cn(
                "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)] md:[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
                "inset-x-0 inset-y-[-50%] md:inset-y-[-30%] h-[200%] skew-y-12 opacity-50",
            )}
        />
    </main>)
}