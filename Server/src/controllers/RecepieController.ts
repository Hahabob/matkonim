import { AuthRequest } from "../middleware/auth";
import { Request, Response } from "express";
import RecepieModel from "../models/Recepie";
import UserModel from "../models/User";
import { Types } from "mongoose";
const RecepieController = {
  async create(req: AuthRequest, res: Response) {
    try {
      const {
        title,
        content,
        ingredients = [],
        steps = [],
        prepTime,
        cookTime,
        difficulty,
      } = req.body ?? {};
      const user = await UserModel.findById(req.user!.userId);
      if (!user) {
        res.status(400).json({ message: "User dosen't exist" });
        return;
      }
      const newRecepie = await RecepieModel.create({
        title,
        content,
        ingredients,
        steps,
        prepTime,
        cookTime,
        difficulty,
        createdBy: user._id,
      });

      const populatedRecepie = await newRecepie.populate("createdBy", "name");

      res.status(201).json({
        success: true,
        message: "recepie created successfully",
        data: populatedRecepie,
      });
    } catch (error) {
      console.error("Creation error:", error);
      res.status(500).json({ message: "Server error during creation" });
    }
  },
  async get(req: Request, res: Response) {
    try {
      const { recepieId } = req.params;
      const recepie = await RecepieModel.findById(recepieId).populate(
        "createdBy",
        "name"
      );
      if (!recepie) {
        res.status(400).json({ success: false, message: "recepie not found" });
        return;
      }
      res.json({
        data: recepie,
        success: true,
      });
    } catch (error) {
      console.error("cant get", error);
      res.status(500).json({ message: "server error during get function" });
    }
  },
  async update(req: AuthRequest, res: Response) {
    try {
      const {
        title,
        content,
        ingredients,
        steps,
        prepTime,
        cookTime,
        difficulty,
      } = req.body;
      const recepie = req.recepie;

      if (!recepie) {
        return res
          .status(404)
          .json({ success: false, message: "recepie not found" });
      }
      recepie.title = title ?? recepie.title;
      recepie.content = content ?? recepie.content;
      recepie.ingredients = ingredients ?? recepie.ingredients;
      recepie.steps = steps ?? recepie.steps;
      recepie.prepTime = prepTime ?? recepie.prepTime;
      recepie.cookTime = cookTime ?? recepie.cookTime;
      recepie.difficulty = difficulty ?? recepie.difficulty;

      await recepie.save();

      const populatedRecepie = await recepie.populate("createdBy", "name");

      res.status(201).json({
        success: true,
        message: "recepie updated successfully",
        data: populatedRecepie,
      });
    } catch (error) {
      console.error("cant update", error);
      res.status(500).json({ message: "server error during update" });
    }
  },
  async delete(req: AuthRequest, res: Response) {
    try {
      const recepie = req.recepie;
      if (!recepie) {
        return res
          .status(404)
          .json({ success: false, message: "recepie not found" });
      }

      const populatedRecepie = await await recepie.deleteOne();
      res.status(201).json({
        success: true,
        message: "recepie deleted successfully",
        data: populatedRecepie,
      });
    } catch (error) {
      console.error("cant delete", error);
      res.status(500).json({ message: "server error during delete" });
    }
  },
  async getAll(req: Request, res: Response) {
    try {
      const recepies =
        (await RecepieModel.find({}).populate("createdBy", "name")) ||
        "no recepies yet";
      res.json({
        data: recepies,
        success: true,
      });
    } catch (error) {
      console.error("cant get", error);
      res.status(500).json({ message: "server error during get function" });
    }
  },
  async toggleLike(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { recepieId } = req.params;

      const recepie = await RecepieModel.findById(recepieId);
      if (!recepie) {
        return res
          .status(404)
          .json({ success: false, message: "Recepie not found" });
      }

      const hasLiked = recepie.likes.some(
        (id) => id.toString() === userId.toString()
      );

      if (hasLiked) {
        recepie.likes = recepie.likes.filter(
          (id) => id.toString() !== userId.toString()
        );
      } else {
        recepie.likes.push(new Types.ObjectId(userId));
      }

      await recepie.save();

      res.json({
        success: true,
        liked: !hasLiked,
        likesCount: recepie.likes.length,
      });
    } catch (error) {
      console.error("toggleLike error:", error);
      res.status(500).json({ message: "Server error during like toggle" });
    }
  },
};

export default RecepieController;
