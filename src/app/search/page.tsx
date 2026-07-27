import type { Metadata } from "next";
import { SearchExperience } from "@/components/search-experience";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
export const metadata: Metadata = { title: "Search" };
export default function SearchPage() { return <><SiteHeader /><main className="min-h-[70vh] bg-slate-50"><section className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-blue-600">Search Allinonehub</p><h1 className="mt-4 text-4xl font-black tracking-[-.045em] text-slate-950">Find your next useful thing.</h1><div className="mt-8"><SearchExperience /></div></section></main><SiteFooter /></>; }
