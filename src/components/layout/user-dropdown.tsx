// import { Button } from "../ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// export default function UserDropdown() {
//   return (
//     <DropdownMenu dir="rtl">
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="ghost"
//           type="button"
//           size="lg"
//           className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-muted focus-ring"
//           aria-label="حساب المستخدم"
//         >
//           <Avatar className="h-8 w-8">
//             <AvatarImage src="/avatar.png" alt="الصورة الشخصية" />
//             <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
//               م
//             </AvatarFallback>
//           </Avatar>
//           <div className="hidden flex-col text-start sm:flex">
//             <span className="text-xs font-medium leading-tight text-foreground">
//               المدير العام
//             </span>
//             <span className="text-[10px] text-muted-foreground">
//               admin@masjid.com
//             </span>
//           </div>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-48">
//         <DropdownMenuLabel className="font-normal">
//           <div className="flex flex-col gap-0.5">
//             <span className="text-sm font-medium">المدير العام</span>
//             <span className="text-xs text-muted-foreground">
//               admin@masjid.com
//             </span>
//           </div>
//         </DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem className="cursor-pointer">
//           الملف الشخصي
//         </DropdownMenuItem>
//         <DropdownMenuItem className="cursor-pointer">
//           الإعدادات
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
//           تسجيل الخروج
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
"use client";

import { useSession } from "next-auth/react";
import { logoutUser } from "@/actions/auth.actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, User, LogOut } from "lucide-react";
import Link from "next/link";

export function UserDropdown() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const { name, email, image } = session.user;
  const initials = name?.slice(0, 2) ?? "??";

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full focus-ring">
          <Avatar className="h-9 w-9">
            <AvatarImage src={image ?? ""} alt={name ?? ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
        {/* 

//         <Button
//           variant="ghost"
//           type="button"
//           size="lg"
//           className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-muted focus-ring"
//           aria-label="حساب المستخدم"
//         >
//           <Avatar className="h-8 w-8">
//             <AvatarImage src="/avatar.png" alt="الصورة الشخصية" />
//             <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
//               م
//             </AvatarFallback>
//           </Avatar>
//           <div className="hidden flex-col text-start sm:flex">
//             <span className="text-xs font-medium leading-tight text-foreground">
//               المدير العام
//             </span>
//             <span className="text-[10px] text-muted-foreground">
//               admin@masjid.com
//             </span>
//           </div>
//         </Button>

         */}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="space-y-0.5">
            <p className="font-semibold text-sm">{name}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 cursor-pointer"
          >
            <User className="h-4 w-4" />
            الملف الشخصي
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Settings className="h-4 w-4" />
            الإعدادات
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive focus:text-destructive cursor-pointer gap-2"
          onClick={() => logoutUser()}
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
