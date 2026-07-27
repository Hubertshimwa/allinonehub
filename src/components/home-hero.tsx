"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Play, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const fade = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

export function HomeHero() {
  return <section className="relative isolate overflow-hidden bg-[#f7f9ff] pb-16 pt-12 sm:pb-24 sm:pt-20">
    <div className="aurora absolute inset-x-0 top-0 -z-10 h-[650px] opacity-70" />
    <div className="absolute left-[5%] top-32 -z-10 size-72 rounded-full bg-violet-300/30 blur-3xl" /><div className="absolute right-[4%] top-12 -z-10 size-80 rounded-full bg-cyan-300/35 blur-3xl" />
    <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
      <motion.div initial="hidden" animate="show" transition={{ staggerChildren: .1 }}>
        <motion.div variants={fade}><Badge className="border border-blue-200 bg-blue-50 px-3 py-1.5 text-blue-700"><Sparkles className="mr-1 size-3.5" />A digital home made for progress</Badge></motion.div>
        <motion.h1 variants={fade} className="mt-6 max-w-3xl text-5xl font-black leading-[.96] tracking-[-.06em] text-slate-950 sm:text-6xl lg:text-7xl">Your next opportunity is <span className="text-gradient">already waiting.</span></motion.h1>
        <motion.p variants={fade} className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Discover scholarships, practical skills, jobs, communities, and people who believe in your future — all in one welcoming place.</motion.p>
        <motion.div variants={fade} className="mt-8 flex flex-wrap gap-3"><Button variant="primary" size="lg" asChild><Link href="/auth/sign-up">Start your journey <ArrowRight className="size-4" /></Link></Button><Button variant="outline" size="lg" asChild><Link href="/opportunities"><Play className="size-4 fill-current" />Explore opportunities</Link></Button></motion.div>
        <motion.div variants={fade} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-slate-600"><span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-500" />Free to join</span><span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-500" />Built for Africa, open to all</span></motion.div>
      </motion.div>
      <HeroScene />
    </div>
  </section>;
}

function HeroScene() { return <motion.div initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .7, delay: .2 }} className="relative mx-auto w-full max-w-xl lg:mt-3">
  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-3 top-8 z-20 hidden rounded-2xl border border-white/80 bg-white/80 p-3 shadow-xl shadow-blue-950/10 backdrop-blur sm:block"><div className="flex items-center gap-2"><div className="grid size-8 place-items-center rounded-xl bg-amber-100 text-amber-600">✦</div><div><p className="text-xs font-bold text-slate-900">New scholarship</p><p className="text-[10px] text-slate-500">Deadline in 12 days</p></div></div></motion.div>
  <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 p-4 shadow-2xl shadow-blue-900/20 sm:p-5"><div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(59,130,246,.65),transparent_30%),radial-gradient(circle_at_10%_80%,rgba(139,92,246,.6),transparent_40%)]" /><div className="relative rounded-[1.35rem] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-lg bg-slate-950 text-xs text-white">✦</span><span className="text-sm font-bold">Your space</span></div><span className="size-2 rounded-full bg-emerald-500" /></div><div className="mt-6 rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-500">GOOD MORNING, ALEX</p><p className="mt-1 text-2xl font-black tracking-tight text-slate-950">Keep moving forward.</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full w-[72%] rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" /></div><p className="mt-2 text-xs text-slate-500">72% of your weekly learning goal</p></div><div className="mt-4 grid grid-cols-2 gap-3"><MiniCard icon="⌁" title="4 new" detail="opportunities" /><MiniCard icon="◎" title="2 replies" detail="from community" /></div><div className="mt-4 rounded-2xl bg-blue-600 p-4 text-white"><div className="flex items-start justify-between"><div><p className="text-xs font-medium text-blue-100">Recommended next</p><p className="mt-1 text-sm font-bold">Craft a winning scholarship essay</p></div><Star className="size-4 fill-amber-300 text-amber-300" /></div></div></div></div>
  <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-5 right-2 z-20 rounded-2xl border border-white/80 bg-white/90 p-3 shadow-xl shadow-blue-950/10 backdrop-blur sm:right-7"><div className="flex items-center gap-2"><div className="flex -space-x-2"><span className="grid size-7 place-items-center rounded-full border-2 border-white bg-pink-200 text-[9px]">AB</span><span className="grid size-7 place-items-center rounded-full border-2 border-white bg-blue-200 text-[9px]">SK</span><span className="grid size-7 place-items-center rounded-full border-2 border-white bg-amber-200 text-[9px]">+8</span></div><p className="text-xs font-bold text-slate-800">Growing together</p></div></motion.div>
</motion.div>; }

function MiniCard({ icon, title, detail }: { icon: string; title: string; detail: string }) { return <div className="rounded-xl border border-slate-100 bg-white p-3"><span className="text-lg">{icon}</span><p className="mt-2 text-base font-black text-slate-950">{title}</p><p className="text-[11px] text-slate-500">{detail}</p></div>; }
