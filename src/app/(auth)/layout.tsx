// // src\app\(auth)\layout.tsx
// export default function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="min-h-screen grid lg:grid-cols-2">
//       {/* Left panel — decorative (hidden on mobile) */}
//       <div className="hidden lg:flex flex-col justify-between bg-primary p-12 text-primary-foreground">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center text-[oklch(0.145_0.020_152)] font-bold text-lg">
//             م
//           </div>
//           <span className="text-xl font-bold">إدارة المسجد</span>
//         </div>

//         <blockquote className="space-y-2">
//           <p className="text-2xl font-medium leading-relaxed">
//             {"خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"}
//           </p>
//           <footer className="text-primary-foreground/70 text-sm">
//             رواه البخاري
//           </footer>
//         </blockquote>

//         <div className="text-primary-foreground/60 text-sm">
//           نظام متكامل لمتابعة حلقات القرآن والتربية والأنشطة
//         </div>
//       </div>

//       {/* Right panel — form */}
//       <div className="flex items-center justify-center p-6">{children}</div>
//     </div>
//   );
// }

/**
 * AuthLayout provides a minimal, centered layout for authentication pages
 * (login, register, forgot-password).
 *
 * No sidebar or top navbar — intentionally stripped back to keep focus
 * on the authentication form.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background bg-noise px-4">
      {/* Brand mark */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg">
          <span className="text-xl text-primary-foreground">م</span>
        </div>
        <h1 className="text-lg font-bold text-foreground">نظام إدارة المسجد</h1>
        <p className="text-sm text-muted-foreground">
          نظام متكامل لإدارة شؤون المساجد
        </p>
      </div>

      {/* Auth form card */}
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
