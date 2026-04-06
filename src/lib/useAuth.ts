"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { saveSettings, getSettings } from "./db";
import type { UserTier } from "./types";

async function getResolvedTier(userId: string): Promise<UserTier> {
  const { data, error } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", userId)
    .single();

  if (error) {
    return (getSettings().tier as UserTier) || "free";
  }

  return (data?.tier as UserTier) || "free";
}

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [tier, setTier] = useState<UserTier>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const userTier = await getResolvedTier(user.id);
        setTier(userTier);
        saveSettings({ tier: userTier });
      } else {
        saveSettings({ tier: "free" });
      }
      setLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        const userTier = await getResolvedTier(session.user.id);
        setTier(userTier);
        saveSettings({ tier: userTier });
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setTier("free");
        saveSettings({ tier: "free", stripeSessionId: undefined });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, tier, loading, isPro: tier === "pro" || tier === "premium", isPremium: tier === "premium" };
}
