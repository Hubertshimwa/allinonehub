import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHero({ eyebrow, title, description, children, className }: { eyebrow: string; title: ReactNode; description: string; children?: ReactNode; className?: string }) {
  return <section className={cn("relative overflow-hidden border-b border-slate-100 bg-[#f7f9ff]", className)}>
    <div className="absolute -top-32 right-0 size-96 rounded-full bg-blue-200/40 blur-3xl" />
    <div className="relative mx-auto max-w-7xl px-5 py-16 text-center lg:px-8 lg:py-20">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-blue-600">{eyebrow}</p>
      <h1 className="mx-auto max-w-3xl text-4xl font-black tracking-[-0.045em] text-slate-950 sm:text-5xl">{title}</h1>
      <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{description}</p>
      {children && <div className="mt-8">{children}</div>}
    </div>
  </section>;
}
