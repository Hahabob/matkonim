import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export function useDeleteRecepie() {
  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse<null>>(`/recepie/${id}`, {
        withCredentials: true,
      });
      return response.data;
    },
  });
}
