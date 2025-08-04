import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";

type RecipeData = {
  title: string;
  content: string;
  ingredients: Ingredient[];
  steps: string[];
  prepTime?: number;
  cookTime?: number;
  difficulty: "easy" | "medium" | "hard";
};
type Ingredient = {
  name: string;
  quantity: string;
};
export function useCreateRecepie() {
  return useMutation({
    mutationFn: async (data: RecipeData) => {
      const response = await api.post("/recepie/create", data, {
        withCredentials: true,
      });
      return response.data;
    },
  });
}
