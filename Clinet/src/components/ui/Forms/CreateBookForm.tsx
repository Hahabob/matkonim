import { useMutation } from "@tanstack/react-query";
import z from "zod";
import { api } from "@/lib/axios";
export const BookSchame = z.object({
  title: z.string(),
  body: z.string(),
  authorId: z.string(),
});

export type BooktInput = z.infer<typeof BookSchame>;
const createBook = async (data: BooktInput) => {
  const validated = BookSchame.parse(data);
  const response = await api.post("/books", validated);
  return response.data;
};
export function useCreateBook() {
  return useMutation({ mutationFn: createBook });
}
