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

import { useFetchBook } from "@/hooks/useFetchBook";
import { useUpdateBook } from "@/hooks/useUpdateHook";
import { useDeleteBooks } from "@/hooks/deletebookHook";


export default function BookDetails() {
  const { id } = useParams() as { id: string };
  const navigate = useNavigate();

  const { data: book, isLoading, isError, error, refetch } = useFetchBook(id);

  const updateMutation = useUpdateBook();

  const deleteMutation = useDeleteBooks();

  const [isOpen, setIsOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedBody, setEditedBody] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (book) {
      setEditedTitle(book.title);
      setEditedBody(book.body);
    }
  }, [book]);

  const handleDelete = () => {
    if (!id) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        navigate("/home");
      },
      onError: () => {
        setLocalError("Failed to delete book");
      },
    });
  };

  const handleSaveEdit = () => {
    if (!id) return;

    updateMutation.mutate(
      { id, data: { title: editedTitle, body: editedBody } },
      {
        onSuccess: () => {
          setIsOpen(false);
          refetch();
        },
        onError: () => {
          setLocalError("Failed to update book");
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
            Loading book...
          </p>
        ) : isError ? (
          <p className="text-center text-red-500 font-semibold">
            {error?.message || "Error loading post"}
          </p>
        ) : book ? (
          <>
            <h1 className="text-4xl font-extrabold text-blue-800 mb-4">
              {book.title}
            </h1>
            <p className="text-gray-700 mb-6 text-base leading-relaxed">
              {book.body}
            </p>

            <p className="text-xs text-gray-400 italic mb-6">
              Posted on {new Date(book.createdAt).toLocaleString()}
            </p>

            {localError && (
              <p className="text-red-600 font-semibold mb-4">{localError}</p>
            )}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="mr-3 bg-gradient-to-r from-[#2A7B9B] to-[#57C785] text-white shadow-md hover:brightness-110 transition">
                  Edit Book
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogTitle className="text-xl font-semibold mb-2">
                  Edit Book
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
                      value={editedBody}
                      onChange={(e) => setEditedBody(e.target.value)}
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

            <Button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="mt-6 bg-gradient-to-r from-red-500 to-red-700 text-white hover:brightness-110 transition"
            >
              {deleteMutation.isPending ? "Deleting..." : " Delete Post"}
            </Button>
          </>
        ) : null}
      </Card>
    </div>
  );
}
