import express from "express";
import {
  getAllFertilizers,
  getFertilizerById,
  createFertilizer,
  updateFertilizer,
  deleteFertilizer
} from "./fertilizerController.js";
import { protect,authorize } from "../../middleware/protect.js";

const router = express.Router();

router.get("/", protect, getAllFertilizers);
router.get("/:id", protect, getFertilizerById);
router.post("/", protect, authorize("admin"), createFertilizer);
router.put("/:id", protect, authorize("admin"), updateFertilizer);
router.delete("/:id", protect, authorize("admin"), deleteFertilizer);

export default router;
