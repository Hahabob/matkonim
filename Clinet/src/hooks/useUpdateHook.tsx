import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";

type UpdateRecepiesParmas = {
  id: string;
  data: {
    title: string;
    body: string;
  };
};
export function useUpdateRecepie() {
  return useMutation({
    mutationFn: async ({ id, data }: UpdateRecepiesParmas) => {
      const response = await api.patch(`/recepie/${id}`, data, {
        withCredentials: true,
      });
      return response.data;
    },
  });
}
