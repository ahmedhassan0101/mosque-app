// src/app/layout.tsx

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Providers } from "@/components/providers/Providers";
import { Toaster } from "sonner";
import { auth } from "@/lib/auth/auth";
import "./globals.css";

/* ─────────────────────────────────────────────
   graphik-arabic — Local Font
   4 weights only: 400 / 500 / 600 / 700
   Format: woff2 only (smallest, all modern browsers)
   Place font files in: /public/fonts/graphik-arabic/
───────────────────────────────────────────── */
const graphikArabic = localFont({
  src: [
    {
      path: "../../public/fonts/GraphikArabic-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GraphikArabic-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GraphikArabic-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/GraphikArabic-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sans", // ← matches globals.css var(--font-sans)
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

/* ─────────────────────────────────────────────
   Geist Mono — للأرقام والـ IDs والكود
   تُحمَّل من Google Fonts (subset latin فقط)
───────────────────────────────────────────── */
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono", // ← matches globals.css var(--font-mono)
  display: "swap",
  preload: false, // not critical — loads lazily
});

/* ─────────────────────────────────────────────
   Metadata
───────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "نظام إدارة المسجد",
    template: "%s | نظام إدارة المسجد",
  },
  description: "نظام متكامل لإدارة شؤون المساجد والمراكز الإسلامية",
  keywords: ["مسجد", "إدارة", "قرآن", "تعليم", "ERP"],
  authors: [{ name: "Masjid ERP" }],
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" }, // --background light
    { media: "(prefers-color-scheme: dark)", color: "#191c24" }, // --background dark
  ],
};

/* ─────────────────────────────────────────────
   Root Layout
───────────────────────────────────────────── */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pre-fetch session server-side → no auth loading flash on client
  const session = await auth();
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${graphikArabic.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased">
        <Providers session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="masjid-erp-theme"
          >
            {children}

            <Toaster
              position="top-center"
              richColors
              closeButton
              dir="rtl"
              toastOptions={{
                style: { fontFamily: "var(--font-sans)" },
              }}
            />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
