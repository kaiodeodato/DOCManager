import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { RegisterServiceWorker } from "@/components/RegisterServiceWorker";
import "./globals.css";

export const metadata: Metadata = {
  title: "DOC Manager",
  description: "Enterprise document management — OCR, classification, and secure archive.",
  manifest: "/manifest.webmanifest",
  applicationName: "DOC Manager",
  appleWebApp: {
    capable: true,
    title: "DOC Manager",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt">
      <body>
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  );
}
