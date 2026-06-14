// src/hooks/useAttendanceStudents.ts
"use client";

import { useState, useEffect, useTransition } from "react";
import { fetchStudentsForGroups } from "@/actions/session.actions";
import { AttendanceStudentOption } from "@/queries/student.queries";

export function useAttendanceStudents(groupIds: string[]) {
  const [students, setStudents] = useState<AttendanceStudentOption[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (groupIds.length === 0) {
      setStudents([]);
      return;
    }

    startTransition(async () => {
      const result = await fetchStudentsForGroups(groupIds);
      if (result.status === "success" && result.data) {
        setStudents(result.data);
      } else {
        setStudents([]);
      }
    });
    // stringify to prevent infinite re-renders from array reference changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(groupIds)]);

  return { students, isLoading: isPending };
}

// import { useState, useEffect, useRef, useTransition } from "react";
// import { fetchStudentsForGroups } from "@/actions/session.actions";
// import type { AttendanceStudentOption } from "@/lib/data/student.data";

// export function useAttendanceStudents(groupIds: string[]) {
//   const [students, setStudents] = useState<AttendanceStudentOption[]>([]);
//   const [isPending, startTransition] = useTransition();

//   // Serialize once per render — stable reference for the effect
//   const groupIdsKey = groupIds.join(",");
//   const prevKeyRef = useRef<string>("");

//   useEffect(() => {
//     // No change — skip
//     if (groupIdsKey === prevKeyRef.current) return;
//     prevKeyRef.current = groupIdsKey;

//     // Empty selection — clear students without calling the server
//     if (!groupIdsKey) {
//       setStudents([]);
//       return;
//     }

//     startTransition(async () => {
//       const result = await fetchStudentsForGroups(groupIds);
//       setStudents(
//         result.status === "success" && result.data ? result.data : [],
//       );
//     });
//     // groupIdsKey is a primitive string — safe and stable as a dependency
//   }, [groupIdsKey]);

//   return { students, isLoading: isPending };
// }
