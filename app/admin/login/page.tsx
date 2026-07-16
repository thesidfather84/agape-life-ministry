"use client";

import { useActionState } from "react";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { signIn } from "@/app/actions/auth";
import { initialFormState } from "@/lib/form-state";
import { field, label } from "@/lib/ui";
import FormMessage from "@/components/forms/FormMessage";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(signIn, initialFormState);

  return (
    <main className="hero-light flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl bg-cream-50 p-8 shadow-xl sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-royal-100">
            <KeyRound className="h-7 w-7 text-royal-700" aria-hidden />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-midnight-900">
            Church Admin Sign-In
          </h1>
          <p className="mt-2 text-sm text-midnight-700">
            For the pastor and church administrators.
          </p>
        </div>

        <form action={formAction} className="space-y-5" noValidate>
          <div>
            <label htmlFor="admin-email" className={label}>
              Email
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={field}
            />
          </div>
          <div>
            <label htmlFor="admin-password" className={label}>
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={field}
            />
          </div>

          <FormMessage state={state} />

          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-royal-600 px-7 py-3 font-semibold text-white transition-colors hover:bg-royal-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Signing In…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-midnight-600">
          <Link href="/" className="font-semibold text-royal-700 hover:text-royal-600">
            ← Back to the website
          </Link>
        </p>
      </div>
    </main>
  );
}
