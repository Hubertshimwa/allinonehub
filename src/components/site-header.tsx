"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { navigation } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className={cn("rounded-lg px-3 py-2 text-sm font-medium transition-colors", pathname.startsWith(item.href) ? "bg-slate-100 text-slate-950" : "text-slate-600 hover:text-slate-950")}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" size="icon" asChild><Link href="/search" aria-label="Search"><Search className="size-4" /></Link></Button>
          <Button variant="ghost" asChild><Link href="/auth/login">Log in</Link></Button>
          <Button variant="primary" asChild><Link href="/auth/sign-up">Join free</Link></Button>
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>
      {open && <div className="border-t border-slate-100 bg-white px-5 py-4 lg:hidden">
        <nav className="mx-auto flex max-w-7xl flex-col gap-1">
          {navigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 font-medium text-slate-700 hover:bg-slate-50">{item.label}</Link>)}
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
            <Button variant="outline" asChild><Link href="/auth/login">Log in</Link></Button>
            <Button variant="primary" asChild><Link href="/auth/sign-up">Join free</Link></Button>
          </div>
        </nav>
      </div>}
    </header>
  );
}
