"use client";
import { useState } from "react";
import { AuthLayout, Button, Input } from "@ac/ui";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <AuthLayout brand="DOC Manager" title="Create account" description="Start a 14-day Pro trial.">
      <form
        className="flex flex-col gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setSubmitting(true);
          setError(null);
          const form = new FormData(e.currentTarget);
          const fullName = String(form.get("name") ?? "");
          const email = String(form.get("email") ?? "");
          const password = String(form.get("password") ?? "");
          const { data, error: authError } = await createBrowserSupabaseClient().auth.signUp({
            email,
            password,
            options: {
              data: { full_name: fullName },
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });
          if (authError) {
            setError(authError.message);
            setSubmitting(false);
            return;
          }
          if (!data.session) {
            setError("Check your email to confirm your account, then sign in.");
            setSubmitting(false);
            return;
          }
          const bootstrap = await fetch("/api/auth/bootstrap-org", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ organizationName: `${fullName}'s workspace` }),
          });
          if (!bootstrap.ok) {
            const result = (await bootstrap.json()) as { error?: string };
            setError(result.error ?? "Could not create your workspace");
            setSubmitting(false);
            return;
          }
          window.location.href = "/dashboard";
        }}
      >
        <Input label="Full name" name="name" required />
        <Input label="Work email" type="email" name="email" required />
        <Input label="Password" type="password" name="password" required />
        {error ? <p className="text-sm text-red-600" role="alert">{error}</p> : null}
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </Button>
        <p className="text-sm text-[var(--dm-color-muted)]">
          <a href="/login">Already have an account?</a>
        </p>
      </form>
    </AuthLayout>
  );
}
