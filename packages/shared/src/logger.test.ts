import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createLogger } from "./logger.js";

describe("createLogger (E15)", () => {
  it("emits JSON lines with service and nested fields", () => {
    const lines: string[] = [];
    const log = createLogger("worker-ocr", { orgId: "o1" }, (line) => lines.push(line));
    log.info("job_claimed", { jobId: "j1" });
    assert.equal(lines.length, 1);
    const parsed = JSON.parse(lines[0]!) as {
      level: string;
      msg: string;
      service: string;
      fields: { orgId: string; jobId: string };
    };
    assert.equal(parsed.level, "info");
    assert.equal(parsed.msg, "job_claimed");
    assert.equal(parsed.service, "worker-ocr");
    assert.equal(parsed.fields.orgId, "o1");
    assert.equal(parsed.fields.jobId, "j1");
  });

  it("child logger merges fields", () => {
    const lines: string[] = [];
    const log = createLogger("web", {}, (line) => lines.push(line)).child({ requestId: "r1" });
    log.warn("slow");
    const parsed = JSON.parse(lines[0]!) as { fields: { requestId: string } };
    assert.equal(parsed.fields.requestId, "r1");
  });
});
