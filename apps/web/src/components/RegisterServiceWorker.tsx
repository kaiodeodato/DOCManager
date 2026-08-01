"use client";

import { useEffect } from "react";

/** Registers the PWA service worker when supported (E13.01). */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.register("/sw.js").catch(() => {
      /* ignore registration errors in dev */
    });
  }, []);
  return null;
}
