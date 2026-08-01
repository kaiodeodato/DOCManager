"use client";
import { AuthLayout, Button, Input } from "@ac/ui";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout brand="DOC Manager" title="Reset password" description="We will email a secure link.">
      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <Input label="Email" type="email" name="email" required />
        <Button type="submit" variant="primary">
          Send reset link
        </Button>
        <p className="text-sm">
          <a href="/login">Back to sign in</a>
        </p>
      </form>
    </AuthLayout>
  );
}
