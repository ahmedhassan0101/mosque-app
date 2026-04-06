import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { AppError } from "@/lib/api/errors";

export interface SheikhItem {
  _id: string;
  name: string;
  phone?: string;
  photo?: string;
  notes?: string;
  groupId?: {
    _id: string;
    name: string;
    activity: string;
  };
  createdAt: string;
}

/**
 * Fetch all sheikhs — accepts initialData from server component
 * to avoid unnecessary requests on initial load
 */
export function useSheikhs(initialData?: { sheikhs: SheikhItem[] }) {
  return useQuery<{ sheikhs: SheikhItem[] }, AppError>({
    queryKey: ["sheikhs"],
    queryFn: async () => {
      const { data } = await api.get("/api/sheikhs");
      return data;
    },
    initialData,
    staleTime: 60_000,
  });
}

/**
 * Fetch a single sheikh by id
 */
export function useSheikh(id: string, initialData?: { sheikh: SheikhItem }) {
  return useQuery<{ sheikh: SheikhItem }, AppError>({
    queryKey: ["sheikhs", id],
    queryFn: async () => {
      const { data } = await api.get(`/api/sheikhs/${id}`);
      return data;
    },
    enabled: !!id,
    initialData,
    staleTime: 60_000,
  });
}
