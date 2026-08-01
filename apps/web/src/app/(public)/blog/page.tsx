import { Card, CardHeader } from "@ac/ui";
import { MOCK_BLOG } from "@/lib/mock-data";

export default function BlogListPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 dm-page-enter">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Blog</h1>
      <ul className="grid gap-4">
        {MOCK_BLOG.map((post) => (
          <li key={post.slug}>
            <a href={`/blog/${post.slug}`} className="block no-underline">
              <Card className="dm-hover-lift">
                <CardHeader title={post.title} description={`${post.date} · ${post.excerpt}`} />
              </Card>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
