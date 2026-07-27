import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type CurrentUser = { id: string; email: string; fullName: string; role: string; avatarUrl: string | null };

export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("full_name, role, avatar_url").eq("id", user.id).maybeSingle();
  return { id: user.id, email: user.email ?? "", fullName: profile?.full_name ?? user.user_metadata?.full_name ?? "Member", role: profile?.role ?? "member", avatarUrl: profile?.avatar_url ?? null };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?next=/dashboard");
  return user;
}
