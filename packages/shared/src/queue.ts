import { JobStatus, type JobType } from "./enums.js";
import { DocumentJobPayloadSchema, type DocumentJobPayload } from "./schemas.js";
import type { z } from "zod";

export type JobRecord = DocumentJobPayload & {
  id: string;
  status: JobStatus;
  attempts: number;
  lastError?: string;
  updatedAt: string;
};

type JobEnqueueInput = z.input<typeof DocumentJobPayloadSchema>;

/** In-memory queue used only by unit tests and explicit local harnesses. */
export class DocumentJobQueue {
  private readonly jobs = new Map<string, JobRecord>();

  enqueue(input: JobEnqueueInput): JobRecord {
    const parsed = DocumentJobPayloadSchema.parse(input);
    const id = crypto.randomUUID();
    const record: JobRecord = {
      ...parsed,
      id,
      status: JobStatus.Pending,
      attempts: 0,
      updatedAt: new Date().toISOString(),
    };
    this.jobs.set(id, record);
    return record;
  }

  claim(type: JobType): JobRecord | undefined {
    for (const job of this.jobs.values()) {
      if (job.status === JobStatus.Pending && job.jobType === type) {
        job.status = JobStatus.Running;
        job.attempts += 1;
        job.updatedAt = new Date().toISOString();
        return job;
      }
    }
    return undefined;
  }

  complete(id: string): void {
    const job = this.jobs.get(id);
    if (!job) return;
    job.status = JobStatus.Succeeded;
    job.updatedAt = new Date().toISOString();
  }

  fail(id: string, error: string): void {
    const job = this.jobs.get(id);
    if (!job) return;
    job.status = JobStatus.Failed;
    job.lastError = error;
    job.updatedAt = new Date().toISOString();
  }

  get(id: string): JobRecord | undefined {
    return this.jobs.get(id);
  }

  list(): JobRecord[] {
    return [...this.jobs.values()];
  }
}

export const defaultJobQueue = new DocumentJobQueue();
