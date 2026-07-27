import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2" aria-label="Allinonehub home">
      <span className="grid size-9 place-items-center rounded-xl bg-slate-950 text-white shadow-lg shadow-blue-950/15 transition-transform group-hover:rotate-6">
        <Sparkles className="size-4" />
      </span>
      {!compact && <span className="text-lg font-bold tracking-tight text-slate-950">allinone<span className="text-blue-600">hub</span></span>}
    </Link>
  );
}
