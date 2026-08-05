// import Link from "next/link";
// import { SearchX } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export default function DashboardNotFound() {
//   return (
//     <div className="flex h-full min-h-[50vh] items-center justify-center">
//       <div className="card-elevated flex w-full max-w-md flex-col items-center gap-4 p-6 text-center">
//         <div className="flex size-12 items-center justify-center rounded-full bg-muted">
//           <SearchX className="size-6 text-muted-foreground" />
//         </div>

//         <div className="flex flex-col gap-1">
//           <h1 className="text-section-title">العنصر غير موجود</h1>
//           <p className="text-caption">
//             العنصر الذي تبحث عنه غير موجود أو تم حذفه.
//           </p>
//         </div>

//         <Button asChild className="w-full">
//           <Link href="/dashboard">العودة إلى الرئيسية</Link>
//         </Button>
//       </div>
//     </div>
//   );
// }

// app/dashboard/not-found.tsx
import Link from "next/link";
import { FileSearch, MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <div className="flex h-[calc(100vh-8rem)] w-full items-center justify-center">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 rounded-xl border bg-card p-8 text-center text-card-foreground shadow-sm">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted/50">
          <FileSearch className="size-7 text-muted-foreground" />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight">
            لم يتم العثور على العنصر
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            السجل أو الصفحة التي تحاول الوصول إليها غير موجودة. ربما تم حذفها أو
            أنك لا تملك الصلاحية لعرضها.
          </p>
        </div>

        <div className="mt-2 w-full">
          <Button asChild className="w-full group gap-2">
            <Link href="/dashboard">
              العودة للرئيسية
              {/* استخدام MoveLeft لأن الحركة للأمام في واجهة الـ RTL بتكون لليسار */}
              <MoveLeft className="size-4 opacity-70 transition-transform group-hover:-translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
