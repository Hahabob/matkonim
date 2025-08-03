import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

export function useToggleRecipeLike() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (recipeId: string) => {
      if (!user) throw new Error("You must be logged in to like a recipe");
      const response = await api.post(
        `/recepie/${recipeId}/like`,
        {}, 
        { withCredentials: true }
      );
      return response.data;
    },
    onMutate: async (recipeId: string) => {
      if (!user) return;

      await queryClient.cancelQueries({ queryKey: ["recepies"] });

      const previousRecipes = queryClient.getQueryData(["recepies"]);

      queryClient.setQueryData(["recepies"], (currentRecipes: any) =>
        currentRecipes?.map((recipe: any) => {
          if (recipe._id !== recipeId) return recipe;

          const userHasLiked = recipe.likes.includes(user._id);

          return {
            ...recipe,
            likes: userHasLiked
              ? recipe.likes.filter((userId: string) => userId !== user._id)
              : [...recipe.likes, user._id],
          };
        })
      );

      return { previousRecipes };
    },
    onError: (_error, _recipeId, context) => {
      if (context?.previousRecipes) {
        queryClient.setQueryData(["recepies"], context.previousRecipes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["recepies"] });
    },
  });
}
