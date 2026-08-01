import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { JobStatus, JobType } from "./enums.js";
import { findStuckJobs, formatStuckJobLog } from "./job-alerts.js";
import type { JobRecord } from "./queue.js";

function job(partial: Partial<JobRecord> & Pick<JobRecord, "id" | "status">): JobRecord {
  return {
    orgId: "11111111-1111-4111-8111-111111111111",
    documentId: "22222222-2222-4222-8222-222222222222",
    jobType: JobType.Ocr,
    attempt: 1,
    metadata: {},
    attempts: 1,
    updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    ...partial,
  };
}

describe("findStuckJobs", () => {
  it("flags stale processing jobs", () => {
    const alerts = findStuckJobs([job({ id: "a", status: JobStatus.Running })]);
    assert.equal(alerts.length, 1);
    assert.match(formatStuckJobLog(alerts), /stuck-job/);
  });

  it("flags repeatedly failed jobs", () => {
    const alerts = findStuckJobs([
      job({ id: "b", status: JobStatus.Failed, attempts: 3, lastError: "boom" }),
    ]);
    assert.equal(alerts.length, 1);
  });
});
