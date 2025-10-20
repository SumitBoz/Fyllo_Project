import Fertilizer from "./fertizerModel.js";
import { asyncErrorHandler } from "../../utils/asyncErrorHandler.js";
import { ApiError } from "../../lib/apiError.js";
import { ApiResponse } from "../../lib/ApiResponse.js";

export const getAllFertilizers = asyncErrorHandler(async (req, res) => {
  const fertilizers = await Fertilizer.find();
  res
    .status(200)
    .json(
      new ApiResponse("Fertilizers fetched successfully", 200, { fertilizers })
    );
});

export const getFertilizerById = asyncErrorHandler(async (req, res) => {
  const fertilizer = await Fertilizer.findById(req.params.id);
  if (!fertilizer) throw new ApiError("Fertilizer not found", 404);
  res
    .status(200)
    .json(
      new ApiResponse("Fertilizer fetched successfully", 200, { fertilizer })
    );
});

export const createFertilizer = asyncErrorHandler(async (req, res) => {
  const { name, type, description } = req.body;
  console.log(req.body);
  if (!name || !type) throw new ApiError("Name and Type are required", 400);

  const exist = await Fertilizer.findOne({ name });
  if (exist) throw new ApiError("Fertilizer already exists", 400);

  const fertilizer = await Fertilizer.create({ name, type, description });
  res
    .status(201)
    .json(
      new ApiResponse("Fertilizer created successfully", 201, { fertilizer })
    );
});

export const updateFertilizer = asyncErrorHandler(async (req, res) => {
  const { name, type, description } = req.body;
  const fertilizer = await Fertilizer.findById(req.params.id);
  if (!fertilizer) throw new ApiError("Fertilizer not found", 404);

  fertilizer.name = name || fertilizer.name;
  fertilizer.type = type || fertilizer.type;
  fertilizer.description = description || fertilizer.description;

  await fertilizer.save();
  res
    .status(200)
    .json(
      new ApiResponse("Fertilizer updated successfully", 200, { fertilizer })
    );
});

// Using findByIdAndDelete
export const deleteFertilizer = asyncErrorHandler(async (req, res) => {
  const fertilizer = await Fertilizer.findByIdAndDelete(req.params.id);
  if (!fertilizer) throw new ApiError("Fertilizer not found", 404);

  res.status(200).json(new ApiResponse("Fertilizer deleted successfully", 200));
});
