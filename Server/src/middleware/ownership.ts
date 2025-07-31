// middleware/checkBookOwnership.ts
import { Response, NextFunction } from "express";
import BookModel from "../models/Book";
import ReviewModel from "../models/Review";
import { Types } from "mongoose";
import { AuthRequest } from "./auth";

export const checkBookOwnership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { bookId } = req.params;
  const book = await BookModel.findById(bookId);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  const bookCreatorId = book?.createdBy._id;
  const userId = new Types.ObjectId(req.user!.userId);
  if (bookCreatorId === userId) {
    res
      .status(403)
      .json({ message: "you cant modify a book you didnt create" });
    return;
  }
  req.book = book;
  next();
};

export const checkReviewOwnership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { reviewId } = req.params;
  const review = await ReviewModel.findById(reviewId);
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }
  const reviewCreatorId = review?.reviewer._id;
  const userId = new Types.ObjectId(req.user!.userId);
  if (reviewCreatorId === userId) {
    res
      .status(403)
      .json({ message: "you cant modify a review you didnt create" });
    return;
  }
  req.review = review;
  next();
};

export const preventDuplicateReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const { book } = req.body;

    if (!userId || !book) {
      return res.status(400).json({ message: "User ID or Book ID missing" });
    }

    const existingReview = await ReviewModel.findOne({
      reviewer: userId,
      book,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this book." });
    }

    next();
  } catch (error) {
    console.error("Error checking duplicate review:", error);
    res.status(500).json({ message: "Server error" });
  }
};
