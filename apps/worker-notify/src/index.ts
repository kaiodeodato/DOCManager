import {
  JobType,
  createLogger,
  defaultJobQueue,
  type JobStatus,
} from "@ac/shared";
import { claimNextNotifyJob, finishNotifyJob } from "./supabase.js";

const log = createLogger("worker-notify");

export type NotifyChannel = "email" | "whatsapp";

export type NotifyPayload = {
  channel: NotifyChannel;
  to: string;
  subject?: string;
  body: string;
  idempotencyKey: string;
};

export type NotifySendResult = {
  ok: true;
  providerId: string;
  duplicate?: boolean;
} | {
  ok: false;
  error: string;
};

/** In-memory idempotency store for tests / local worker. */
const sentKeys = new Map<string, string>();

export function resetNotifyIdempotency(): void {
  sentKeys.clear();
}

export type EmailAdapter = {
  send(input: { to: string; subject: string; body: string }): Promise<{ id: string }>;
};

export type WhatsAppAdapter = {
  send(input: { to: string; body: string }): Promise<{ id: string }>;
};

/**
 * Console / SMTP stub — never opens a real socket in tests (E11.02).
 */
export function createEmailAdapter(mode: "console" | "smtp" = "console"): EmailAdapter {
  return {
    async send({ to, subject, body }) {
      if (mode === "smtp" && process.env.SMTP_URL && process.env.NOTIFY_ALLOW_SMTP === "1") {
        // Real SMTP intentionally gated; CI never sets NOTIFY_ALLOW_SMTP.
        throw new Error("smtp_not_enabled_in_this_environment");
      }
      const id = `email_${crypto.randomUUID()}`;
      log.info("email_stub_send", { to, subject, bodyPreview: body.slice(0, 80), id });
      return { id };
    },
  };
}

/**
 * Twilio WhatsApp stub — no real HTTP in tests (E11.03).
 */
export function createTwilioWhatsAppAdapter(): WhatsAppAdapter {
  return {
    async send({ to, body }) {
      if (process.env.TWILIO_ACCOUNT_SID && process.env.NOTIFY_ALLOW_TWILIO === "1") {
        throw new Error("twilio_live_send_blocked_in_stub");
      }
      const id = `wa_${crypto.randomUUID()}`;
      log.info("whatsapp_stub_send", { to, bodyPreview: body.slice(0, 80), id });
      return { id };
    },
  };
}

export async function sendNotify(
  payload: NotifyPayload,
  deps: { email: EmailAdapter; whatsapp: WhatsAppAdapter } = {
    email: createEmailAdapter(),
    whatsapp: createTwilioWhatsAppAdapter(),
  },
): Promise<NotifySendResult> {
  const existing = sentKeys.get(payload.idempotencyKey);
  if (existing) {
    return { ok: true, providerId: existing, duplicate: true };
  }

  try {
    const sent =
      payload.channel === "email"
        ? await deps.email.send({
            to: payload.to,
            subject: payload.subject ?? "DOC Manager",
            body: payload.body,
          })
        : await deps.whatsapp.send({ to: payload.to, body: payload.body });

    sentKeys.set(payload.idempotencyKey, sent.id);
    return { ok: true, providerId: sent.id };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "notify_failed",
    };
  }
}

function parseNotifyPayloadMetadata(m: Record<string, unknown>): NotifyPayload | null {
  const channel = m.channel;
  const to = m.to;
  const body = m.body;
  const idempotencyKey = m.idempotencyKey;
  if (
    (channel !== "email" && channel !== "whatsapp") ||
    typeof to !== "string" ||
    typeof body !== "string" ||
    typeof idempotencyKey !== "string"
  ) {
    return null;
  }
  const payload: NotifyPayload = {
    channel,
    to,
    body,
    idempotencyKey,
  };
  if (typeof m.subject === "string") {
    payload.subject = m.subject;
  }
  return payload;
}

/**
 * Consume notify jobs from the shared in-memory queue (E11.01).
 */
export async function processNextNotifyJob(): Promise<{
  processed: boolean;
  jobId?: string;
  result?: NotifySendResult;
}> {
  const job = defaultJobQueue.claim(JobType.Notify);
  if (!job) return { processed: false };

  const payload = parseNotifyPayloadMetadata(job.metadata ?? {});
  if (!payload) {
    defaultJobQueue.fail(job.id, "invalid_notify_payload");
    return {
      processed: true,
      jobId: job.id,
      result: { ok: false, error: "invalid_notify_payload" },
    };
  }

  const result = await sendNotify(payload);
  if (result.ok) defaultJobQueue.complete(job.id);
  else defaultJobQueue.fail(job.id, result.error);
  return { processed: true, jobId: job.id, result };
}

export async function processNextPersistentNotifyJob(): Promise<boolean> {
  const job = await claimNextNotifyJob();
  if (!job) return false;
  const payload = parseNotifyPayloadMetadata(job.payload);
  if (!payload) {
    await finishNotifyJob(job.id, { ok: false, error: "invalid_notify_payload" });
    return true;
  }
  const result = await sendNotify(payload);
  await finishNotifyJob(job.id, result.ok ? { ok: true } : result);
  return true;
}

export function workerIdentity(): string {
  return "worker-notify:@ac/shared";
}

export function getJobStatus(id: string): JobStatus | undefined {
  return defaultJobQueue.get(id)?.status;
}

async function main(): Promise<void> {
  log.info("starting", { identity: workerIdentity() });
  for (;;) {
    const processed = await processNextPersistentNotifyJob();
    if (!processed) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

const isDirectRun =
  process.argv[1] &&
  (process.argv[1].endsWith("index.js") || process.argv[1].endsWith("index.ts"));

if (isDirectRun && process.env.WORKER_NOTIFY_POLL === "1") {
  void main();
}
