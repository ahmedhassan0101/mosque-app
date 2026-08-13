import React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

export default function ViewButton({ href }: { href: string }) {
  return (
    <Button asChild variant="outline" size="sm" className="shrink-0">
      <Link href={href}>
        <Eye size={14} className="ml-1.5" /> عرض
      </Link>
    </Button>
  );
}
