"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { saveSettings, getSettings } from "@/lib/db";
import { migrateToCloudStorage, syncFromCloud } from "@/lib/db";
import type { UserTier } from "@/lib/types";

async function resolveTier(userId: string): Promise<UserTier> {
  const { data, error } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", userId)
    .single();

  if (error) {
    console.warn("Could not load profile tier, falling back to local settings:", error.message);
    const fallbackTier = getSettings().tier;
    return (fallbackTier as UserTier) || "free";
  }

  return (data?.tier as UserTier) || "free";
}

export default function AuthSync() {
  useEffect(() => {
    const syncTier = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const tier = await resolveTier(user.id);
      saveSettings({ tier });
      
      if (tier === 'pro' || tier === 'premium') {
        await migrateToCloudStorage();
        await syncFromCloud();
      }
    };

    syncTier();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const previousTier = getSettings().tier;
        const tier = await resolveTier(session.user.id);
        saveSettings({ tier });
        
        if ((tier === 'pro' || tier === 'premium') && previousTier !== tier) {
          console.log('User upgraded to', tier, '- starting migration...');
          await migrateToCloudStorage();
        }
        
        if (tier === 'pro' || tier === 'premium') {
          await syncFromCloud();
        }
      } else if (event === "SIGNED_OUT") {
        saveSettings({ tier: "free", stripeSessionId: undefined });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
