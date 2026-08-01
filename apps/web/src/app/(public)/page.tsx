"use client";

import {
  Icon,
  LandingCardsSection,
  LandingFaq,
  LandingFinalCta,
  LandingHero,
  LandingPricing,
  LandingStats,
  LandingTrust,
  LandingWorkflow,
} from "@ac/ui";
import {
  Bot,
  FileSearch,
  Lock,
  Plug,
  ScanText,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

export default function LandingPage() {
  return (
    <>
      <LandingHero
        title="Enterprise documents, OCR, and AI — in one archive"
        description="Upload, classify, review, and approve with Postgres-backed search and Giulia assistance. Built for multi-tenant SaaS teams."
        onPrimary={() => { window.location.href = "/register"; }}
        onSecondary={() => { window.location.href = "/contact"; }}
        visual={
          <div className="flex h-full flex-col justify-end gap-3 text-sm text-[var(--dm-color-muted)]">
            <div className="rounded-xl border border-[var(--dm-color-border)] bg-white/80 p-4 shadow-md">
              <p className="font-semibold text-[var(--dm-color-foreground)]">Today</p>
              <p>128 documents processed · 96% OCR confidence</p>
            </div>
            <div className="rounded-xl border border-[var(--dm-color-border)] bg-white/80 p-4 shadow-md">
              <p className="font-semibold text-[var(--dm-color-foreground)]">Giulia</p>
              <p>“Show unpaid invoices over €5k from last week.”</p>
            </div>
          </div>
        }
      />
      <LandingTrust logos={["NovaBank", "Helios Retail", "Lex & Co", "PortoLog", "MediCare PT"]} />
      <LandingStats
        stats={[
          { value: "96%", label: "Median OCR accuracy" },
          { value: "4.2m", label: "Average cycle time" },
          { value: "40+", label: "ERP & storage connectors" },
          { value: "EU", label: "Data residency ready" },
        ]}
      />
      <div id="solutions">
        <LandingCardsSection
          eyebrow="Solutions"
          title="Built for document-heavy operations"
          description="Compose workflows without forking your design system."
          items={[
            { id: "ap", title: "Accounts payable", description: "Invoice capture, vendor matching, approval SLAs.", icon: <Icon icon={FileSearch} /> },
            { id: "legal", title: "Legal archive", description: "Contracts with taxonomy, retention, and audit trail.", icon: <Icon icon={Lock} /> },
            { id: "ops", title: "Ops intake", description: "Scan queues with confidence gates and human review.", icon: <Icon icon={ScanText} /> },
          ]}
        />
      </div>
      <LandingWorkflow
        steps={[
          { id: "1", title: "Upload", description: "Drag PDFs or images into the secure tenant bucket." },
          { id: "2", title: "OCR + classify", description: "Workers extract text; DeepSeek proposes taxonomy." },
          { id: "3", title: "Review & archive", description: "Approve low-confidence fields, then metadata-driven archive." },
        ]}
      />
      <div id="features">
        <LandingCardsSection
          eyebrow="Features"
          title="Premium AI SaaS building blocks"
          items={[
            { id: "ocr", title: "Calibrated OCR", description: "Worker-only pipelines with review harness.", icon: <Icon icon={ScanText} /> },
            { id: "search", title: "Postgres FTS", description: "tsvector + trigram — no Elasticsearch tax.", icon: <Icon icon={FileSearch} /> },
            { id: "wf", title: "Workflows", description: "Approvals, timelines, and status badges.", icon: <Icon icon={Workflow} /> },
            { id: "sec", title: "Tenant RLS", description: "org_id isolation across every query path.", icon: <Icon icon={ShieldCheck} /> },
          ]}
        />
      </div>
      <LandingCardsSection
        eyebrow="Integrations"
        title="Connect ERP, storage, and messaging"
        items={[
          { id: "sap", title: "SAP", description: "Push approved invoices to S/4HANA.", icon: <Icon icon={Plug} /> },
          { id: "sp", title: "SharePoint", description: "Archive finalized PDFs to libraries.", icon: <Icon icon={Plug} /> },
          { id: "wa", title: "WhatsApp", description: "Notify approvers via Twilio.", icon: <Icon icon={Plug} /> },
        ]}
      />
      <LandingCardsSection
        eyebrow="Security"
        title="Enterprise controls by default"
        items={[
          { id: "rls", title: "Row-level security", description: "Supabase RLS on every tenant table." },
          { id: "audit", title: "Audit timeline", description: "Who changed what, when — exportable." },
          { id: "rgpd", title: "RGPD tooling", description: "Retention and erasure via metadata policies." },
        ]}
      />
      <LandingCardsSection
        eyebrow="AI"
        title="Giulia — your document assistant"
        description="Semantic search, suggested actions, and conversation history over your archive."
        items={[
          { id: "chat", title: "Chat", description: "Ask in natural language across documents.", icon: <Icon icon={Bot} /> },
          { id: "suggest", title: "Suggested actions", description: "Approve, reclassify, or escalate in one click.", icon: <Icon icon={Sparkles} /> },
        ]}
      />
      <LandingCardsSection
        eyebrow="Use cases"
        title="Where teams start"
        items={[
          { id: "u1", title: "AP automation", description: "From mailbox to ERP in minutes." },
          { id: "u2", title: "Contract intelligence", description: "Find clauses without opening every PDF." },
          { id: "u3", title: "Compliance packs", description: "Assemble evidence for audits fast." },
        ]}
      />
      <LandingCardsSection
        eyebrow="Testimonials"
        title="Operators love the calm UI"
        items={[
          { id: "t1", title: "“Cut review backlog in half.”", description: "— Head of AP, Helios Retail" },
          { id: "t2", title: "“Giulia finds what search used to miss.”", description: "— Knowledge lead, Lex & Co" },
        ]}
      />
      <LandingPricing
        tiers={[
          { id: "starter", name: "Starter", price: "€99/mo", description: "For pilots", features: ["2 seats", "5k pages OCR", "Email support"], cta: "Start trial", onCta: () => { window.location.href = "/register"; } },
          { id: "pro", name: "Pro", price: "€399/mo", description: "Growing teams", features: ["20 seats", "50k pages OCR", "Giulia AI", "Integrations"], highlighted: true, cta: "Start trial", onCta: () => { window.location.href = "/register"; } },
          { id: "enterprise", name: "Enterprise", price: "Custom", description: "Scale & SSO", features: ["Unlimited seats", "Dedicated workers", "SSO / SCIM", "EU residency"], cta: "Talk to sales", onCta: () => { window.location.href = "/contact"; } },
        ]}
      />
      <LandingFaq
        items={[
          { id: "q1", question: "Is OCR run in the browser?", answer: "No. Heavy OCR and PDF work runs only in workers." },
          { id: "q2", question: "Do you use Elasticsearch?", answer: "Search is Postgres FTS + trigram — simpler ops, strong tenant isolation." },
          { id: "q3", question: "Can we keep files where they are?", answer: "Archive is metadata-driven; we do not reshuffle Storage objects to organize." },
        ]}
      />
      <LandingFinalCta
        title="Ready to modernize your document stack?"
        description="Start a trial or book a walkthrough with our team."
        onCta={() => { window.location.href = "/register"; }}
      />
    </>
  );
}
