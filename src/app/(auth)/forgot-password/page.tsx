"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAuth } from "@/lib/auth-context";
import { forgotPasswordSchema } from "@/lib/validation";
import { ApiError } from "@/lib/api-error";
import { AuthInput } from "@/components/AuthInput";
import { Spinner } from "@/components/ui/Spinner";

const EmailIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message);
      return;
    }
    setFieldError(undefined);

    setIsSubmitting(true);
    try {
      await forgotPassword(parsed.data.email);
      setIsSubmitted(true);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <>
        <h1 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">Check your email</h1>
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
          If an account exists for <span className="font-medium text-slate-800 dark:text-slate-200">{email}</span>,
          we&apos;ve sent a link to reset your password.
        </p>
        <Link
          href="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-cyan-400 dark:hover:text-cyan-300"
        >
          ← Back to login
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">Forgot password?</h1>
      <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
        Enter your email and we&apos;ll send you a link to reset it.
      </p>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <AuthInput
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          icon={EmailIcon}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldError}
          autoFocus
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          {isSubmitting && <Spinner className="h-4 w-4" />}
          Send reset link
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Remembered your password?{" "}
        <Link
          href="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-cyan-400 dark:hover:text-cyan-300"
        >
          Login
        </Link>
      </p>
    </>
  );
}
