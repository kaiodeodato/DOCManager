import { JobStatus } from "./enums.js";
import type { JobRecord } from "./queue.js";

const STALE_PROCESSING_MS = 15 * 60 * 1000;

export type StuckJobAlert = {
  jobId: string;
  ageMs: number;
  attempts: number;
  lastError?: string;
};

/** E3.05 — detect jobs stuck in processing or repeatedly failed. */
export function findStuckJobs(
  jobs: Iterable<JobRecord>,
  now = Date.now(),
  staleMs = STALE_PROCESSING_MS,
): StuckJobAlert[] {
  const alerts: StuckJobAlert[] = [];
  for (const job of jobs) {
    const updatedAt = Date.parse(job.updatedAt);
    const ageMs = Number.isFinite(updatedAt) ? now - updatedAt : Number.POSITIVE_INFINITY;
    if (job.status === JobStatus.Running && ageMs >= staleMs) {
      const alert: StuckJobAlert = { jobId: job.id, ageMs, attempts: job.attempts };
      if (job.lastError !== undefined) alert.lastError = job.lastError;
      alerts.push(alert);
    }
    if (job.status === JobStatus.Failed && job.attempts >= 3) {
      const alert: StuckJobAlert = { jobId: job.id, ageMs, attempts: job.attempts };
      if (job.lastError !== undefined) alert.lastError = job.lastError;
      alerts.push(alert);
    }
  }
  return alerts;
}

export function formatStuckJobLog(alerts: StuckJobAlert[]): string {
  if (alerts.length === 0) return "No stuck jobs";
  return alerts
    .map(
      (a) =>
        `[stuck-job] id=${a.jobId} attempts=${a.attempts} ageMs=${Math.round(a.ageMs)} error=${a.lastError ?? "-"}`,
    )
    .join("\n");
}
