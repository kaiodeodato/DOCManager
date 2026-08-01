import { TaxonomyConfigSchema } from "@ac/shared";
import { getUserOrgContext } from "@/lib/auth/server";
import { getTaxonomyConfig, upsertTaxonomyConfig } from "@/lib/taxonomy-repository";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  const context = await getUserOrgContext();
  if (!context) return Response.json({ error: "unauthorized" }, { status: 401 });
  try {
    const config = await getTaxonomyConfig(context.orgId);
    return Response.json({ orgId: context.orgId, config });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "taxonomy_get_failed" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request): Promise<Response> {
  const context = await getUserOrgContext();
  if (!context) return Response.json({ error: "unauthorized" }, { status: 401 });
  if (context.role !== "owner") {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { config?: unknown };
  const parsed = TaxonomyConfigSchema.safeParse(body.config);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const config = await upsertTaxonomyConfig(context.orgId, parsed.data);
    return Response.json({ orgId: context.orgId, config });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "taxonomy_upsert_failed" },
      { status: 500 },
    );
  }
}
