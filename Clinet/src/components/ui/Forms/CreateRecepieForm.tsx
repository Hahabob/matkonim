import { useMutation } from "@tanstack/react-query";
import z from "zod";
import { api } from "@/lib/axios";
export const RecepieSchame = z.object({
  title: z.string(),
  body: z.string(),
  authorId: z.string(),
});

export type RecepieInput = z.infer<typeof RecepieSchame>;
const createRecepie = async (data: RecepieInput) => {
  const validated = RecepieSchame.parse(data);
  const response = await api.post("/recepies", validated);
  return response.data;
};
export function useCreateRecepie() {
  return useMutation({ mutationFn: createRecepie });
}
