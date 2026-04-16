import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserDropdown() {
  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          type="button"
          size="lg"
          className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-muted focus-ring"
          aria-label="حساب المستخدم"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatar.png" alt="الصورة الشخصية" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              م
            </AvatarFallback>
          </Avatar>
          <div className="hidden flex-col text-start sm:flex">
            <span className="text-xs font-medium leading-tight text-foreground">
              المدير العام
            </span>
            <span className="text-[10px] text-muted-foreground">
              admin@masjid.com
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">المدير العام</span>
            <span className="text-xs text-muted-foreground">
              admin@masjid.com
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          الملف الشخصي
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          الإعدادات
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
          تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
