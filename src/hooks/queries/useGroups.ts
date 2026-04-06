

import { useQuery } from "@tanstack/react-query";
// import { AppError } from "@/lib/api/errors";
import { api } from "@/lib/api/client";

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const { data } = await api.get("/api/groups");
      return data;
    },
    staleTime: 60_000,
  });
}
