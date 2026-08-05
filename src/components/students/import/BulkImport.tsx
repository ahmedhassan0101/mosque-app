// src/components/students/import/BulkImport.tsx
"use client";

import { useState, useRef, useTransition } from "react";
import { toast } from "sonner";
import {
  Upload,
  Download,
  FileSpreadsheet,
  X,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";

import { Button } from "@/temp/button";
import { ImportResults, type ImportRowError } from "./ImportResults";
import {
  downloadTemplateAction,
  importStudentsAction,
} from "@/actions/import.actions";
import { GOOGLE_SHEET_TEMPLATE_URL } from "@/constants";

interface ImportResult {
  inserted: number;
  failed: number;
  errors: ImportRowError[];
}

/**
 * BulkImport — Client Component
 *
 * Handles:
 * 1. Template download (triggers Server Action → returns base64 → client creates Blob URL)
 * 2. Google Sheet shortcut
 * 3. Drag & drop / file picker
 * 4. File upload via Server Action (no API route needed)
 * 5. Result display
 */
export function BulkImport() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const [isDownloading, startDownload] = useTransition();
  const [isImporting, startImport] = useTransition();

  // ── Download template ──────────────────────────────────────────────────────
  const handleDownload = () => {
    startDownload(async () => {
      const response = await downloadTemplateAction();

      if (response.status !== "success" || !response.data) {
        toast.error(response.message ?? "فشل إنشاء النموذج.");
        return;
      }

      // Decode base64 → Blob → download link
      const bytes = Uint8Array.from(atob(response.data.base64), (c) =>
        c.charCodeAt(0),
      );
      const blob = new Blob([bytes], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = response.data.filename;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("تم تحميل النموذج.");
    });
  };

  // ── File selection ─────────────────────────────────────────────────────────
  const handleFileSelect = (selected: File | null) => {
    if (!selected) return;
    if (!selected.name.match(/\.(xlsx|xls|csv)$/i)) {
      toast.error("يُسمح فقط بملفات Excel أو CSV");
      return;
    }
    setFile(selected);
    setResult(null);
  };

  // ── Upload & Import ────────────────────────────────────────────────────────
  const handleImport = () => {
    if (!file) return;

    startImport(async () => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await importStudentsAction(formData);

      if (response.status === "error") {
        toast.error(response.message ?? "خطأ في الخادم.");
        return;
      }

      if (response.status === "fail") {
        toast.error(response.message ?? "فشل الاستيراد.");
        return;
      }

      // status === "success"
      const data = response.data!;
      setResult(data);

      if (data.inserted > 0) {
        toast.success(`تم استيراد ${data.inserted} طالب بنجاح.`);
      }
      if (data.failed > 0) {
        toast.warning(`${data.failed} صف به أخطاء — راجع التفاصيل أدناه.`);
      }
    });
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-5 max-w-2xl" dir="rtl">
      {/* ── Step 1: Get the template ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
            ١
          </span>
          <p className="text-sm font-semibold">تحميل النموذج وملء البيانات</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border border-border bg-muted/20">
          {/* Excel download */}
          <div className="flex flex-col gap-2 p-3 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileSpreadsheet size={16} className="text-green-600" />
              ملف Excel
            </div>
            <p className="text-xs text-muted-foreground">
              حمّل الملف على جهازك واملأه
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
              className="mt-auto"
            >
              {isDownloading ? (
                <Loader2 size={14} className="animate-spin ml-2" />
              ) : (
                <Download size={14} className="ml-2" />
              )}
              {isDownloading ? "جاري الإنشاء..." : "تحميل النموذج"}
            </Button>
          </div>

          {/* Google Sheets */}
          <div className="flex flex-col gap-2 p-3 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ExternalLink size={16} className="text-blue-500" />
              Google Sheets
            </div>
            <p className="text-xs text-muted-foreground">
              افتح النموذج مباشرة في المتصفح
            </p>
            <Button variant="outline" size="sm" asChild className="mt-auto">
              <a
                href={GOOGLE_SHEET_TEMPLATE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={14} className="ml-2" />
                فتح النموذج
              </a>
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground px-1">
          💡 بعد ملء البيانات في Google Sheets: ملف ← تنزيل ← Microsoft Excel
          (.xlsx)
        </p>
      </section>

      {/* ── Step 2: Upload ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
            ٢
          </span>
          <p className="text-sm font-semibold">رفع الملف المعبّأ</p>
        </div>

        {/* Dropzone */}
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
            dragOver
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/50 hover:bg-muted/20",
            file && !result && "border-primary/40 bg-primary/5",
            isImporting && "pointer-events-none opacity-60",
          )}
          onClick={() => !file && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFileSelect(e.dataTransfer.files[0] ?? null);
          }}
          role="button"
          aria-label="منطقة رفع الملف"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
          />

          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileSpreadsheet size={24} className="text-primary shrink-0" />
              <div className="text-right">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                type="button"
                aria-label="إزالة الملف"
                className="mr-auto text-muted-foreground hover:text-destructive transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div>
              <Upload
                size={28}
                className="mx-auto mb-3 text-muted-foreground"
              />
              <p className="text-sm font-medium">
                اسحب الملف هنا أو اضغط للاختيار
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Excel أو CSV · حتى 5MB
              </p>
            </div>
          )}
        </div>

        {/* Import button */}
        {file && !result && (
          <Button
            className="w-full"
            size="lg"
            onClick={handleImport}
            disabled={isImporting}
          >
            {isImporting ? (
              <>
                <Loader2 size={16} className="animate-spin ml-2" />
                جارٍ الاستيراد...
              </>
            ) : (
              <>
                <Upload size={16} className="ml-2" />
                استيراد الطلاب
              </>
            )}
          </Button>
        )}
      </section>

      {/* ── Results ── */}
      {result && (
        <section className="space-y-3">
          <ImportResults
            inserted={result.inserted}
            failed={result.failed}
            errors={result.errors}
          />
          <Button variant="outline" size="sm" onClick={handleReset}>
            استيراد ملف آخر
          </Button>
        </section>
      )}
    </div>
  );
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// // import { Progress } from "@/components/ui/progress";
// import {
//   Upload,
//   Download,
//   FileSpreadsheet,
//   X,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import axios from "axios";
// import { ImportResults } from "./ImportResults";
// // import { ImportResults } from "./ImportResults";

// interface ImportError {
//   row: number;
//   errors: string[];
// }

// interface ImportResult {
//   inserted: number;
//   failed: number;
//   errors: ImportError[];
// }

// export function BulkImport() {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<ImportResult | null>(null);
//   const [dragOver, setDragOver] = useState(false);

//   // ── Download template ──────────────────────────────────────────────
//   const handleDownloadTemplate = () => {
//     window.open("/api/students/import", "_blank");
//   };

//   // ── File selection ─────────────────────────────────────────────────
//   const handleFileSelect = (selected: File | null) => {
//     if (!selected) return;
//     const allowed = /\.(xlsx|xls|csv)$/i;
//     if (!allowed.test(selected.name)) {
//       toast.error("يُسمح فقط بملفات Excel أو CSV");
//       return;
//     }
//     setFile(selected);
//     setResult(null);
//   };

//   // ── Upload ─────────────────────────────────────────────────────────
//   // const handleUpload = async () => {
//   //   if (!file) return;
//   //   setLoading(true);

//   //   try {
//   //     const formData = new FormData();
//   //     formData.append("file", file);

//   //     const res = await fetch("/api/students/import", {
//   //       method: "POST",
//   //       body: formData,
//   //     });

//   //     const data = await res.json();

//   //     if (!res.ok && data.error) {
//   //       toast.error(data.error ?? "حدث خطأ");
//   //       return;
//   //     }

//   //     setResult(data);

//   //     if (data.inserted > 0) {
//   //       toast.success(`تم استيراد ${data.inserted} طالب بنجاح`);
//   //     }
//   //     if (data.failed > 0) {
//   //       toast.warning(`${data.failed} صف به أخطاء`);
//   //     }
//   //   } catch {
//   //     toast.error("تعذّر الاتصال بالخادم");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleUpload = async () => {
//     if (!file) return;
//     setLoading(true);
//     setResult(null);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       // Using Axios for cleaner API calls
//       const { data } = await axios.post("/api/students/import", formData);

//       setResult(data);
//       if (data.inserted > 0)
//         toast.success(`تم استيراد ${data.inserted} طالب بنجاح`);
//       if (data.failed > 0) toast.warning(`${data.failed} صفوف بها أخطاء`);
//     } catch (error: any) {
//       // If the server returns 422 (validation fail), we still want to show the results
//       if (error.response?.status === 422) {
//         setResult(error.response.data);
//       } else {
//         toast.error(error.response?.data?.error || "فشل الاستيراد");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-4 max-w-2xl">
//       {/* Step 1 — Download template */}
//       <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
//         <div>
//           <p className="text-sm font-medium">الخطوة 1: تحميل النموذج</p>
//           <p className="text-xs text-muted-foreground mt-0.5">
//             حمّل النموذج، املأه، ثم ارفعه
//           </p>
//         </div>
//         <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
//           <Download size={14} className="ml-2" />
//           تحميل النموذج
//         </Button>
//       </div>

//       {/* Step 2 — Upload file */}
//       <div>
//         <p className="text-sm font-medium mb-2">الخطوة 2: رفع الملف</p>

//         {/* Dropzone */}
//         <div
//           className={cn(
//             "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
//             dragOver
//               ? "border-primary bg-primary/5"
//               : "border-border hover:border-primary/50",
//             file && "border-primary/40 bg-primary/3",
//           )}
//           onClick={() => inputRef.current?.click()}
//           onDragOver={(e) => {
//             e.preventDefault();
//             setDragOver(true);
//           }}
//           onDragLeave={() => setDragOver(false)}
//           onDrop={(e) => {
//             e.preventDefault();
//             setDragOver(false);
//             handleFileSelect(e.dataTransfer.files[0] ?? null);
//           }}
//         >
//           <input
//             ref={inputRef}
//             type="file"
//             accept=".xlsx,.xls,.csv"
//             className="hidden"
//             onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
//           />

//           {file ? (
//             <div className="flex items-center justify-center gap-3">
//               <FileSpreadsheet size={24} className="text-primary" />
//               <div className="text-right">
//                 <p className="text-sm font-medium">{file.name}</p>
//                 <p className="text-xs text-muted-foreground">
//                   {(file.size / 1024).toFixed(1)} KB
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 className="mr-auto text-muted-foreground hover:text-foreground"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setFile(null);
//                   setResult(null);
//                 }}
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           ) : (
//             <>
//               <Upload
//                 size={28}
//                 className="mx-auto mb-3 text-muted-foreground"
//               />
//               <p className="text-sm font-medium">
//                 اسحب الملف هنا أو اضغط للاختيار
//               </p>
//               <p className="text-xs text-muted-foreground mt-1">
//                 Excel أو CSV · حتى 5MB
//               </p>
//             </>
//           )}
//         </div>
//         {/* Upload Zone */}

//         {file && !result && (
//           <Button
//             className="w-full mt-3 text-lg"
//             onClick={handleUpload}
//             disabled={loading}
//           >
//             {loading ? "جارٍ الاستيراد..." : "استيراد الطلاب"}
//           </Button>
//         )}
//       </div>

//       {/* Results */}

//       {result && (
//         <ImportResults
//           inserted={result.inserted}
//           failed={result.failed}
//           errors={result.errors}
//         />
//       )}
//     </div>
//   );
// }
