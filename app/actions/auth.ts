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

/**
 * Simple pastor sign-in: the pastor types the username "pastor" and
 * their password. The username maps server-side to the pastor's
 * Supabase Auth account (PASTOR_LOGIN_EMAIL), and Supabase verifies
 * the password against its securely hashed store — the password never
 * appears in this codebase or in browser JavaScript.
 */
export async function pastorSignIn(
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

  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return {
      status: "error",
      message: "Please enter both the username and the password.",
    };
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  if (!checkRateLimit(`pastor-login:${ip}`, 5, 15 * 60_000)) {
    return {
      status: "error",
      message:
        "Too many sign-in attempts. Please wait 15 minutes and try again.",
    };
  }

  const pastorEmail =
    process.env.PASTOR_LOGIN_EMAIL ?? "pastor@agapelifeministry.org";

  const WRONG =
    "That username or password didn't match. Please try again.";

  if (username !== "pastor") {
    return { status: "error", message: WRONG };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({
    email: pastorEmail,
    password,
  });

  if (error) {
    return { status: "error", message: WRONG };
  }

  redirect("/pastor");
}

export async function signOutPastor(): Promise<void> {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/");
}
