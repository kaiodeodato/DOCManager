import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { JobStatus, JobType } from "./enums.js";
import { DocumentJobQueue } from "./queue.js";

const orgId = "11111111-1111-4111-8111-111111111111";
const documentId = "22222222-2222-4222-8222-222222222222";

describe("DocumentJobQueue", () => {
  it("enqueues, claims, and completes a noop job idempotently by id", () => {
    const queue = new DocumentJobQueue();
    const created = queue.enqueue({
      orgId,
      documentId,
      jobType: JobType.Noop,
    });
    assert.equal(created.status, JobStatus.Pending);

    const claimed = queue.claim(JobType.Noop);
    assert.ok(claimed);
    assert.equal(claimed.id, created.id);
    assert.equal(claimed.status, JobStatus.Running);

    queue.complete(claimed.id);
    assert.equal(queue.get(claimed.id)?.status, JobStatus.Succeeded);

    assert.equal(queue.claim(JobType.Noop), undefined);
  });
});
