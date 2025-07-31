import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";

type Book = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

export function useFetchBook(id?: string | undefined) {
  return useQuery<Book, Error>({
    queryKey: ["books", id],
    queryFn: async () => {
      if (!id) throw new Error("book id is required");
      const response = await api.get<Book>(`/books/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}
