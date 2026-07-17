export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Template values that mean "setup was never finished" — a paste of
// the docs' example text rather than a real value.
const PLACEHOLDER_FRAGMENTS = [
  "your-project",
  "your-anon-key",
  "your_anon_key",
  "example.supabase",
];

function isPlaceholder(value: string): boolean {
  const lower = value.toLowerCase();
  return PLACEHOLDER_FRAGMENTS.some((fragment) => lower.includes(fragment));
}

/**
 * Describes what is wrong with the Supabase configuration, or null
 * when it looks valid. Used to log a precise reason server-side so a
 * misconfigured deploy is diagnosable from the function logs alone.
 */
export function supabaseConfigProblem(): string | null {
  if (!SUPABASE_URL) {
    return "NEXT_PUBLIC_SUPABASE_URL is not set";
  }
  if (!SUPABASE_URL.startsWith("http") || isPlaceholder(SUPABASE_URL)) {
    return "NEXT_PUBLIC_SUPABASE_URL still contains a placeholder value";
  }
  if (!SUPABASE_ANON_KEY) {
    return "NEXT_PUBLIC_SUPABASE_ANON_KEY is not set";
  }
  // Real keys are long: legacy anon JWTs are ~200+ chars and new
  // publishable keys ~40+. Short values are placeholders or typos.
  if (SUPABASE_ANON_KEY.length <= 20 || isPlaceholder(SUPABASE_ANON_KEY)) {
    return "NEXT_PUBLIC_SUPABASE_ANON_KEY still contains a placeholder value";
  }
  return null;
}

/**
 * True when real Supabase credentials are present. When they are not
 * (e.g. a fresh checkout before setup), public pages fall back to the
 * built-in sample content instead of crashing.
 */
export function isSupabaseConfigured(): boolean {
  return supabaseConfigProblem() === null;
}
