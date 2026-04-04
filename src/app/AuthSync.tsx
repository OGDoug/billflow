"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { saveSettings } from "@/lib/db";
import { migrateToCloudStorage, syncFromCloud } from "@/lib/db";
import type { UserTier } from "@/lib/types";

export default function AuthSync() {
  useEffect(() => {
    const syncTier = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("tier")
          .eq("id", user.id)
          .single();
        const tier = (data?.tier as UserTier) || "free";
        saveSettings({ tier });
        
        // If user is Pro/Premium, migrate and sync data on initial load
        if (tier === 'pro' || tier === 'premium') {
          await migrateToCloudStorage();
          await syncFromCloud();
        }
      }
    };

    syncTier();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("tier")
          .eq("id", session.user.id)
          .single();
        const tier = (data?.tier as UserTier) || "free";
        const currentSettings = saveSettings({ tier });
        
        // If user upgraded to Pro/Premium, migrate their localStorage data to cloud
        if ((tier === 'pro' || tier === 'premium') && currentSettings.tier !== tier) {
          console.log('User upgraded to', tier, '- starting migration...');
          await migrateToCloudStorage();
        }
        
        // If user is Pro/Premium, sync settings from cloud
        if (tier === 'pro' || tier === 'premium') {
          await syncFromCloud();
        }
      } else if (event === "SIGNED_OUT") {
        // Don't reset tier on sign out - user may still have active subscription
        // Tier should only be reset when subscription actually ends (via webhook)
        // Keep current tier in localStorage so they can access Pro features after re-login
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
