import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-gradient-to-b from-background to-muted px-6 py-24 text-center">
      <div className="max-w-2xl space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Backgrounds Ops Platform
        </h1>
        <p className="text-muted-foreground">
          Запустіть автоматизовані дослідження та швидко ріжте відео для звітів і
          медіа. Оберіть модуль щоб почати.
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/research/new"
          className={cn(buttonVariants({ size: "lg" }), "group")}
        >
          Research Workflow
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href="/video/new"
          className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "group")}
        >
          Video Workflow
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </main>
  );
}
