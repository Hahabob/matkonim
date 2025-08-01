import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";
type Recepie = {
  _id: string;
  title: string;
  content: string;
};

// TODO implement react query to render recepies
export default function HomePage() {
  const [recepies, setRecepies] = useState<Recepie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const getBooks = async () => {
    try {
      const { data } = await api.get(`/recepie`);
      setRecepies(data.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to load recepies");
      setLoading(false);
    }
  };
  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-4xl mx-auto p-10 rounded-3xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] border border-blue-100 bg-white/80 backdrop-blur-md transition-all">
        <main>
          <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-700 drop-shadow-sm">
            Welcome to the recepies App
          </h1>

          {loading ? (
            <p className="text-center text-blue-500 text-lg animate-pulse font-medium">
              Loading recepies...
            </p>
          ) : error ? (
            <p className="text-center text-red-500 text-lg font-semibold">
              {error}
            </p>
          ) : recepies.length === 0 ? (
            <p className="text-center text-gray-500 text-base italic">
              No recipes yet. Be the first to add one!
            </p>
          ) : (
            <ul className="space-y-6">
              {recepies.map((recepie) => (
                <li
                  key={recepie._id}
                  className="border border-blue-100 rounded-2xl p-6 bg-white/90 shadow-md hover:shadow-xl transition-all duration-200"
                >
                  <h2 className="text-2xl font-bold text-blue-800 mb-2">
                    {recepie.title}
                  </h2>

                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    {recepie.content.length > 150
                      ? `${recepie.content.slice(0, 150)}...`
                      : recepie.content}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/recepie/${recepie._id}`)}
                      className="bg-gradient-to-r from-blue-500 to-green-400 text-white text-sm px-4 py-2 rounded-lg shadow hover:brightness-105 transition-all duration-150"
                    >
                      View Details
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>
      </Card>
    </div>
  );
}
