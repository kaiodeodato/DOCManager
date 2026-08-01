import { Card, CardHeader } from "@ac/ui";
import { MOCK_INDUSTRIES } from "@/lib/mock-data";

export default function IndustriesPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 dm-page-enter">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Industries</h1>
      <ul className="grid gap-4 sm:grid-cols-2">
        {MOCK_INDUSTRIES.map((ind) => (
          <li key={ind.id}>
            <Card className="dm-hover-lift h-full">
              <CardHeader title={ind.name} description={ind.blurb} />
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
