import express from "express";
import { authenticateToken } from "../middleware/auth";
import RecepieController from "../controllers/RecepieController";
import { checkRecepieOwnership } from "../middleware/ownership";

const router = express.Router();

router.post("/create", authenticateToken, RecepieController.create);
router.get("/", RecepieController.getAll);
router.get("/:recepieId", RecepieController.get);
router.patch(
  "/:recepieId",
  authenticateToken,
  checkRecepieOwnership,
  RecepieController.update
);
router.delete(
  "/:recepieId",
  authenticateToken,
  checkRecepieOwnership,
  RecepieController.delete
);
router.post("/:recepieId/like", authenticateToken, RecepieController.toggleLike);

export default router;
