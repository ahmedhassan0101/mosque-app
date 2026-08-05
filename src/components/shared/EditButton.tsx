import Link from "next/link";
import { Button } from "../../temp/button";
import { Pencil } from "lucide-react";

export default function EditButton({ href }: { href: string }) {
  return (
    <Button asChild variant="outline" size="sm" className="shrink-0">
      <Link href={href}>
        <Pencil size={13} className="ml-1.5" />
        تعديل
      </Link>
    </Button>
  );
}
