"use client";

import { useState } from "react";
import { Button } from "@/temp/button";
import { QrCode } from "lucide-react";
import { QRDialog } from "./QRDialog";

export function StudentQRButton({
  studentId,
  studentName,
}: {
  studentId: string;
  studentName: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <QrCode size={14} className="ml-2" />
        QR
      </Button>
      <QRDialog
        studentId={studentId}
        studentName={studentName}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
