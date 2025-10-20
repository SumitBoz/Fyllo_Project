import mongoose from "mongoose";

const fertilizerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, 
  type: { type: String, required: true },              
  description: { type: String },
}, { timestamps: true });

export default mongoose.model("Fertilizer", fertilizerSchema);
