import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { NotebookTabs } from "lucide-react";
type Recepie = {
  _id: string;
  title: string;
  content: string;
  likes: string[];
};

async function fetchRecepies(): Promise<Recepie[]> {
  const res = await api.get("/recepie");
  return res.data.data;
}

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: recepiesData,
    isLoading,
    isError,
  } = useQuery<Recepie[]>({
    queryKey: ["recepies"],
    queryFn: fetchRecepies,
  });

  const [recepies, setRecepies] = useState<Recepie[]>([]);

  useEffect(() => {
    setRecepies(recepiesData ?? []);
  }, [recepiesData]);

  const toggleLike = async (recipeId: string) => {
    if (!user) {
      alert("Please log in to like recipes.");
      return;
    }

    // Optimistic UI update
    setRecepies((currentRecepies) =>
      currentRecepies.map((recipe) => {
        if (recipe._id !== recipeId) return recipe;
        const userHasLiked = recipe.likes.includes(user._id);
        return {
          ...recipe,
          likes: userHasLiked
            ? recipe.likes.filter((id) => id !== user._id)
            : [...recipe.likes, user._id],
        };
      })
    );

    try {
      await api.post(
        `/recepie/${recipeId}/like`,
        {},
        { withCredentials: true }
      );
      await queryClient.invalidateQueries({ queryKey: ["recepies"] });
    } catch (error) {
      await queryClient.invalidateQueries({ queryKey: ["recepies"] });
      alert("Failed to update like, please try again.");
    }
  };

  if (isLoading) {
    return (
      <p className="text-center text-blue-500 text-lg animate-pulse font-medium">
        Loading recipes...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 text-lg font-semibold">
        Failed to load recipes.
      </p>
    );
  }

  if (recepies.length === 0) {
    return (
      <p className="text-center text-gray-500 text-base italic">
        No recipes yet. Be the first to add one!
      </p>
    );
  }

  return (
    <main
      className="
        min-h-screen
        bg-gradient-to-br from-blue-100 via-white to-green-100
        dark:from-black dark:via-purple-900 dark:to-purple-800
        py-12 px-4
        flex justify-center
      "
    >
      <div
        className="
          w-full max-w-6xl
          p-6 rounded-3xl shadow-2xl border border-blue-200 dark:border-purple-700
          bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md transition-all
          grid gap-6
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
        "
      >
        {recepies.map(({ _id, title, content, likes }) => {
          const userHasLiked = user ? likes.includes(user._id) : false;

          return (
            <article
              key={_id}
              className="
                flex flex-col justify-between
                border border-blue-100 dark:border-purple-700
                rounded-2xl
                p-6
                bg-white/90 dark:bg-zinc-800/90
                shadow-md dark:shadow-purple-700/50
                hover:shadow-xl transition-shadow duration-200
              "
            >
              <h2 className="text-xl font-bold text-blue-800 dark:text-purple-300 mb-3">
                {title}
              </h2>
              <p className="text-gray-700 dark:text-purple-200 text-sm leading-relaxed flex-grow">
                {content.length > 150 ? `${content.slice(0, 150)}...` : content}
              </p>
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => navigate(`/recepies/${_id}`)}
                  className="
    bg-gradient-to-r from-blue-500 to-green-400
    dark:from-purple-700 dark:to-black
    text-white
    text-sm
    px-4 py-2
    rounded-lg
    shadow
    hover:brightness-105
    transition-all duration-150
    whitespace-nowrap
    flex items-center gap-2
  "
                >
                  <NotebookTabs className="w-4 h-4" />
                  View Details
                </button>
                <button
                  onClick={() => toggleLike(_id)}
                  aria-label={userHasLiked ? "Unlike recipe" : "Like recipe"}
                  className={`text-xl ${
                    userHasLiked ? "text-red-500" : "text-gray-400"
                  } select-none`}
                >
                  {userHasLiked ? "❤️" : "🤍"} {likes.length}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
