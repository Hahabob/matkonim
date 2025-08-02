import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await api.get("/auth/me", { withCredentials: true });
      console.log("Current user data:", response.data.email);
      return response.data.data ?? null;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
