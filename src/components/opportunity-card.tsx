import Link from "next/link";
import { Bookmark, CalendarDays, ChevronRight, MapPin } from "lucide-react";
import type { OpportunityPreview } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const typeStyle: Record<OpportunityPreview["type"], string> = {
  Scholarship: "bg-violet-100 text-violet-700",
  Job: "bg-blue-100 text-blue-700",
  Internship: "bg-amber-100 text-amber-700",
  Program: "bg-emerald-100 text-emerald-700",
};

export function OpportunityCard({ opportunity, compact = false }: { opportunity: OpportunityPreview; compact?: boolean }) {
  return <article className="group relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/5">
    <div className="flex items-start justify-between gap-3"><Badge className={typeStyle[opportunity.type]}>{opportunity.type}</Badge><button className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600" aria-label={`Save ${opportunity.title}`}><Bookmark className="size-4" /></button></div>
    <h3 className="mt-4 line-clamp-2 text-lg font-bold leading-snug tracking-tight text-slate-950">{opportunity.title}</h3>
    <p className="mt-1.5 text-sm text-slate-600">{opportunity.organization}</p>
    {!compact && <div className="mt-5 space-y-2 text-sm text-slate-500"><p className="flex items-center gap-2"><MapPin className="size-4 text-slate-400" />{opportunity.location}</p><p className="flex items-center gap-2"><CalendarDays className="size-4 text-slate-400" />Deadline: {formatDate(opportunity.deadline)}</p></div>}
    <div className="mt-5 flex flex-wrap gap-2">{opportunity.tags.map((tag) => <Badge key={tag} className="bg-slate-100 text-slate-600">{tag}</Badge>)}</div>
    <Link className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700" href={`/opportunities/${opportunity.id}`}>View opportunity <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" /></Link>
  </article>;
}

export function OpportunityCardSkeleton() { return <div className="h-72 animate-pulse rounded-2xl border border-slate-100 bg-slate-50 p-5"><div className="h-6 w-20 rounded bg-slate-200" /><div className="mt-5 h-6 w-4/5 rounded bg-slate-200" /><div className="mt-3 h-4 w-2/5 rounded bg-slate-200" /><div className="mt-10 h-4 w-3/5 rounded bg-slate-200" /></div>; }
