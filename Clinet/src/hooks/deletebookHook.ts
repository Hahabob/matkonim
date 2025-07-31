import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export function useDeleteRecepie() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/recepies/${id}`);
      return response.data;
    },
  });
}
