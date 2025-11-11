"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AppSidebar } from "@/components/app-sidebar";

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/research") || pathname?.startsWith("/video");

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger className="lg:hidden" asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <AppSidebar variant="mobile" />
          </SheetContent>
        </Sheet>
        <Link href="/" className="text-sm font-semibold">
          Backgrounds Ops
        </Link>
        {isDashboard && (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Dashboard
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
        </Button>
        <Link href="/api/auth/signin" className="text-sm text-muted-foreground hover:text-foreground">
          Sign in
        </Link>
      </div>
    </header>
  );
}
