// src/components/groups/GroupsGridContent.tsx
import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";

import { getGroupsList } from "@/queries/group.queries";
import { Button } from "@/components/ui/button";
import { GroupCard } from "./GroupCard";
import { ACTIVITIES, ActivityType } from "@/constants";

interface GroupsGridContentProps {
  type: ActivityType;
}

export async function GroupsGridContent({ type }: GroupsGridContentProps) {
  const groups = await getGroupsList(type);
  console.log("🚀 ~ GroupsGridContent ~ groups:", groups);

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 border border-dashed border-border rounded-xl text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <BookOpen size={28} className="text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-1">
          لا توجد {ACTIVITIES.labels[type]} بعد
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          ابدأ بإنشاء أول مجموعة في هذا القسم
        </p>
        <Button asChild>
          <Link href={`/dashboard/groups/${type}/new`}>
            <Plus size={16} className="ml-2" />
            إنشاء مجموعة
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => (
        <GroupCard key={group._id} group={group} type={type} />
      ))}
    </div>
  );
}
