import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";

type Ingredient = {
  name: string;
  quantity: string;
};

type UpdateRecepiesParmas = {
  id: string;
  data: {
    title: string;
    body: string;
    ingredients?: Ingredient[];
    steps?: string[];
    prepTime?: number;
    cookTime?: number;
    difficulty?: "easy" | "medium" | "hard";
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
