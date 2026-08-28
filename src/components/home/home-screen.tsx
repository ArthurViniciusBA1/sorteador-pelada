"use client";

import { History, Plus } from "lucide-react";
import Link from "next/link";
import { FootballIcon } from "@/components/icons/football-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function HomeScreen() {
  return (
    <div className="mx-auto flex h-dvh w-full max-w-3xl flex-col overflow-hidden">
      <div className="shrink-0 px-4 pt-4">
        <header className="flex flex-col items-center gap-2 rounded-lg bg-primary/70 px-4 py-8 text-primary-foreground backdrop-blur-xl">
          <FootballIcon className="size-10" />
          <h1 className="text-center font-heading text-2xl font-bold tracking-tight">SorteioFut</h1>
          <p className="text-center text-sm text-primary-foreground/80">
            Monte os times da sua pelada em segundos
          </p>
        </header>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-center gap-3 px-4">
        <Button asChild size="lg">
          <Link href="/novo">
            <Plus className="size-4" />
            Criar novo sorteio
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/sorteios">
            <History className="size-4" />
            Ver sorteios anteriores
          </Link>
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
}
