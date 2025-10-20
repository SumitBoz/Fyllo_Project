import express from "express";
import {
  createAvailability,
  updateAvailability,
  deleteAvailability,
  getAllAvailability,
  getTopRequiredFertilizers,
  getLeastAvailableFertilizers,
  getFertilizerTrend,
} from "./availabilityController.js";
import { protect, authorize } from "../../middleware/protect.js";

const router = express.Router();

router.get("/", protect, getAllAvailability);
router.post("/", protect, authorize("admin"), createAvailability);
router.put("/:id", protect, authorize("admin"), updateAvailability);
router.delete("/:id", protect, authorize("admin"), deleteAvailability);

router.get("/top-required", getTopRequiredFertilizers);
router.get("/least-available", getLeastAvailableFertilizers);
router.get("/trend/:fertilizerId", getFertilizerTrend);

export default router;
