/**
 * Mock / sandbox ERP connector (E8.03 / E8.04).
 * Idempotent export keyed by idempotencyKey — retries do not duplicate.
 */

export type MockErpExportRequest = {
  orgId: string;
  documentId: string;
  documentType: string | null;
  entities: Record<string, unknown>;
  idempotencyKey: string;
};

export type MockErpExportResult =
  | { ok: true; externalId: string; duplicated: boolean }
  | { ok: false; error: string; retryable: true };

export class MockErpConnector {
  private readonly exported = new Map<string, string>();
  private failNext = false;

  /** Simulate a transient ERP failure on the next export call. */
  simulateFailureOnce(): void {
    this.failNext = true;
  }

  async export(request: MockErpExportRequest): Promise<MockErpExportResult> {
    const existing = this.exported.get(request.idempotencyKey);
    if (existing) {
      return { ok: true, externalId: existing, duplicated: true };
    }

    if (this.failNext) {
      this.failNext = false;
      return { ok: false, error: "erp_sandbox_unavailable", retryable: true };
    }

    const externalId = `mock-erp-${request.documentId.slice(0, 8)}`;
    this.exported.set(request.idempotencyKey, externalId);
    return { ok: true, externalId, duplicated: false };
  }

  reset(): void {
    this.exported.clear();
    this.failNext = false;
  }
}

export const defaultMockErp = new MockErpConnector();
