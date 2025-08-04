import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

import { useFetchRecepie } from "@/hooks/useFetchRecepie";
import { useUpdateRecepie } from "@/hooks/useUpdateHook";
import { useDeleteRecepie } from "@/hooks/deletebookHook";
import { useAuth } from "@/context/AuthContext";
import { ArrowBigLeft } from "lucide-react";

export default function RecepieDetails() {
  const { user } = useAuth();
  const { id } = useParams() as { id: string };
  const navigate = useNavigate();

  const {
    data: recepie,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchRecepie(id);

  const updateMutation = useUpdateRecepie();
  const deleteMutation = useDeleteRecepie();

  const [isOpen, setIsOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedIngredients, setEditedIngredients] = useState<
    { name: string; quantity: string }[]
  >([{ name: "", quantity: "" }]);
  const [editedSteps, setEditedSteps] = useState<string[]>([""]);
  const [editedPrepTime, setEditedPrepTime] = useState<number | "">("");
  const [editedCookTime, setEditedCookTime] = useState<number | "">("");
  const [editedDifficulty, setEditedDifficulty] = useState<
    "easy" | "medium" | "hard"
  >("easy");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (recepie) {
      setEditedTitle(recepie.title);
      setEditedContent(recepie.content);
      setEditedIngredients(recepie.ingredients ?? [{ name: "", quantity: "" }]);
      setEditedSteps(recepie.steps ?? [""]);
      setEditedPrepTime(recepie.prepTime ?? "");
      setEditedCookTime(recepie.cookTime ?? "");
      setEditedDifficulty(recepie.difficulty ?? "easy");
    }
  }, [recepie]);

  const updateIngredient = (
    index: number,
    field: "name" | "quantity",
    value: string
  ) => {
    const newIngredients = [...editedIngredients];
    newIngredients[index][field] = value;
    setEditedIngredients(newIngredients);
  };

  const addIngredient = () => {
    setEditedIngredients([...editedIngredients, { name: "", quantity: "" }]);
  };

  const removeIngredient = (index: number) => {
    setEditedIngredients(editedIngredients.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...editedSteps];
    newSteps[index] = value;
    setEditedSteps(newSteps);
  };

  const addStep = () => {
    setEditedSteps([...editedSteps, ""]);
  };

  const removeStep = (index: number) => {
    setEditedSteps(editedSteps.filter((_, i) => i !== index));
  };

  const handleDelete = () => {
    if (!id) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        navigate("/home");
      },
      onError: () => {
        setLocalError("Failed to delete recipe");
      },
    });
  };

  const handleSaveEdit = () => {
    if (!id) return;

    setLocalError("");

    updateMutation.mutate(
      {
        id,
        data: {
          title: editedTitle,
          body: editedContent,
          ingredients: editedIngredients,
          steps: editedSteps,
          prepTime:
            typeof editedPrepTime === "number" ? editedPrepTime : undefined,
          cookTime:
            typeof editedCookTime === "number" ? editedCookTime : undefined,
          difficulty: editedDifficulty,
        },
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          refetch();
        },
        onError: () => {
          setLocalError("Failed to update recipe");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 dark:from-black dark:via-purple-900 dark:to-purple-800 flex items-center justify-center py-10 px-4">
      <Card className="w-full max-w-2xl p-8 shadow-2xl border border-blue-200 dark:border-purple-700 bg-white/90 dark:bg-zinc-900/90 rounded-3xl backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 dark:text-purple-300 font-medium hover:text-blue-800 dark:hover:text-purple-400 transition flex items-center gap-1"
        >
          <ArrowBigLeft className="w-5 h-5" />
          Back
        </button>

        {isLoading ? (
          <p className="text-center text-purple-400 font-medium animate-pulse">
            Loading recipe...
          </p>
        ) : isError ? (
          <p className="text-center text-red-600 font-semibold">
            {error?.message || "Error loading recipe"}
          </p>
        ) : recepie ? (
          <>
            <h1 className="text-4xl font-extrabold text-blue-800 dark:text-purple-300 mb-4">
              {recepie.title}
            </h1>
            <p className="text-gray-700 dark:text-purple-200 mb-6 text-base leading-relaxed">
              {recepie.content}
            </p>

            {/* Ingredients */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-purple-300 mb-2">
                Ingredients
              </h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-purple-200">
                {recepie.ingredients?.map((ingredient, i) => (
                  <li key={i}>
                    {ingredient.name} - {ingredient.quantity}
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-purple-300 mb-2">
                Steps
              </h3>
              <ol className="list-decimal list-inside text-gray-700 dark:text-purple-200 space-y-1">
                {recepie.steps?.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Prep Time, Cook Time, Difficulty */}
            <div className="flex gap-6 mb-6 text-gray-700 dark:text-purple-200">
              <p>
                <strong>Prep Time:</strong> {recepie.prepTime ?? "N/A"} minutes
              </p>
              <p>
                <strong>Cook Time:</strong> {recepie.cookTime ?? "N/A"} minutes
              </p>
              <p>
                <strong>Difficulty:</strong> {recepie.difficulty ?? "N/A"}
              </p>
            </div>

            <p className="text-xs text-gray-400 dark:text-purple-400 italic mb-6">
              Posted on {new Date(recepie.createdAt).toLocaleString()}
            </p>

            {localError && (
              <p className="text-red-600 font-semibold mb-4">{localError}</p>
            )}

            {user?._id === recepie.createdBy._id && (
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="mr-3 bg-gradient-to-r from-blue-500 to-green-400 dark:from-purple-700 dark:to-black text-white shadow-md hover:brightness-110 transition">
                    Edit recipe
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogTitle className="text-xl font-semibold mb-2 text-blue-800 dark:text-purple-300">
                    Edit recipe
                  </DialogTitle>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label
                        htmlFor="title-input"
                        className="text-gray-700 dark:text-purple-300"
                      >
                        Title
                      </Label>
                      <Input
                        id="title-input"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="dark:bg-zinc-800 dark:text-purple-200 border border-gray-300 dark:border-purple-700 rounded-lg"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="content-input"
                        className="text-gray-700 dark:text-purple-300"
                      >
                        Content
                      </Label>
                      <Input
                        id="content-input"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="dark:bg-zinc-800 dark:text-purple-200 border border-gray-300 dark:border-purple-700 rounded-lg"
                      />
                    </div>

                    {/* Ingredients */}
                    <div>
                      <Label className="block font-semibold mb-1 text-gray-700 dark:text-purple-300">
                        Ingredients
                      </Label>
                      {editedIngredients.map((ingredient, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Name"
                            value={ingredient.name}
                            onChange={(e) =>
                              updateIngredient(i, "name", e.target.value)
                            }
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
                          {editedIngredients.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeIngredient(i)}
                              className="btn-red"
                              aria-label="Remove ingredient"
                            >
                              &times;
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addIngredient}
                        className="btn-blue"
                      >
                        + Add Ingredient
                      </button>
                    </div>

                    {/* Steps */}
                    <div>
                      <Label className="block font-semibold mb-1 text-gray-700 dark:text-purple-300">
                        Steps
                      </Label>
                      {editedSteps.map((step, i) => (
                        <div key={i} className="flex gap-2 mb-2 items-center">
                          <textarea
                            value={step}
                            onChange={(e) => updateStep(i, e.target.value)}
                            className="input flex-1"
                            rows={2}
                            required
                          />
                          {editedSteps.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeStep(i)}
                              className="btn-red"
                              aria-label="Remove step"
                            >
                              &times;
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addStep}
                        className="btn-blue"
                      >
                        + Add Step
                      </button>
                    </div>

                    <div className="flex gap-4 mt-4">
                      <div>
                        <Label className="block font-semibold mb-1 text-gray-700 dark:text-purple-300">
                          Prep Time (minutes)
                        </Label>
                        <input
                          type="number"
                          min={0}
                          value={editedPrepTime}
                          onChange={(e) =>
                            setEditedPrepTime(
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value)
                            )
                          }
                          className="input w-28"
                          required
                        />
                      </div>

                      <div>
                        <Label className="block font-semibold mb-1 text-gray-700 dark:text-purple-300">
                          Cook Time (minutes)
                        </Label>
                        <input
                          type="number"
                          min={0}
                          value={editedCookTime}
                          onChange={(e) =>
                            setEditedCookTime(
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value)
                            )
                          }
                          className="input w-28"
                          required
                        />
                      </div>

                      <div>
                        <Label className="block font-semibold mb-1 text-gray-700 dark:text-purple-300">
                          Difficulty
                        </Label>
                        <select
                          value={editedDifficulty}
                          onChange={(e) =>
                            setEditedDifficulty(
                              e.target.value as "easy" | "medium" | "hard"
                            )
                          }
                          className="input"
                          required
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="default"
                      onClick={() => setIsOpen(false)}
                      className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 shadow-sm px-4 py-2 rounded-xl transition-colors dark:bg-zinc-700 dark:text-purple-300 dark:hover:bg-zinc-600 dark:border-purple-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveEdit}
                      disabled={updateMutation.isPending}
                      className="bg-gradient-to-r from-blue-500 to-green-400 dark:from-purple-700 dark:to-black text-white hover:brightness-110 transition"
                    >
                      {updateMutation.isPending ? "Saving..." : "Save changes"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {user?._id === recepie.createdBy._id && (
              <Button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="mt-6 bg-gradient-to-r from-red-500 to-red-700 text-white hover:brightness-110 transition"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete recipe"}
              </Button>
            )}
          </>
        ) : null}
      </Card>
    </div>
  );
}
