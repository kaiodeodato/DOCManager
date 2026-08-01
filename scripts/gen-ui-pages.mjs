import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = "apps/web/src/app";
const useAppShell = existsSync("apps/web/src/components/AppShell.tsx");
const shellImport = useAppShell ? "@/components/AppShell" : "@/components/AppChrome";
const Shell = useAppShell ? "AppShell" : "AppChrome";

function w(rel, content) {
  const p = join(root, rel);
  mkdirSync(join(p, ".."), { recursive: true });
  writeFileSync(p, content.replace(/\r\n/g, "\n"), "utf8");
  console.log("wrote", rel);
}

w(
  "page.tsx",
  `"use client";

import {
  LandingCardsSection,
  LandingFaq,
  LandingFinalCta,
  LandingHero,
  LandingPricing,
  LandingStats,
  LandingTrust,
  LandingWorkflow,
} from "@ac/ui";
import { MarketingChrome } from "@/components/MarketingChrome";

export default function HomePage() {
  return (
    <MarketingChrome>
      <LandingHero
        title="Document operations that move at business speed"
        description="Capture, OCR, classify, review, and archive — with Giulia AI as your co-pilot."
        primaryCta="Start free"
        secondaryCta="Book demo"
        onPrimary={() => {
          window.location.href = "/register";
        }}
        onSecondary={() => {
          window.location.href = "/contact";
        }}
        visual={
          <div className="rounded-2xl border border-[var(--dm-color-border)] bg-[var(--dm-color-surface)] p-6 shadow-lg">
            <p className="text-sm font-semibold text-[var(--dm-color-accent)]">Live pipeline</p>
            <p className="mt-2 text-3xl font-semibold">96.4% OCR</p>
            <p className="mt-1 text-sm text-[var(--dm-color-muted)]">Avg. cycle 4.2 minutes</p>
          </div>
        }
      />
      <LandingTrust logos={["ACME", "Contoso", "Northwind", "Fabrikam", "Tailspin"]} />
      <LandingStats
        stats={[
          { value: "12k+", label: "Docs / month" },
          { value: "96%", label: "Extraction accuracy" },
          { value: "62%", label: "Faster AP cycles" },
          { value: "EU", label: "Data residency ready" },
        ]}
      />
      <div id="solutions">
        <LandingCardsSection
          eyebrow="Solutions"
          title="Built for finance, legal, and ops"
          items={[
            { id: "ap", title: "Accounts payable", description: "Invoices to ERP with human-in-the-loop review." },
            { id: "legal", title: "Matter archives", description: "Contracts searchable across practice areas." },
            { id: "ops", title: "Ops intake", description: "Photos, PDFs, and email attachments in one queue." },
          ]}
        />
      </div>
      <LandingWorkflow
        steps={[
          { id: "1", title: "Capture", description: "Upload, camera, or connector intake." },
          { id: "2", title: "OCR + classify", description: "Tesseract + DeepSeek with taxonomy prompts." },
          { id: "3", title: "Review & approve", description: "Confidence-aware corrections and workflows." },
          { id: "4", title: "Export & notify", description: "ERP push, signed share links, WhatsApp/email." },
        ]}
      />
      <div id="features">
        <LandingCardsSection
          eyebrow="Features"
          title="Everything your document stack needs"
          items={[
            { id: "ocr", title: "OCR pipeline", description: "Preprocess, extract, calibrate." },
            { id: "ai", title: "Giulia assistant", description: "Ask questions across the archive." },
            { id: "wf", title: "Approvals", description: "Status machine with audit trail." },
            { id: "tax", title: "Taxonomy", description: "Per-tenant types without reprocessing." },
          ]}
        />
      </div>
      <LandingCardsSection
        eyebrow="Integrations"
        title="Connect the systems you already run"
        items={[
          { id: "sap", title: "SAP", description: "Invoice export sandbox connector." },
          { id: "sp", title: "SharePoint", description: "Archive finalized PDFs." },
          { id: "tw", title: "Twilio", description: "WhatsApp notify stubs." },
        ]}
      />
      <LandingCardsSection
        eyebrow="Security"
        title="Tenant isolation by default"
        items={[
          { id: "rls", title: "RLS + JWT claims", description: "Org-scoped access in Supabase." },
          { id: "audit", title: "Append-only audit", description: "Sensitive table triggers." },
          { id: "gdpr", title: "RGPD export", description: "Export and anonymize APIs." },
        ]}
      />
      <LandingCardsSection
        eyebrow="AI · Giulia"
        title="Semantic answers, grounded in your docs"
        items={[
          { id: "search", title: "Tool-calling search", description: "searchDocuments, sumByPeriod, getById." },
          { id: "review", title: "Review assist", description: "Surface low-confidence extracted fields." },
        ]}
      />
      <LandingCardsSection
        eyebrow="Use cases"
        title="Where teams start"
        items={[
          { id: "invoice", title: "Invoice intake", description: "From PDF drop to ERP posting." },
          { id: "expense", title: "Expense receipts", description: "Mobile capture with crop." },
          { id: "policy", title: "Policy archive", description: "Versioned internal docs." },
        ]}
      />
      <LandingCardsSection
        eyebrow="Customers"
        title="Operators trust the queue"
        items={[
          { id: "t1", title: "Ana · AP lead", description: "Cycle time dropped under a week." },
          { id: "t2", title: "João · Legal ops", description: "One corpus across 14 practices." },
        ]}
      />
      <LandingPricing
        tiers={[
          {
            id: "starter",
            name: "Starter",
            price: "€49/mo",
            features: ["1 org", "5 users", "OCR + review"],
            cta: "Start",
            onCta: () => {
              window.location.href = "/register";
            },
          },
          {
            id: "pro",
            name: "Pro",
            price: "€199/mo",
            highlighted: true,
            features: ["Giulia AI", "Integrations", "Approvals"],
            cta: "Start Pro",
            onCta: () => {
              window.location.href = "/register";
            },
          },
          {
            id: "enterprise",
            name: "Enterprise",
            price: "Custom",
            features: ["SSO", "Dedicated support", "EU residency"],
            cta: "Contact",
            onCta: () => {
              window.location.href = "/contact";
            },
          },
        ]}
      />
      <LandingFaq
        items={[
          {
            id: "q1",
            question: "Do you reprocess old docs when taxonomy changes?",
            answer: "No — taxonomy changes apply to new classifications only.",
          },
          {
            id: "q2",
            question: "Is DeepSeek required in CI?",
            answer: "No — workers use mockable clients for tests.",
          },
          {
            id: "q3",
            question: "Can viewers approve?",
            answer: "No — approval requires accountant/owner capability.",
          },
        ]}
      />
      <LandingFinalCta
        title="Ready to clear the document backlog?"
        description="Spin up DOC Manager and run your first OCR job today."
        onCta={() => {
          window.location.href = "/register";
        }}
      />
    </MarketingChrome>
  );
}
`,
);

function appPage(title, imports, body) {
  const titleProp = useAppShell ? ` title="${title}"` : "";
  return `"use client";

import { ${Shell} } from "${shellImport}";
${imports}

export default function Page() {
  return (
    <${Shell}${titleProp}>
      ${body}
    </${Shell}>
  );
}
`;
}

w(
  "ocr/page.tsx",
  appPage(
    "OCR Queue",
    `import { Button } from "@ac/ui";
import { MOCK_DOCUMENTS } from "@/lib/mock-data";`,
    `<div className="flex flex-col gap-6">
        <header>
          <h2 className="text-2xl font-semibold">OCR queue</h2>
          <p className="text-sm text-[var(--dm-color-muted)]">Jobs waiting for extract / review.</p>
        </header>
        <ul className="flex flex-col gap-3">
          {MOCK_DOCUMENTS.filter((d) => d.status !== "approved").map((d) => (
            <li key={d.id} className="flex items-center justify-between rounded-xl border border-[var(--dm-color-border)] bg-[var(--dm-color-surface)] p-4 dm-hover-lift">
              <div>
                <p className="font-medium">{d.name}</p>
                <p className="text-sm text-[var(--dm-color-muted)]">{d.type} · confidence {(d.confidence * 100).toFixed(0)}%</p>
              </div>
              <a href={"/ocr/review?id=" + d.id}><Button size="sm">Open review</Button></a>
            </li>
          ))}
        </ul>
      </div>`,
  ),
);

w("ocr/queue/page.tsx", `"use client";\nexport { default } from "../page";\n`);

w(
  "approvals/page.tsx",
  appPage(
    "Approvals",
    `import { Button, StatusBadge, Timeline } from "@ac/ui";
import { MOCK_DOCUMENTS } from "@/lib/mock-data";`,
    `<div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Approval inbox</h2>
          {MOCK_DOCUMENTS.map((d) => (
            <div key={d.id} className="flex items-center justify-between gap-4 rounded-xl border border-[var(--dm-color-border)] p-4">
              <div>
                <p className="font-medium">{d.name}</p>
                <StatusBadge status={d.status === "approved" ? "approved" : d.status === "needs_review" ? "needs_review" : "classified"} />
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="primary">Approve</Button>
                <Button size="sm" variant="danger">Reject</Button>
              </div>
            </div>
          ))}
        </div>
        <Timeline
          items={[
            { id: "1", title: "Received", time: "10:12", status: "done" },
            { id: "2", title: "OCR complete", time: "10:14", status: "done" },
            { id: "3", title: "Needs review", time: "10:15", status: "current" },
            { id: "4", title: "Approved", time: "—", status: "pending" },
          ]}
        />
      </div>`,
  ),
);

w(
  "giulia/page.tsx",
  appPage(
    "Giulia",
    `import { Button, Input } from "@ac/ui";`,
    `<div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-xl border border-[var(--dm-color-border)] p-4">
          <p className="text-xs font-semibold uppercase text-[var(--dm-color-muted)]">History</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li><button type="button" className="text-left hover:text-[var(--dm-color-accent)]">Invoices last week</button></li>
            <li><button type="button" className="text-left hover:text-[var(--dm-color-accent)]">Vendor ACME total</button></li>
            <li><button type="button" className="text-left hover:text-[var(--dm-color-accent)]">RGPD policies</button></li>
          </ul>
          <p className="mt-6 text-xs font-semibold uppercase text-[var(--dm-color-muted)]">Suggested</p>
          <div className="mt-2 flex flex-col gap-2">
            <Button size="sm" variant="outline">Sum by period</Button>
            <Button size="sm" variant="outline">Find by id</Button>
            <Button size="sm" variant="outline">Semantic search</Button>
          </div>
        </aside>
        <div className="flex min-h-[420px] flex-col rounded-xl border border-[var(--dm-color-border)]">
          <div className="flex-1 space-y-3 p-4">
            <div className="max-w-[80%] rounded-lg bg-[var(--dm-color-surface-2)] p-3 text-sm">Ask me about your archive.</div>
            <div className="ml-auto max-w-[80%] rounded-lg bg-[var(--dm-color-accent)] p-3 text-sm text-white">Total invoices this month?</div>
            <div className="max-w-[80%] rounded-lg bg-[var(--dm-color-surface-2)] p-3 text-sm">Tool sumByPeriod → €12,450 across 18 docs.</div>
          </div>
          <form className="flex gap-2 border-t border-[var(--dm-color-border)] p-3" onSubmit={(e) => e.preventDefault()}>
            <Input name="q" placeholder="Ask Giulia…" className="flex-1" />
            <Button type="submit">Send</Button>
          </form>
        </div>
      </div>`,
  ),
);

w("assistant/page.tsx", `"use client";\nexport { default } from "../giulia/page";\n`);

w(
  "taxonomy/page.tsx",
  appPage(
    "Taxonomy",
    `import { Badge, Tabs } from "@ac/ui";
import { MOCK_CATEGORIES, MOCK_CUSTOM_FIELDS, MOCK_DOC_TYPES, MOCK_TAGS } from "@/lib/mock-data";`,
    `<Tabs
        items={[
          {
            id: "categories",
            label: "Categories",
            content: (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {MOCK_CATEGORIES.map((c) => (
                  <li key={c.id} className="rounded-xl border border-[var(--dm-color-border)] p-4">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-[var(--dm-color-muted)]">{c.docs} docs</p>
                  </li>
                ))}
              </ul>
            ),
          },
          {
            id: "tags",
            label: "Tags",
            content: (
              <div className="mt-4 flex flex-wrap gap-2">
                {MOCK_TAGS.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
            ),
          },
          {
            id: "types",
            label: "Document types",
            content: (
              <ul className="mt-4 space-y-2">
                {MOCK_DOC_TYPES.map((t) => (
                  <li key={t.id} className="flex justify-between rounded-lg border border-[var(--dm-color-border)] p-3">
                    <span>{t.name}</span>
                    <span className="text-sm text-[var(--dm-color-muted)]">{t.fields} fields</span>
                  </li>
                ))}
              </ul>
            ),
          },
          {
            id: "fields",
            label: "Custom fields",
            content: (
              <ul className="mt-4 space-y-2">
                {MOCK_CUSTOM_FIELDS.map((f) => (
                  <li key={f.id} className="flex justify-between rounded-lg border border-[var(--dm-color-border)] p-3">
                    <span>{f.name}</span>
                    <span className="text-sm text-[var(--dm-color-muted)]">
                      {f.type}
                      {f.required ? " · required" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            ),
          },
        ]}
      />`,
  ),
);

w(
  "integrations/page.tsx",
  appPage(
    "Integrations",
    `import { IntegrationCard } from "@ac/ui";
import { MOCK_INTEGRATIONS } from "@/lib/mock-data";`,
    `<div className="flex flex-col gap-6">
        <header>
          <h2 className="text-2xl font-semibold">Integrations</h2>
          <p className="text-sm text-[var(--dm-color-muted)]">Connect ERP, storage, and notify channels.</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          {MOCK_INTEGRATIONS.map((i) => (
            <a key={i.id} href={"/integrations/" + i.id} className="block dm-hover-lift">
              <IntegrationCard title={i.name} description={i.description} status={i.status} />
            </a>
          ))}
        </div>
      </div>`,
  ),
);

w(
  "integrations/[id]/page.tsx",
  `"use client";

import { useParams } from "next/navigation";
import { ${Shell} } from "${shellImport}";
import { Button, IntegrationCard } from "@ac/ui";
import { MOCK_INTEGRATIONS } from "@/lib/mock-data";

export default function IntegrationDetailPage() {
  const params = useParams();
  const id = String(params.id ?? "");
  const item = MOCK_INTEGRATIONS.find((i) => i.id === id) ?? MOCK_INTEGRATIONS[0]!;
  return (
    <${Shell}${useAppShell ? ' title="Integration"' : ""}>
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <IntegrationCard title={item.name} description={item.description} status={item.status} />
        <section className="rounded-xl border border-[var(--dm-color-border)] p-6">
          <h3 className="text-lg font-semibold">Connection wizard</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
            <li>Authorize OAuth / API key</li>
            <li>Map document types</li>
            <li>Test sandbox export</li>
            <li>Enable production sync</li>
          </ol>
          <Button className="mt-4" variant="primary">
            Continue setup
          </Button>
        </section>
      </div>
    </${Shell}>
  );
}
`,
);

w(
  "settings/page.tsx",
  appPage(
    "Settings",
    "",
    `<div className="grid gap-4 sm:grid-cols-2">
        {[
          ["Organization", "/settings/organization"],
          ["Users", "/settings/users"],
          ["Roles", "/settings/roles"],
          ["Security", "/settings/security"],
          ["Notifications", "/settings/notifications"],
          ["Taxonomy", "/settings/taxonomy"],
        ].map(([label, href]) => (
          <a key={href} href={href} className="rounded-xl border border-[var(--dm-color-border)] p-5 dm-hover-lift">
            <p className="font-semibold">{label}</p>
            <p className="text-sm text-[var(--dm-color-muted)]">Configure {String(label).toLowerCase()}</p>
          </a>
        ))}
      </div>`,
  ),
);

w(
  "settings/organization/page.tsx",
  appPage(
    "Organization",
    `import { Button, Input } from "@ac/ui";`,
    `<form className="mx-auto flex max-w-lg flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <Input label="Organization name" defaultValue="Acme Lda" />
        <Input label="Billing email" defaultValue="billing@acme.pt" />
        <Button type="submit">Save</Button>
      </form>`,
  ),
);

w(
  "settings/users/page.tsx",
  appPage(
    "Users",
    `import { Badge } from "@ac/ui";
import { MOCK_USERS } from "@/lib/mock-data";`,
    `<ul className="space-y-2">
        {MOCK_USERS.map((u) => (
          <li key={u.id} className="flex justify-between rounded-lg border border-[var(--dm-color-border)] p-3">
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-[var(--dm-color-muted)]">{u.email}</p>
            </div>
            <Badge>{u.role}</Badge>
          </li>
        ))}
      </ul>`,
  ),
);

w(
  "settings/roles/page.tsx",
  appPage(
    "Roles",
    `import { MOCK_ROLES } from "@/lib/mock-data";`,
    `<ul className="space-y-2">
        {MOCK_ROLES.map((r) => (
          <li key={r.id} className="rounded-lg border border-[var(--dm-color-border)] p-3">
            <p className="font-medium">{r.name}</p>
            <p className="text-sm text-[var(--dm-color-muted)]">{r.permissions}</p>
          </li>
        ))}
      </ul>`,
  ),
);

w(
  "settings/security/page.tsx",
  appPage(
    "Security",
    `import { Button, Input } from "@ac/ui";`,
    `<div className="mx-auto max-w-lg space-y-4">
        <p className="text-sm text-[var(--dm-color-muted)]">SSO, session timeout, and MFA controls (UI stub).</p>
        <label className="flex items-center justify-between rounded-lg border border-[var(--dm-color-border)] p-3">
          <span>Require MFA</span>
          <input type="checkbox" defaultChecked />
        </label>
        <label className="flex items-center justify-between rounded-lg border border-[var(--dm-color-border)] p-3">
          <span>Session timeout (hours)</span>
          <Input type="number" defaultValue={8} className="w-20" />
        </label>
        <Button>Save security</Button>
      </div>`,
  ),
);

w(
  "settings/notifications/page.tsx",
  appPage(
    "Notifications",
    `import { Button } from "@ac/ui";`,
    `<div className="mx-auto max-w-lg space-y-3">
        {["Email digests", "WhatsApp approvals", "Slack needs_review", "Export failures"].map((label) => (
          <label key={label} className="flex items-center justify-between rounded-lg border border-[var(--dm-color-border)] p-3">
            <span>{label}</span>
            <input type="checkbox" defaultChecked />
          </label>
        ))}
        <Button>Save preferences</Button>
      </div>`,
  ),
);

console.log("done");
