import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useCreateRecepie } from "@/hooks/CreateRecepieForm";
import {
  Pencil,
  SquarePlus,
  Trash,
  Clock,
  Package,
  SlidersHorizontal,
  List,
  Croissant,
  ChefHat,
} from "lucide-react";

export default function RecepieForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
  const [steps, setSteps] = useState([""]);
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy"
  );

  const { mutate, isPending, isSuccess, error } = useCreateRecepie();
  const navigate = useNavigate();

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };
  const updateIngredient = (
    index: number,
    field: "name" | "quantity",
    value: string
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };
  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addStep = () => {
    setSteps([...steps, ""]);
  };
  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };
  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      {
        title,
        content,
        ingredients,
        steps,
        prepTime: Number(prepTime),
        cookTime: Number(cookTime),
        difficulty,
      },
      {
        onSuccess: () => {
          setTitle("");
          setContent("");
          setIngredients([{ name: "", quantity: "" }]);
          setSteps([""]);
          setPrepTime("");
          setCookTime("");
          setDifficulty("easy");
          navigate("/home");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 dark:from-black dark:via-purple-900 dark:to-purple-800 flex items-center justify-center py-10 px-4">
      <Card className="w-full max-w-xl mx-auto p-10 rounded-2xl shadow-2xl border border-blue-200 dark:border-purple-700 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-6 text-blue-700 dark:text-purple-300 text-center">
          Add a new recipe
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-purple-300 mb-1 flex items-center gap-1">
              <Croissant  className="w-5 h-5 text-gray-600 dark:text-purple-400" />
              Recipe Name
            </label>
            <input
              className="w-full border border-gray-300 dark:border-purple-700 rounded-lg px-4 py-2 text-sm shadow-sm bg-white dark:bg-zinc-800 dark:text-purple-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-purple-600 transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={2}
              maxLength={50}
              placeholder="Recipe title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-purple-300 mb-1 flex items-center gap-1">
              <ChefHat className="w-5 h-5 text-gray-600 dark:text-purple-400" />
              Short Description
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

          {/* Ingredients */}
          <div>
            <label className="block font-semibold mb-2 text-gray-700 dark:text-purple-300 flex items-center gap-1">
              <Package className="w-4 h-4 text-gray-600 dark:text-purple-400" />
              Ingredients
            </label>
            {ingredients.map((ingredient, i) => (
              <div key={i} className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  placeholder="Name"
                  value={ingredient.name}
                  onChange={(e) => updateIngredient(i, "name", e.target.value)}
                  className="input flex-1"
                  required
                />
                <input
                  type="text"
                  placeholder="Quantity"
                  value={ingredient.quantity}
                  onChange={(e) =>
                    updateIngredient(i, "quantity", e.target.value)
                  }
                  className="input w-28"
                  required
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(i)}
                    className="btn-red flex items-center justify-center"
                    aria-label="Remove ingredient"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="btn-blue flex items-center gap-2"
            >
              <SquarePlus className="w-5 h-5" />
              Add Ingredient
            </button>
          </div>

          {/* Steps */}
          <div>
            <label className="block font-semibold mb-2 text-gray-700 dark:text-purple-300 flex items-center gap-1">
              <List className="w-4 h-4 text-gray-600 dark:text-purple-400" />
              Steps
            </label>
            {steps.map((step, i) => (
              <div key={i} className="flex gap-2 mb-2 items-center">
                <textarea
                  value={step}
                  onChange={(e) => updateStep(i, e.target.value)}
                  className="input flex-1"
                  rows={2}
                  required
                />
                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    className="btn-red flex items-center justify-center"
                    aria-label="Remove step"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addStep}
              className="btn-blue flex items-center gap-2"
            >
              <SquarePlus className="w-5 h-5" />
              Add Step
            </button>
          </div>

          <div className="flex gap-4">
            <div>
              <label className="block font-semibold mb-1 text-gray-700 dark:text-purple-300 flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-600 dark:text-purple-400" />
                Prep Time (minutes)
              </label>
              <input
                type="number"
                min={0}
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="input w-28"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700 dark:text-purple-300 flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-600 dark:text-purple-400" />
                Cook Time (minutes)
              </label>
              <input
                type="number"
                min={0}
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                className="input w-28"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700 dark:text-purple-300 flex items-center gap-1">
              <SlidersHorizontal className="w-4 h-4 text-gray-600 dark:text-purple-400" />
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value as "easy" | "medium" | "hard")
              }
              className="input"
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              Failed to add recipe
            </p>
          )}
          {isSuccess && (
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              Recipe added successfully!
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 dark:from-purple-700 dark:to-black text-white py-2 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <Pencil className="w-5 h-5" />
            {isPending ? "Submitting..." : "Create Recipe"}
          </button>
        </form>
      </Card>
    </div>
  );
}
