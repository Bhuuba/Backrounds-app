"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Beaker, Film, Home, Settings } from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Overview", icon: Home },
  { href: "/research/runs", label: "Research", icon: Beaker },
  { href: "/video/projects", label: "Video", icon: Film }
];

interface AppSidebarProps {
  variant?: "desktop" | "mobile";
}

export function AppSidebar({ variant = "desktop" }: AppSidebarProps) {
  const pathname = usePathname();
  const baseClass =
    variant === "desktop"
      ? "hidden w-64 shrink-0 border-r bg-card/40 p-6 lg:block"
      : "w-full border-r bg-card/40 p-6";

  return (
    <aside className={baseClass}>
      <div className="flex flex-col gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Modules</span>
          <nav className="mt-3 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto">
          <Link
            href="#settings"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
            Settings soon
          </Link>
        </div>
      </div>
    </aside>
  );
}
