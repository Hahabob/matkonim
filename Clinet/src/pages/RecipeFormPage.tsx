import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useCreateRecepie } from "@/hooks/CreateRecepieForm";
export default function RecepieForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { mutate, isPending, isSuccess, error } = useCreateRecepie();

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      {
        title,
        content,
      },
      {
        onSuccess: () => {
          setTitle("");
          setContent("");
          navigate("/home");
        },
      }
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 dark:from-black dark:via-purple-900 dark:to-purple-800 flex items-center justify-center py-10 px-4">
      <Card className="w-full max-w-xl mx-auto p-10 rounded-2xl shadow-2xl border border-blue-200 dark:border-purple-700 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-6 text-blue-700 dark:text-purple-300 text-center">
          Add a new recepie
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-purple-300 mb-1">
              Recepie name
            </label>
            <input
              className="w-full border border-gray-300 dark:border-purple-700 rounded-lg px-4 py-2 text-sm shadow-sm bg-white dark:bg-zinc-800 dark:text-purple-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-purple-600 transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={2}
              maxLength={50}
              placeholder="Recepie title"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-purple-300 mb-1">
              A short description of your favorite dish!
            </label>
            <textarea
              className="w-full border border-gray-300 dark:border-purple-700 rounded-lg px-4 py-2 text-sm shadow-sm resize-none min-h-[120px] bg-white dark:bg-zinc-800 dark:text-purple-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-purple-600 transition-all"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              minLength={10}
              maxLength={1000}
              placeholder="Write a short description of your favorite dish!"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              Failed to add recepie
            </p>
          )}
          {isSuccess && (
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              Recepie added to the list!
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 dark:from-purple-700 dark:to-black text-white py-2 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isPending ? "Submitting..." : " Create Post"}
          </button>
        </form>
      </Card>
    </div>
  );
}
