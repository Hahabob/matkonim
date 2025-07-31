import express from "express";
import { authenticateToken } from "../middleware/auth";
import BookController from "../controllers/BookController";
import { checkBookOwnership } from "../middleware/ownership";

const router = express.Router();

router.post("/create", authenticateToken, BookController.create);
router.get("/:bookId", BookController.get);
router.patch(
  "/:bookId",
  authenticateToken,
  checkBookOwnership,
  BookController.update
);
router.delete(
  "/:bookId",
  authenticateToken,
  checkBookOwnership,
  BookController.delete
);

export default router;
