import { useQuery } from "@tanstack/react-query";
import { api }      from "@/lib/api/client";
import type { AppError } from "@/lib/api/errors";

export interface StudentListItem {
  _id: string;
  name: string;
  birthDate: string;
  phone?: string;
  guardianPhone: string;
  level: string;
  enrollments: string[];
  photo?: string;
  isActive: boolean;
}

export interface StudentDetail extends StudentListItem {
  guardianName?: string;
  guardianPhone2?: string;
  address?: string;
  trackIbadah: boolean;
  currentSurah?: string;
  currentAyah?: number;
  notes?: string;
  createdAt: string;
}

interface StudentsParams {
  search?: string;
  activity?: string;
  page?: number;
  limit?: number;
}

export function useStudents(params: StudentsParams = {}) {
  return useQuery<{ students: StudentListItem[]; total: number }, AppError>({
    queryKey: ["students", params],
    queryFn: async () => {
      const { data } = await api.get("/api/students", { params });
      return data;
    },
    staleTime: 30_000,
  });
}

export function useStudent(id: string) {
  return useQuery<{ student: StudentDetail }, AppError>({
    queryKey: ["students", id],
    queryFn: async () => {
      const { data } = await api.get(`/api/students/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 60_000,
  });
}
