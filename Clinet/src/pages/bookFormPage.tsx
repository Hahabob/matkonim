import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useCreateBook } from "@/components/ui/Forms/CreateBookForm";
export default function BookForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { mutate, isPending, isSuccess, error } = useCreateBook();

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.id) {
      alert("User not logged in");
      return;
    }

    mutate(
      {
        title,
        body,
        authorId: user.id,
      },
      {
        onSuccess: () => {
          setTitle("");
          setBody("");
          navigate("/home");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex items-center justify-center py-10 px-4">
      <Card className="w-full max-w-xl mx-auto p-10 rounded-2xl shadow-2xl border border-blue-200 bg-white/80 backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">
          Add a new BOOK
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Book title
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={2}
              maxLength={50}
              placeholder="Post title"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Body
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm resize-none min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              minLength={10}
              maxLength={1000}
              placeholder="What's on your mind?"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 font-medium">
              Failed to add book
            </p>
          )}
          {isSuccess && (
            <p className="text-sm text-green-600 font-medium">
              Book added to the list!
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isPending ? "Submitting..." : " Create Post"}
          </button>
        </form>
      </Card>
    </div>
  );
}
