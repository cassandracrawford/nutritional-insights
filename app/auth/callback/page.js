"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    async function completeAuth() {
      const { data: sessionData, error } = await supabase.auth.getSession();

      if (error || !sessionData?.session) {
        router.replace("/");
        return;
      }

      router.replace("/dashboard");
    }

    completeAuth();
  }, [router]);

  return null;
}
