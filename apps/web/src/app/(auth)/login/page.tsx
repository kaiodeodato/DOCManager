"use client";
import { useState } from "react";
import { AuthLayout, Button, Input } from "@ac/ui";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <AuthLayout
      brand="DOC Manager"
      title="Sign in"
      description="Access your tenant workspace."
      aside={
        <div>
          <p className="text-sm opacity-80">Secure archive</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            OCR, classification, and Giulia — ready for your team.
          </h2>
        </div>
      }
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setSubmitting(true);
          setError(null);
          const form = new FormData(e.currentTarget);
          const email = String(form.get("email") ?? "");
          const password = String(form.get("password") ?? "");
          const { error: authError } = await createBrowserSupabaseClient().auth.signInWithPassword({
            email,
            password,
          });
          if (authError) {
            setError(authError.message);
            setSubmitting(false);
            return;
          }
          window.location.href = "/dashboard";
        }}
      >
        <Input label="Email" type="email" name="email" autoComplete="email" required />
        <Input label="Password" type="password" name="password" autoComplete="current-password" required />
        {error ? <p className="text-sm text-red-600" role="alert">{error}</p> : null}
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
        <p className="text-sm text-[var(--dm-color-muted)]">
          <a href="/forgot-password">Forgot password?</a> · <a href="/register">Create account</a>
        </p>
      </form>
    </AuthLayout>
  );
}
