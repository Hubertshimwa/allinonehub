"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Code2, Loader2, Mail, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function AuthForm({ mode }: { mode: "login" | "sign-up" }) {
  const signUp = mode === "sign-up";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("loading"); setMessage("");
    try {
      const supabase = createClient();
      if (signUp) {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard` } });
        if (error) throw error;
        setStatus("success"); setMessage("Check your email to confirm your account, then come back to sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.assign("/dashboard");
      }
    } catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : "We couldn’t complete that. Please try again."); }
  }
  async function social(provider: "google" | "github") { setStatus("loading"); try { const supabase = createClient(); const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` } }); if (error) throw error; } catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : "Unable to continue with that provider."); } }
  return <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8"><div className="grid size-11 place-items-center rounded-2xl bg-blue-600 text-white"><Sparkles className="size-5" /></div><h1 className="mt-6 text-2xl font-black tracking-tight text-slate-950">{signUp ? "Create your free account" : "Welcome back"}</h1><p className="mt-2 text-sm leading-6 text-slate-600">{signUp ? "Your next step is closer than you think." : "Pick up where your future left off."}</p><div className="mt-6 grid grid-cols-2 gap-3"><Button variant="outline" type="button" onClick={() => social("google")} disabled={status === "loading"}><Mail className="size-4" />Google</Button><Button variant="outline" type="button" onClick={() => social("github")} disabled={status === "loading"}><Code2 className="size-4" />GitHub</Button></div><div className="my-6 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" />or continue with email<span className="h-px flex-1 bg-slate-200" /></div><form onSubmit={onSubmit} className="space-y-4">{signUp && <Field label="Your name" id="fullName" value={fullName} onChange={setFullName} placeholder="e.g. Aline Mukamana" /> }<Field label="Email address" id="email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" /><div><div className="mb-1.5 flex items-center justify-between"><label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>{!signUp && <Link href="/auth/forgot-password" className="text-xs font-semibold text-blue-600 hover:underline">Forgot password?</Link>}</div><div className="relative"><input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required placeholder="At least 8 characters" className="h-11 w-full rounded-xl border border-slate-200 px-3 pr-16 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">{showPassword ? "Hide" : "Show"}</button></div></div>{message && <p role="status" className={`rounded-xl px-3 py-2 text-sm ${status === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{message}</p>}<Button variant="primary" type="submit" size="lg" className="mt-2 w-full" disabled={status === "loading"}>{status === "loading" ? <Loader2 className="size-4 animate-spin" /> : null}{signUp ? "Create account" : "Log in"}</Button></form><p className="mt-6 text-center text-sm text-slate-600">{signUp ? "Already a member?" : "New to Allinonehub?"} <Link className="font-bold text-blue-600 hover:underline" href={signUp ? "/auth/login" : "/auth/sign-up"}>{signUp ? "Log in" : "Create an account"}</Link></p></div>;
}
function Field({ label, id, type = "text", value, onChange, placeholder }: { label: string; id: string; type?: string; value: string; onChange: (value: string) => void; placeholder: string }) { return <div><label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</label><input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} required placeholder={placeholder} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></div>; }
