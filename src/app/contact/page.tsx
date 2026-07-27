import type { Metadata } from "next";
import { Mail, MapPin, ShieldAlert } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
export const metadata: Metadata = { title: "Contact" };
export default function ContactPage() { return <><SiteHeader /><main><PageHero eyebrow="We’re listening" title={<>How can we <span className="text-gradient">help?</span></>} description="A question, a partnership idea, an opportunity to share — we would love to hear from you." /><section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[.75fr_1.25fr] lg:px-8"><aside className="space-y-6"><ContactDetail icon={Mail} title="Email us" text="hello@allinonehub.org" /><ContactDetail icon={MapPin} title="Based in Rwanda, reaching outward" text="Built for a global community." /><ContactDetail icon={ShieldAlert} title="Need to report a safety issue?" text="Choose “Report a safety concern” so we can prioritize it." /></aside><ContactForm /></section></main><SiteFooter /></>; }
function ContactDetail({ icon: Icon, title, text }: { icon: typeof Mail; title: string; text: string }) { return <div className="flex gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon className="size-5" /></span><div><h2 className="font-bold text-slate-950">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{text}</p></div></div>; }
