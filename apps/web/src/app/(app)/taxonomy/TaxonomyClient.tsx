"use client";

import { useEffect, useState } from "react";
import {
  Badge,
  EmptyState,
  ErrorState,
  LoadingState,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Tabs,
} from "@ac/ui";
import { Tags } from "lucide-react";
import type { TaxonomyConfig } from "@ac/shared";

export function TaxonomyClient() {
  const [config, setConfig] = useState<TaxonomyConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/taxonomy");
        if (!res.ok) throw new Error("Failed to load taxonomy");
        const data = (await res.json()) as { config: TaxonomyConfig };
        setConfig(data.config);
      } catch (err) {
        setError(err instanceof Error ? err.message : "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoadingState label="Loading taxonomy…" />;
  if (error) {
    return (
      <ErrorState title="Taxonomy unavailable" description={error} actionLabel="Retry" onAction={() => window.location.reload()} />
    );
  }
  if (!config) return null;

  const types = config.documentTypes ?? [];
  const centers = config.costCenters ?? [];
  const folders = config.virtualFolders ?? [];
  const empty =
    types.length === 0 && centers.length === 0 && folders.length === 0;

  if (empty) {
    return (
      <EmptyState
        icon={Tags}
        title="No taxonomy configured"
        description="Save document types, cost centers, or folders via the taxonomy API. Nothing is pre-seeded."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold">Taxonomy</h2>
        <p className="text-sm text-[var(--dm-color-muted)]">
          Live config from `tenant_taxonomy_config` for your organization.
        </p>
      </div>
      <Tabs
        items={[
          {
            id: "types",
            label: "Document types",
            content: (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Id</TableHeaderCell>
                    <TableHeaderCell>Label</TableHeaderCell>
                    <TableHeaderCell>Tags</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {types.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.id}</TableCell>
                      <TableCell>{t.label}</TableCell>
                      <TableCell className="flex flex-wrap gap-1">
                        {(t.tags ?? []).map((tag) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ),
          },
          {
            id: "centers",
            label: "Cost centers",
            content: (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Id</TableHeaderCell>
                    <TableHeaderCell>Label</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {centers.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>{c.id}</TableCell>
                      <TableCell>{c.label}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ),
          },
          {
            id: "folders",
            label: "Virtual folders",
            content: (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Id</TableHeaderCell>
                    <TableHeaderCell>Label</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {folders.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell>{f.id}</TableCell>
                      <TableCell>{f.label}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ),
          },
        ]}
      />
    </div>
  );
}
