import { Button, PublicLayout } from "@ac/ui";

export function MarketingChrome({ children }: { children: React.ReactNode }) {
  return (
    <PublicLayout
      brand={<a href="/">DOC Manager</a>}
      nav={
        <>
          <a href="/#solutions">Solutions</a>
          <a href="/#features">Features</a>
          <a href="/pricing">Pricing</a>
          <a href="/blog">Blog</a>
          <a href="/case-studies">Customers</a>
          <a href="/industries">Industries</a>
          <a href="/contact">Contact</a>
        </>
      }
      actions={
        <>
          <a href="/login">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </a>
          <a href="/register">
            <Button variant="primary" size="sm">
              Start free
            </Button>
          </a>
        </>
      }
      footer={
        <div className="flex flex-wrap justify-between gap-4">
          <span>© {new Date().getFullYear()} DOC Manager</span>
          <span className="flex gap-4">
            <a href="/blog">Blog</a>
            <a href="/contact">Contact</a>
            <a href="/login">App</a>
          </span>
        </div>
      }
    >
      {children}
    </PublicLayout>
  );
}
