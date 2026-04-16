/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Download,
  FileSpreadsheet,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { ImportResults } from "./ImportResults";

interface ImportError {
  row: number;
  errors: string[];
}

interface ImportResult {
  inserted: number;
  failed: number;
  errors: ImportError[];
}

export function BulkImport() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // ── Download template ──────────────────────────────────────────────
  const handleDownloadTemplate = () => {
    window.open("/api/students/import", "_blank");
  };

  // ── File selection ─────────────────────────────────────────────────
  const handleFileSelect = (selected: File | null) => {
    if (!selected) return;
    const allowed = /\.(xlsx|xls|csv)$/i;
    if (!allowed.test(selected.name)) {
      toast.error("يُسمح فقط بملفات Excel أو CSV");
      return;
    }
    setFile(selected);
    setResult(null);
  };

  // ── Upload ─────────────────────────────────────────────────────────
  // const handleUpload = async () => {
  //   if (!file) return;
  //   setLoading(true);

  //   try {
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     const res = await fetch("/api/students/import", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const data = await res.json();

  //     if (!res.ok && data.error) {
  //       toast.error(data.error ?? "حدث خطأ");
  //       return;
  //     }

  //     setResult(data);

  //     if (data.inserted > 0) {
  //       toast.success(`تم استيراد ${data.inserted} طالب بنجاح`);
  //     }
  //     if (data.failed > 0) {
  //       toast.warning(`${data.failed} صف به أخطاء`);
  //     }
  //   } catch {
  //     toast.error("تعذّر الاتصال بالخادم");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Using Axios for cleaner API calls
      const { data } = await axios.post("/api/students/import", formData);

      setResult(data);
      if (data.inserted > 0)
        toast.success(`تم استيراد ${data.inserted} طالب بنجاح`);
      if (data.failed > 0) toast.warning(`${data.failed} صفوف بها أخطاء`);
    } catch (error: any) {
      // If the server returns 422 (validation fail), we still want to show the results
      if (error.response?.status === 422) {
        setResult(error.response.data);
      } else {
        toast.error(error.response?.data?.error || "فشل الاستيراد");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Step 1 — Download template */}
      <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
        <div>
          <p className="text-sm font-medium">الخطوة 1: تحميل النموذج</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            حمّل النموذج، املأه، ثم ارفعه
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
          <Download size={14} className="ml-2" />
          تحميل النموذج
        </Button>
      </div>

      {/* Step 2 — Upload file */}
      <div>
        <p className="text-sm font-medium mb-2">الخطوة 2: رفع الملف</p>

        {/* Dropzone */}
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50",
            file && "border-primary/40 bg-primary/3",
          )}
          onClick={() => inputRef.current?.click()}
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
              <FileSpreadsheet size={24} className="text-primary" />
              <div className="text-right">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                type="button"
                className="mr-auto text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setResult(null);
                }}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
        {/* Upload Zone */}

        {file && !result && (
          <Button
            className="w-full mt-3 text-lg"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "جارٍ الاستيراد..." : "استيراد الطلاب"}
          </Button>
        )}
      </div>

      {/* Results */}

      {result && (
        <ImportResults
          inserted={result.inserted}
          failed={result.failed}
          errors={result.errors}
        />
      )}
    </div>
  );
}
