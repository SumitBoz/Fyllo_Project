import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    fertilizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fertilizer",
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    year: { type: Number, required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    availableQty: { type: Number, required: true, default: 0 },
    requiredQty: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

availabilitySchema.index(
  { fertilizer: 1, state: 1, year: 1, month: 1 },
  { unique: true }
);

export default mongoose.model("Availability", availabilitySchema);
