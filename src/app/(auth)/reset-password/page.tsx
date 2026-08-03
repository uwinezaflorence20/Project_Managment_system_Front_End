"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/lib/auth-context";
import { resetPasswordSchema } from "@/lib/validation";
import { ApiError } from "@/lib/api-error";
import { AuthInput } from "@/components/AuthInput";
import { Spinner } from "@/components/ui/Spinner";

const LockIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v2h8z"
    />
  </svg>
);

function ResetPasswordForm() {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!token) {
    return (
      <>
        <h1 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">Invalid reset link</h1>
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
          This password reset link is missing or invalid. Request a new one to continue.
        </p>
        <Link
          href="/forgot-password"
          className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-cyan-400 dark:hover:text-cyan-300"
        >
          Request a new link
        </Link>
      </>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    const parsed = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errors[issue.path[0] as string] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setIsSubmitting(true);
    try {
      await resetPassword(token!, parsed.data.password);
      router.push("/login?reset=1");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "This link may have expired. Please request a new one.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">Reset your password</h1>
      <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">Choose a new password for your account.</p>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <AuthInput
          id="password"
          type="password"
          label="New password"
          placeholder="At least 6 characters"
          icon={LockIcon}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          autoFocus
        />
        <AuthInput
          id="confirmPassword"
          type="password"
          label="Confirm new password"
          placeholder="Re-enter your password"
          icon={LockIcon}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          {isSubmitting && <Spinner className="h-4 w-4" />}
          Reset password
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
