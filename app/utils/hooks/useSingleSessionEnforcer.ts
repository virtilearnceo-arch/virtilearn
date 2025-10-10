"use client";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function useSingleSessionEnforcer() {
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const localSession = localStorage.getItem("session_id");

      const { data } = await supabase
        .from("users")
        .select("current_session_id")
        .eq("id", user.id)
        .single();

      if (data?.current_session_id !== localSession) {
        alert("You have been logged out because you signed in on another device.");
        await supabase.auth.signOut();
        localStorage.removeItem("session_id");
        window.location.href = "/auth/login";
      }
    };

    checkSession();
  }, []);
}
