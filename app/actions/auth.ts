"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { checkRateLimit } from "@/lib/rate-limit";
import type { FormState } from "@/lib/form-state";

export async function signIn(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message:
        "The website is not connected to its database yet. Please finish the Supabase setup described in the README.",
    };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      status: "error",
      message: "Please enter both your email and your password.",
    };
  }

  // Slow down brute-force attempts: 5 tries per 15 minutes per address.
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  if (!checkRateLimit(`login:${ip}:${email.toLowerCase()}`, 5, 15 * 60_000)) {
    return {
      status: "error",
      message:
        "Too many sign-in attempts. Please wait 15 minutes and try again.",
    };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      status: "error",
      message:
        "That email or password didn't match. Please check them and try again.",
    };
  }

  redirect("/admin");
}

export async function signOut(): Promise<void> {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
