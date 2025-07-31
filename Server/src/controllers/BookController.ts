import { AuthRequest } from "../middleware/auth";
import { Request, Response } from "express";
import BookModel from "../models/Book";
import UserModel from "../models/User";
import { Types } from "mongoose";

const populateBook = async (id: Types.ObjectId) => {
  return await BookModel.findById(id)
    .populate("createdBy", "name email")
    .populate("author", "name");
};

const BookController = {
  async create(req: AuthRequest, res: Response) {
    try {
      const { title, author, publishedYear, genre } = req.body ?? {};
      const bookAuthor = await AuthorModel.findById(author);
      if (!bookAuthor) {
        res.status(400).json({ message: "author dosen't exist" });
        return;
      }
      const user = await UserModel.findById(req.user!.userId);
      if (!user) {
        res.status(400).json({ message: "User dosen't exist" });
        return;
      }
      const newBook = await BookModel.create({
        title,
        author: bookAuthor._id,
        publishedYear,
        genre,
        createdBy: user._id,
      });

      const populatedBook = await populateBook(newBook._id);

      res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: populatedBook,
      });
    } catch (error) {
      console.error("Creation error:", error);
      res.status(500).json({ message: "Server error during creation" });
    }
  },
  async get(req: Request, res: Response) {
    try {
      const { bookId } = req.params;
      const rate = req.query.rate ? Number(req.query.rate) : undefined;
      if (rate !== undefined && (isNaN(rate) || rate < 1 || rate > 5)) {
        return res.status(400).json({ message: "Invalid rate value" });
      }

      const filteredReviews = await ReviewModel.aggregate([
        { $match: { book: new Types.ObjectId(bookId) } },
        ...(rate !== undefined ? [{ $match: { rating: rate } }] : []),
      ]);
      const book = await populateBook(new Types.ObjectId(bookId));
      if (!book) {
        res.status(400).json({ success: false, message: "Book not found" });
        return;
      }
      res.json({
        data: { book: book, reviews: filteredReviews },
        success: true,
      });
    } catch (error) {
      console.error("cant get", error);
      res.status(500).json({ message: "server error during get function" });
    }
  },
  async update(req: AuthRequest, res: Response) {
    try {
      const { title, publishedYear, genre, author } = req.body;
      const book = req.book;

      if (!book) {
        return res
          .status(404)
          .json({ success: false, message: "Book not found" });
      }

      const bookAuthor = await AuthorModel.findById(author);

      if (!bookAuthor) {
        return res
          .status(400)
          .json({ success: false, message: "Author doesn't exist" });
      }

      book.title = title ?? book.title;
      book.publishedYear = publishedYear ?? book.publishedYear;
      book.genre = genre ?? book.genre;
      book.author = bookAuthor._id;

      await book.save();

      const populatedBook = await populateBook(book._id);

      res.status(201).json({
        success: true,
        message: "book updated successfully",
        data: populatedBook,
      });
    } catch (error) {
      console.error("cant update", error);
      res.status(500).json({ message: "server error during update" });
    }
  },
  async delete(req: AuthRequest, res: Response) {
    try {
      const book = req.book;
      if (!book) {
        return res
          .status(404)
          .json({ success: false, message: "Book not found" });
      }

      const populatedBook = await populateBook(book?._id);

      await book.deleteOne();
      res.status(201).json({
        success: true,
        message: "book deleted successfully",
        data: populatedBook,
      });
    } catch (error) {
      console.error("cant delete", error);
      res.status(500).json({ message: "server error during delete" });
    }
  },
};

export default BookController;
