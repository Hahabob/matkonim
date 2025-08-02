import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";
type Recepie = {
  id: string;
  title: string;
  content: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  CreatedAt: Date;
  updatedAt: Date;
};
type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export function useFetchRecepie(id?: string | undefined) {
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
