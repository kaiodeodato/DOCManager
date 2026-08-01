/**
 * Optional Supabase Realtime stub for document status updates (E9.04).
 * No network in CI — callers can pass a mock channel.
 */

export type DocumentStatusEvent = {
  documentId: string;
  status: string;
  updatedAt: string;
};

export type DocumentStatusChannel = {
  subscribe: (handler: (event: DocumentStatusEvent) => void) => () => void;
};

/**
 * Hook-shaped helper usable from client components.
 * Returns unsubscribe; with no channel, is a no-op stub.
 */
export function subscribeDocumentStatus(
  channel: DocumentStatusChannel | null | undefined,
  onEvent: (event: DocumentStatusEvent) => void,
): () => void {
  if (!channel) {
    return () => undefined;
  }
  return channel.subscribe(onEvent);
}

/**
 * Factory for tests / local mock realtime.
 */
export function createMemoryDocumentStatusChannel(): DocumentStatusChannel & {
  publish: (event: DocumentStatusEvent) => void;
} {
  const handlers = new Set<(event: DocumentStatusEvent) => void>();
  return {
    subscribe(handler) {
      handlers.add(handler);
      return () => {
        handlers.delete(handler);
      };
    },
    publish(event) {
      for (const h of handlers) h(event);
    },
  };
}
