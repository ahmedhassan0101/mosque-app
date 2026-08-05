/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/temp/button";
import { Download, Printer } from "lucide-react";

interface Props {
  studentId: string | null;
  studentName: string;
  open: boolean;
  onClose: () => void;
}

export function QRDialog({ studentId, studentName, open, onClose }: Props) {
  //   const [svg, setSvg] = useState<string>("");
  //   const [loading, setLoading] = useState(false);

  //   useEffect(() => {
  //     if (!studentId || !open) return;
  //     setLoading(true);
  // //     Error: Calling setState synchronously within an effect can trigger cascading renders

  // // Effects are intended to synchronize state between React and external systems such as manually updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following:
  // // * Update external systems with the latest state from React.
  // // * Subscribe for updates from some external system, calling setState in a callback function when external state changes.

  // // Calling setState synchronously within an effect body causes cascading renders that can hurt performance, and is not recommended. (https://react.dev/learn/you-might-not-need-an-effect).

  //     fetch(`/api/students/${studentId}/qr`)
  //       .then((r) => r.text())
  //       .then((text) => { setSvg(text); setLoading(false); })
  //       .catch(() => setLoading(false));
  //   }, [studentId, open]);

  //   const handleDownload = () => {
  //     if (!svg) return;
  //     const blob = new Blob([svg], { type: "image/svg+xml" });
  //     const url  = URL.createObjectURL(blob);
  //     const a    = document.createElement("a");
  //     a.href     = url;
  //     a.download = `qr-${studentName}.svg`;
  //     a.click();
  //     URL.revokeObjectURL(url);
  //   };

  //   const handlePrint = () => {
  //     const w = window.open("", "_blank");
  //     if (!w) return;
  //     w.document.write(`
  //       <html dir="rtl"><head><title>QR - ${studentName}</title>
  //       <style>body{display:flex;flex-direction:column;align-items:center;padding:2rem;font-family:sans-serif}
  //       h2{margin-bottom:1rem}</style></head>
  //       <body><h2>${studentName}</h2>${svg}</body></html>
  //     `);
  //     w.document.close();
  //     w.print();
  //   };
  const [svg, setSvg] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Reset عند الإغلاق أو تغيير الطالب
    if (!studentId || !open) {
      setSvg("");
      return;
    }

    // إلغاء أي request سابق
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // نضع loading بعد ما يبدأ الـ async — مش synchronously
    let cancelled = false;

    const fetchQR = async () => {
      // setLoading هنا داخل async function مش sync في الـ effect body
      setLoading(true);
      try {
        const res = await fetch(`/api/students/${studentId}/qr`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed");
        const text = await res.text();
        if (!cancelled) setSvg(text);
      } catch (err: any) {
        if (err?.name !== "AbortError" && !cancelled) setSvg("");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchQR();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [studentId, open]);

  const handleDownload = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-${studentName}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html dir="rtl">
        <head>
          <title>QR - ${studentName}</title>
          <style>
            body { display:flex; flex-direction:column; align-items:center;
                   padding:2rem; font-family:sans-serif; }
            h2   { margin-bottom:1rem; }
            svg  { width:200px; height:200px; }
          </style>
        </head>
        <body><h2>${studentName}</h2>${svg}</body>
      </html>
    `);
    w.document.close();
    w.print();
  };
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>QR الطالب</DialogTitle>
          <DialogDescription>{studentName}</DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-4">
          {/* {loading ? (
            <div className="w-48 h-48 bg-muted animate-pulse rounded" />
          ) : (
          
          )}  */}
          <div
            className="w-48 h-48"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            variant="outline"
            onClick={handleDownload}
            disabled={!svg}
          >
            <Download size={14} className="ml-2" /> تنزيل
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            onClick={handlePrint}
            disabled={!svg}
          >
            <Printer size={14} className="ml-2" /> طباعة
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
