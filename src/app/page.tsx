import { cn } from "@/lib/utils";
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import Link from "next/link";


export default function Hero() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      <div className="flex flex-col justify-center items-center gap-6 p-4">
        <h1 className="z-10 text-4xl md:text-6xl font-bold text-accent text-center">
          TaskManager
        </h1>
        <h1 className="z-10 text-5xl md:text-7xl font-bold text-primary text-center max-w-[520px] md:max-w-[800px]">

          Um jeito prático de
          gerênciar as tarefas
          da sua equipe

        </h1>
        <p className="z-10 font-light text-md text-primary/80 text-center max-w-[320px] md:max-w-[400px] ">Simples, rápido e direto. Tudo o que você precisa para organizar
          o dia a dia da sua equipe.</p>

        <Link className="z-10" href={"/auth/login"}>
          <InteractiveHoverButton className="bg-accent text-primary-foreground">Comece agora</InteractiveHoverButton>
        </Link>

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
    </div>
  );
}
