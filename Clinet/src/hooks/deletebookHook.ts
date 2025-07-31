import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";


export function useDeleteBooks() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/books/${id}`);
      return response.data;
    },
  });
}
