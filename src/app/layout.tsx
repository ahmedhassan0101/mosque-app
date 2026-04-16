// import type { Metadata, Viewport } from "next";
// // import { Cairo } from "next/font/google";
// import { Readex_Pro } from "next/font/google";
// import "./globals.css";
// import { Providers } from "@/components/layout/Providers";
// import { Toaster } from "sonner";
import type { Metadata, Viewport } from "next";
import { Readex_Pro } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

/* ─────────────────────────────────────────────
   Arabic Font — Readex Pro
   Variable font with full weight range for
   expressive, readable Arabic typography.
───────────────────────────────────────────── */
// const cairo = Cairo({
//   subsets: ["arabic", "latin"],
//   variable: "--font-cairo",
//   display: "swap",
// });

const readexPro = Readex_Pro({
  subsets: ["arabic", "latin"],
  axes: ["HEXP"],
  // axes: ["RDXP"],
  variable: "--font-readex",
  display: "swap",
  preload: true,
});

// export const metadata: Metadata = {
//   title: { template: "%s | إدارة المسجد", default: "إدارة المسجد" },
//   description: "نظام متابعة حلقات المسجد",
//   manifest: "/manifest.json",
//   appleWebApp: {
//     capable: true,
//     statusBarStyle: "default",
//     title: "إدارة المسجد",
//   },
//   formatDetection: { telephone: false },
// };

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
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={readexPro.variable}
    >
      <body className="font-(family-name:--font-readex) antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange  // ={false}
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
      </body>
    </html>
  );
}
// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="ar" dir="rtl" suppressHydrationWarning>
//       <body className={`${cairo.variable} font-sans antialiased`}>
//         <Providers>
//           {children}
//           <Toaster richColors position="top-center" />
//         </Providers>
//       </body>
//     </html>
//   );
// }
