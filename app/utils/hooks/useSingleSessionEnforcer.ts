"use client";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useSingleSessionEnforcer() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const localSession = localStorage.getItem("session_id");

      const { data: userData } = await supabase
        .from("users")
        .select("current_session_id")
        .eq("id", user.id)
        .maybeSingle();

      if (!userData) return;

      // If current session doesn't match local session
      if (userData.current_session_id && userData.current_session_id !== localSession) {
        // ✅ Sonner toast interactive prompt
        toast(
          "You are already logged in on another device. Click 'Continue' to log out from there and continue here.",
          {
            action: {
              label: "Continue",
              onClick: async () => {
                const newSessionId = crypto.randomUUID();

                await supabase
                  .from("users")
                  .update({ current_session_id: newSessionId })
                  .eq("id", user.id);

                localStorage.setItem("session_id", newSessionId);

                router.refresh(); // Reload page state after session update
              },
            },
          }
        );
      } else if (!userData.current_session_id) {
        // No active session: set current session
        const newSessionId = crypto.randomUUID();
        await supabase
          .from("users")
          .update({ current_session_id: newSessionId })
          .eq("id", user.id);
        localStorage.setItem("session_id", newSessionId);
      }
    };

    checkSession();
  }, [router, supabase]);
}
