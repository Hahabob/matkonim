import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";

type Ingredient = {
  name: string;
  quantity: string;
};

type Recepie = {
  _id: string; 
  title: string;
  content: string;
  createdBy: {
    _id: string;
    name: string;
    email?: string;
  };
  createdAt: string; 
  updatedAt: string;
  likes: string[];
  ingredients: Ingredient[];
  steps: string[];
  prepTime: number;
  cookTime: number;
  difficulty: "easy" | "medium" | "hard";
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export function useFetchRecepie(id?: string) {
  return useQuery<Recepie, Error>({
    queryKey: ["recepies", id],
    queryFn: async () => {
      if (!id) throw new Error("Recepie id is required");
      const response = await api.get<ApiResponse<Recepie>>(`/recepie/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}
