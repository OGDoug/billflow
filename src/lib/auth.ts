import { supabase } from "./supabase";
import { saveSettings } from "./db";
import type { UserTier } from "./types";

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserTier(): Promise<UserTier> {
  const user = await getUser();
  if (!user) return "free";

  const { data } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .single();

  const tier = (data?.tier as UserTier) || "free";
  // Sync to localStorage for offline access
  saveSettings({ tier });
  return tier;
}

export async function signOut() {
  await supabase.auth.signOut();
  saveSettings({ tier: "free" });
  window.location.href = "/";
}
