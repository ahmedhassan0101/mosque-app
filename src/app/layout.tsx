
import type { Metadata, Viewport } from "next";
import { Readex_Pro } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";
import { auth } from "@/lib/auth/auth";
import { Providers } from "@/components/providers/providers";
import GlobalError from "./error";

/* ─────────────────────────────────────────────
   Arabic Font — Readex Pro
   Variable font with full weight range for
   expressive, readable Arabic typography.
───────────────────────────────────────────── */

const readexPro = Readex_Pro({
  subsets: ["arabic", "latin"],
  axes: ["HEXP"],
  // axes: ["RDXP"],
  variable: "--font-readex",
  display: "swap",
  preload: true,
});



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
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#1e2a35" },
  ],
};

/* ─────────────────────────────────────────────
   Root Layout
───────────────────────────────────────────── */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Pre-fetch session on the server for instant client hydration (no loading flash)
  const session = await auth();
  
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={readexPro.variable}
    >
      <body className="font-(family-name:--font-readex) antialiased">
        <Providers session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange // ={false}
            storageKey="masjid-erp-theme"
          >
     
            {children}
            <Toaster
              position="top-center"
              richColors
              closeButton
              dir="rtl"
              toastOptions={{
                style: {
                  fontFamily: "var(--font-readex)",
                },
              }}
            />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
