import Link from "next/link";
import { ArrowUpRight, Globe2, MessageCircle, Rss, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/logo";

const links = [
  { title: "Explore", items: [["Opportunities", "/opportunities"], ["Learning", "/learn"], ["Community", "/community"], ["AI guide", "/ai"]] },
  { title: "Platform", items: [["About", "/about"], ["Contact", "/contact"], ["Trust & safety", "/safety"], ["Terms", "/terms"]] },
];

export function SiteFooter() {
  return <footer className="border-t border-slate-200 bg-white">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
      <div><Logo /><p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">A trusted digital home for people who want to learn, find real opportunities, and move their lives forward.</p><div className="mt-6 flex gap-3"><Social icon={Globe2} /><Social icon={MessageCircle} /><Social icon={Rss} /></div></div>
      {links.map((group) => <div key={group.title}><h3 className="text-sm font-bold text-slate-950">{group.title}</h3><ul className="mt-4 space-y-3">{group.items.map(([label, href]) => <li key={href}><Link className="text-sm text-slate-600 hover:text-blue-600" href={href}>{label}</Link></li>)}</ul></div>)}
    </div>
    <div className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-slate-100 px-5 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8"><p>© {new Date().getFullYear()} Allinonehub. Built with purpose.</p><Link href="/contact" className="inline-flex items-center gap-1 hover:text-blue-600">Share feedback <ArrowUpRight className="size-3" /></Link></div>
  </footer>;
}

function Social({ icon: Icon }: { icon: LucideIcon }) { return <a href="#" aria-label="Social media" className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600"><Icon className="size-4" /></a>; }
