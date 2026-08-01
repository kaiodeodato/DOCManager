import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  DocumentJobPayloadSchema,
  JobStatus,
  JobType,
  defaultJobQueue,
} from "@ac/shared";
import {
  createEmailAdapter,
  createTwilioWhatsAppAdapter,
  processNextNotifyJob,
  resetNotifyIdempotency,
  sendNotify,
  workerIdentity,
} from "./index.js";

describe("@ac/worker-notify (E11)", () => {
  beforeEach(() => {
    resetNotifyIdempotency();
  });

  it("resolves shared package identity", () => {
    assert.match(workerIdentity(), /^worker-notify:@ac\/shared$/);
  });

  it("email and whatsapp stubs send without network", async () => {
    const email = createEmailAdapter("console");
    const wa = createTwilioWhatsAppAdapter();
    const e = await email.send({ to: "a@b.co", subject: "t", body: "hi" });
    const w = await wa.send({ to: "+351900000000", body: "hi" });
    assert.match(e.id, /^email_/);
    assert.match(w.id, /^wa_/);
  });

  it("idempotency key prevents duplicate provider sends", async () => {
    const first = await sendNotify({
      channel: "email",
      to: "user@example.com",
      body: "hello",
      idempotencyKey: "evt-1",
      subject: "Doc",
    });
    const second = await sendNotify({
      channel: "email",
      to: "user@example.com",
      body: "hello again",
      idempotencyKey: "evt-1",
      subject: "Doc",
    });
    assert.equal(first.ok, true);
    assert.equal(second.ok, true);
    if (first.ok && second.ok) {
      assert.equal(first.providerId, second.providerId);
      assert.equal(second.duplicate, true);
    }
  });

  it("consumes notify queue jobs", async () => {
    const orgId = "00000000-0000-4000-8000-000000000020";
    const documentId = "00000000-0000-4000-8000-000000000021";
    const job = defaultJobQueue.enqueue(
      DocumentJobPayloadSchema.parse({
        orgId,
        documentId,
        jobType: JobType.Notify,
        metadata: {
          channel: "whatsapp",
          to: "+351911111111",
          body: "OCR done",
          idempotencyKey: "job-notify-1",
        },
      }),
    );
    const outcome = await processNextNotifyJob();
    assert.equal(outcome.processed, true);
    assert.equal(outcome.result?.ok, true);
    assert.equal(defaultJobQueue.get(job.id)?.status, JobStatus.Succeeded);
  });
});
