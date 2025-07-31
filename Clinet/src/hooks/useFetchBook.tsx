import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";

type Recepie = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

export function useFetchRecepie(id?: string | undefined) {
  return useQuery<Recepie, Error>({
    queryKey: ["recepies", id],
    queryFn: async () => {
      if (!id) throw new Error("Recepie id is required");
      const response = await api.get<Recepie>(`/recepies/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}
