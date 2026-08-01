import { MOCK_BLOG } from "@/lib/mock-data";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = MOCK_BLOG.find((p) => p.slug === slug) ?? MOCK_BLOG[0]!;
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 dm-page-enter">
      <p className="text-sm text-[var(--dm-color-muted)]">{post.date}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{post.title}</h1>
      <p className="mt-6 text-lg text-[var(--dm-color-muted)]">{post.excerpt}</p>
      <p className="mt-8 leading-relaxed text-[var(--dm-color-foreground)]">
        This is mock CMS content for UI12. In production, posts will load from the content API
        with the same PublicLayout chrome and design tokens.
      </p>
      <p className="mt-4">
        <a href="/blog">← Back to blog</a>
      </p>
    </article>
  );
}
