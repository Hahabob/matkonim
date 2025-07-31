import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";

type UpdateBooksParmas = {
  id: string;
  data: {
    title: string;
    body: string;
  };
};
export function useUpdateBook() {
  return useMutation({
    mutationFn: async ({ id, data }: UpdateBooksParmas) => {
      const response = await api.put(`/books/${id}`, data);
      return response.data;
    },
  });
}
