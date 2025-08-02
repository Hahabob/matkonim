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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex items-center justify-center py-10 px-4">
      <Card className="w-full max-w-2xl p-8 shadow-2xl border border-blue-200 bg-white/90 rounded-3xl backdrop-blur-sm">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 font-medium hover:text-blue-800 transition"
        >
          &larr; Back
        </button>

        {isLoading ? (
          <p className="text-center text-blue-500 font-medium animate-pulse">
            Loading recepie...
          </p>
        ) : isError ? (
          <p className="text-center text-red-500 font-semibold">
            {error?.message || "Error loading post"}
          </p>
        ) : recepie ? (
          <>
            <h1 className="text-4xl font-extrabold text-blue-800 mb-4">
              {recepie.title}
            </h1>
            <p className="text-gray-700 mb-6 text-base leading-relaxed">
              {recepie.content}
            </p>

            <p className="text-xs text-gray-400 italic mb-6">
              Posted on {new Date(recepie.CreatedAt).toLocaleString()}
            </p>

            {localError && (
              <p className="text-red-600 font-semibold mb-4">{localError}</p>
            )}

            {user?._id === recepie.createdBy._id && (
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="mr-3 bg-gradient-to-r from-[#2A7B9B] to-[#57C785] text-white shadow-md hover:brightness-110 transition">
                    Edit recepie
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogTitle className="text-xl font-semibold mb-2">
                    Edit recepie
                  </DialogTitle>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="title-input">Title</Label>
                      <Input
                        id="title-input"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="body-input">Body</Label>
                      <Input
                        id="body-input"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="default"
                      onClick={() => setIsOpen(false)}
                      className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 shadow-sm px-4 py-2 rounded-xl transition-colors"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveEdit}
                      disabled={updateMutation.isPending}
                      className="bg-gradient-to-r from-[#2A7B9B] to-[#57C785] text-white hover:brightness-110 transition"
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
