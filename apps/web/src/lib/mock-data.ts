/**
 * Mock data for UI pages (UI1–UI14). Replace with API/@ac/shared contracts later.
 */

export const MOCK_DOCUMENTS = [
  {
    id: "doc-001",
    name: "Invoice-ACME-2026-04.pdf",
    status: "processed" as const,
    type: "Invoice",
    tags: ["finance", "vendor"],
    uploadedAt: "2026-07-28T10:12:00Z",
    confidence: 0.94,
    ocrText: "ACME Corp\nInvoice #4821\nTotal: €12,450.00\nDue: 2026-08-15",
  },
  {
    id: "doc-002",
    name: "Contract-Renewal-Q3.pdf",
    status: "needs_review" as const,
    type: "Contract",
    tags: ["legal"],
    uploadedAt: "2026-07-29T14:40:00Z",
    confidence: 0.71,
    ocrText: "Service Agreement\nParties: Flowix / Contoso\nTerm: 24 months",
  },
  {
    id: "doc-003",
    name: "Receipt-Travel-Berlin.jpg",
    status: "processing" as const,
    type: "Receipt",
    tags: ["expense"],
    uploadedAt: "2026-07-30T09:05:00Z",
    confidence: 0.42,
    ocrText: "",
  },
  {
    id: "doc-004",
    name: "Policy-RGPD-Internal.pdf",
    status: "approved" as const,
    type: "Policy",
    tags: ["compliance", "rgpd"],
    uploadedAt: "2026-07-20T16:22:00Z",
    confidence: 0.98,
    ocrText: "Internal RGPD policy — retention 7 years.",
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    title: "OCR review required",
    body: "Contract-Renewal-Q3.pdf confidence 71%",
    time: "12m ago",
    unread: true,
    href: "/ocr/review",
  },
  {
    id: "n2",
    title: "Approval completed",
    body: "Policy-RGPD-Internal.pdf approved by Ana",
    time: "1h ago",
    unread: true,
    href: "/approvals",
  },
  {
    id: "n3",
    title: "Integration sync",
    body: "SAP connector finished nightly sync",
    time: "Yesterday",
    unread: false,
    href: "/integrations",
  },
];

export const MOCK_METRICS = [
  { title: "Documents", value: "12,480", delta: { value: "+8.2%", direction: "up" as const } },
  { title: "OCR accuracy", value: "96.4%", delta: { value: "+1.1%", direction: "up" as const } },
  { title: "Pending review", value: "37", delta: { value: "-12%", direction: "down" as const } },
  { title: "Avg. cycle time", value: "4.2m", delta: { value: "0%", direction: "flat" as const } },
];

export const MOCK_INTEGRATIONS = [
  {
    id: "sap",
    name: "SAP S/4HANA",
    status: "connected" as const,
    description: "Push approved invoices and pull vendor master data.",
  },
  {
    id: "sharepoint",
    name: "SharePoint",
    status: "connected" as const,
    description: "Archive finalized PDFs into site libraries.",
  },
  {
    id: "twilio",
    name: "Twilio WhatsApp",
    status: "available" as const,
    description: "Notify approvers on mobile via WhatsApp.",
  },
  {
    id: "slack",
    name: "Slack",
    status: "error" as const,
    description: "Channel alerts for needs_review documents.",
  },
];

export const MOCK_CATEGORIES = [
  { id: "c1", name: "Finance", docs: 420 },
  { id: "c2", name: "Legal", docs: 188 },
  { id: "c3", name: "HR", docs: 96 },
  { id: "c4", name: "Operations", docs: 310 },
];

export const MOCK_TAGS = ["invoice", "contract", "expense", "vendor", "rgpd", "urgent"];

export const MOCK_DOC_TYPES = [
  { id: "t1", name: "Invoice", fields: 8 },
  { id: "t2", name: "Contract", fields: 12 },
  { id: "t3", name: "Receipt", fields: 5 },
  { id: "t4", name: "Policy", fields: 4 },
];

export const MOCK_CUSTOM_FIELDS = [
  { id: "f1", name: "Vendor NIF", type: "text", required: true },
  { id: "f2", name: "Amount EUR", type: "number", required: true },
  { id: "f3", name: "Due date", type: "date", required: false },
  { id: "f4", name: "Cost center", type: "select", required: false },
];

export const MOCK_USERS = [
  { id: "u1", name: "Ana Silva", email: "ana@acme.pt", role: "Owner" },
  { id: "u2", name: "João Mendes", email: "joao@acme.pt", role: "Admin" },
  { id: "u3", name: "Maria Costa", email: "maria@acme.pt", role: "Reviewer" },
  { id: "u4", name: "Pedro Dias", email: "pedro@acme.pt", role: "Viewer" },
];

export const MOCK_ROLES = [
  { id: "r1", name: "Owner", permissions: "Full access" },
  { id: "r2", name: "Admin", permissions: "Manage users & settings" },
  { id: "r3", name: "Reviewer", permissions: "OCR review & approve" },
  { id: "r4", name: "Viewer", permissions: "Read-only archive" },
];

export const MOCK_BLOG = [
  {
    slug: "ocr-accuracy-playbook",
    title: "OCR accuracy playbook for finance teams",
    excerpt: "How calibration and human review loops lift extraction quality above 95%.",
    date: "2026-06-12",
  },
  {
    slug: "giulia-semantic-search",
    title: "Meet Giulia: semantic search for your archive",
    excerpt: "Ask natural-language questions across multi-tenant document corpora.",
    date: "2026-05-28",
  },
  {
    slug: "rgpd-retention",
    title: "RGPD retention without moving storage objects",
    excerpt: "Metadata-driven archive policies that stay compliant and cheap.",
    date: "2026-04-02",
  },
];

export const MOCK_CASE_STUDIES = [
  {
    id: "cs1",
    title: "Retail group cuts AP cycle time 62%",
    industry: "Retail",
    result: "From 11 days to 4 days average invoice approval.",
  },
  {
    id: "cs2",
    title: "Law firm unifies matter archives",
    industry: "Legal",
    result: "Single searchable corpus across 14 practice areas.",
  },
];

export const MOCK_INDUSTRIES = [
  { id: "i1", name: "Finance & AP", blurb: "Invoices, credit notes, vendor onboarding." },
  { id: "i2", name: "Healthcare", blurb: "Referral letters, claims, consent forms." },
  { id: "i3", name: "Logistics", blurb: "Bills of lading, customs, proof of delivery." },
  { id: "i4", name: "Public sector", blurb: "Citizen requests, contracts, compliance packs." },
];

export function findDocument(id: string) {
  return MOCK_DOCUMENTS.find((d) => d.id === id) ?? MOCK_DOCUMENTS[0]!;
}
