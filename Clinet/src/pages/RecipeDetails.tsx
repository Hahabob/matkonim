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
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (recepie) {
      setEditedTitle(recepie.title);
      setEditedContent(recepie.content);
    }
  }, [recepie]);

  const handleDelete = () => {
    if (!id) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        navigate("/home");
      },
      onError: () => {
        setLocalError("Failed to delete recepie");
      },
    });
  };

  const handleSaveEdit = () => {
    if (!id) return;

    setLocalError("");

    updateMutation.mutate(
      { id, data: { title: editedTitle, body: editedContent } },
      {
        onSuccess: () => {
          setIsOpen(false);
          refetch();
        },
        onError: () => {
          setLocalError("Failed to update recepie");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 dark:from-black dark:via-purple-900 dark:to-purple-800 flex items-center justify-center py-10 px-4">
      <Card className="w-full max-w-2xl p-8 shadow-2xl border border-blue-200 dark:border-purple-700 bg-white/90 dark:bg-zinc-900/90 rounded-3xl backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 dark:text-purple-300 font-medium hover:text-blue-800 dark:hover:text-purple-400 transition"
        >
          &larr; Back
        </button>

        {isLoading ? (
          <p className="text-center text-purple-400 font-medium animate-pulse">
            Loading recepie...
          </p>
        ) : isError ? (
          <p className="text-center text-red-600 font-semibold">
            {error?.message || "Error loading post"}
          </p>
        ) : recepie ? (
          <>
            <h1 className="text-4xl font-extrabold text-blue-800 dark:text-purple-300 mb-4">
              {recepie.title}
            </h1>
            <p className="text-gray-700 dark:text-purple-200 mb-6 text-base leading-relaxed">
              {recepie.content}
            </p>

            <p className="text-xs text-gray-400 dark:text-purple-400 italic mb-6">
              Posted on {new Date(recepie.CreatedAt).toLocaleString()}
            </p>

            {localError && (
              <p className="text-red-600 font-semibold mb-4">{localError}</p>
            )}

            {user?._id === recepie.createdBy._id && (
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="mr-3 bg-gradient-to-r from-blue-500 to-green-400 dark:from-purple-700 dark:to-black text-white shadow-md hover:brightness-110 transition">
                    Edit recepie
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogTitle className="text-xl font-semibold mb-2 text-blue-800 dark:text-purple-300">
                    Edit recepie
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
                        htmlFor="body-input"
                        className="text-gray-700 dark:text-purple-300"
                      >
                        Body
                      </Label>
                      <Input
                        id="body-input"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="dark:bg-zinc-800 dark:text-purple-200 border border-gray-300 dark:border-purple-700 rounded-lg"
                      />
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
                {deleteMutation.isPending ? "Deleting..." : " Delete recipe"}
              </Button>
            )}
          </>
        ) : null}
      </Card>
    </div>
  );
}
