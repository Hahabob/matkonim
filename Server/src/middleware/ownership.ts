// middleware/checkBookOwnership.ts
import { Response, NextFunction } from "express";
import RecepieModel from "../models/Recepie";
import { Types } from "mongoose";
import { AuthRequest } from "./auth";

export const checkRecepieOwnership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { recepieId } = req.params;
  const recepie = await RecepieModel.findById(recepieId);
  if (!recepie) {
    return res.status(404).json({ message: "Recepie not found" });
  }
  const recepieCreatorId = recepie?.createdBy._id;
  const userId = new Types.ObjectId(req.user!.userId);
  if (recepieCreatorId === userId) {
    res
      .status(403)
      .json({ message: "you cant modify a recepie you didnt create" });
    return;
  }
  req.recepie = recepie;
  next();
};

// export const checkReviewOwnership = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { reviewId } = req.params;
//   const review = await ReviewModel.findById(reviewId);
//   if (!review) {
//     return res.status(404).json({ message: "Review not found" });
//   }
//   const reviewCreatorId = review?.reviewer._id;
//   const userId = new Types.ObjectId(req.user!.userId);
//   if (reviewCreatorId === userId) {
//     res
//       .status(403)
//       .json({ message: "you cant modify a review you didnt create" });
//     return;
//   }
//   req.review = review;
//   next();
// };

// export const preventDuplicateReview = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const userId = req.user?.userId;
//     const { book } = req.body;

//     if (!userId || !book) {
//       return res.status(400).json({ message: "User ID or Book ID missing" });
//     }

//     const existingReview = await ReviewModel.findOne({
//       reviewer: userId,
//       book,
//     });

//     if (existingReview) {
//       return res
//         .status(400)
//         .json({ message: "You have already reviewed this book." });
//     }

//     next();
//   } catch (error) {
//     console.error("Error checking duplicate review:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
