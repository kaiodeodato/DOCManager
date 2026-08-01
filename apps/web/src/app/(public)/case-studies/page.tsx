import { Card, CardHeader } from "@ac/ui";
import { MOCK_CASE_STUDIES } from "@/lib/mock-data";

export default function CaseStudiesPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 dm-page-enter">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Case studies</h1>
      <ul className="grid gap-4 md:grid-cols-2">
        {MOCK_CASE_STUDIES.map((cs) => (
          <li key={cs.id}>
            <Card className="dm-hover-lift h-full">
              <CardHeader title={cs.title} description={`${cs.industry} · ${cs.result}`} />
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
