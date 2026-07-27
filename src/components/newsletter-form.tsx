"use client";

import { FormEvent, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    try {
      const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Something went wrong.");
      setState("success"); setMessage("You’re on the list — welcome!"); setEmail("");
    } catch (error) { setState("error"); setMessage(error instanceof Error ? error.message : "Please try again."); }
  }

  return <form onSubmit={subscribe} className="mx-auto max-w-md"><div className="flex flex-col gap-2 sm:flex-row"><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Your email address" className={`h-12 flex-1 rounded-xl border px-4 text-sm outline-none transition focus:ring-2 focus:ring-blue-400 ${dark ? "border-white/20 bg-white/10 text-white placeholder:text-slate-300" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`} /><Button variant={dark ? "primary" : "default"} size="lg" type="submit" disabled={state === "loading"}>{state === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}<span className="sm:hidden">Subscribe</span></Button></div>{message && <p className={`mt-3 text-sm ${state === "success" ? "text-emerald-300" : "text-red-300"}`} role="status">{message}</p>}</form>;
}
