"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

/**
 * Browser client for signed-in pastor features (e.g. uploading sermon
 * videos to Supabase Storage). Uses only the public URL and anon key —
 * authorization comes from the pastor's session cookie.
 */
export function createBrowserSupabase() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
