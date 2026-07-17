"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Church } from "lucide-react";
import { pastorSignIn } from "@/app/actions/auth";
import { initialFormState } from "@/lib/form-state";
import FormMessage from "@/components/forms/FormMessage";

export default function PastorLoginPage() {
  const [state, formAction, pending] = useActionState(
    pastorSignIn,
    initialFormState
  );

  return (
    <main className="hero-light flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl bg-cream-50 p-8 shadow-xl sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-royal-100">
            <Church className="h-8 w-8 text-royal-700" aria-hidden />
          </div>
          <h1 className="font-serif text-3xl font-semibold text-midnight-900">
            Pastor Login
          </h1>
          <p className="mt-2 text-midnight-700">
            Welcome back. Sign in to post a sermon.
          </p>
        </div>

        <form action={formAction} className="space-y-6" noValidate>
          <div>
            <label
              htmlFor="pl-username"
              className="mb-2 block text-lg font-semibold text-midnight-800"
            >
              Username
            </label>
            <input
              id="pl-username"
              name="username"
              type="text"
              required
              autoComplete="username"
              autoCapitalize="none"
              className="block w-full rounded-2xl border border-midnight-200 bg-white px-5 py-4 text-lg text-midnight-900 focus:border-royal-500"
            />
          </div>
          <div>
            <label
              htmlFor="pl-password"
              className="mb-2 block text-lg font-semibold text-midnight-800"
            >
              Password
            </label>
            <input
              id="pl-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="block w-full rounded-2xl border border-midnight-200 bg-white px-5 py-4 text-lg text-midnight-900 focus:border-royal-500"
            />
          </div>

          <FormMessage state={state} />

          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-royal-600 px-7 py-4 text-lg font-semibold text-white transition-colors hover:bg-royal-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Signing In…" : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-midnight-600">
          <Link
            href="/"
            className="font-semibold text-royal-700 hover:text-royal-600"
          >
            ← Back to the website
          </Link>
        </p>
      </div>
    </main>
  );
}
