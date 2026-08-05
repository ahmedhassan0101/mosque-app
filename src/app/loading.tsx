// export default function Loading() {
//   return (
//     <div className="flex min-h-dvh items-center justify-center">
//       <div
//         className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary"
//         role="status"
//         aria-label="جارٍ التحميل"
//       />
//     </div>
//   );
// }

// app/loading.tsx
export default function GlobalLoading() {
  return (
    <div
      dir="rtl"
      className="flex min-h-dvh flex-col items-center justify-center bg-background"
    >
      <div className="flex flex-col items-center gap-4 text-primary">
        <div
          className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary"
          role="status"
          aria-label="جارٍ التحميل"
        />
        {/* يمكنك ترك النص أو حذفه بناءً على تفضيلك لمدى البساطة */}
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          جارٍ تجهيز مساحة العمل...
        </p>
      </div>
    </div>
  );
}
