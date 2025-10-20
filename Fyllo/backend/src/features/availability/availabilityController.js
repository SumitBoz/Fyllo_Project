import Availability from "./avilabiltySchema.js";
import { asyncErrorHandler } from "../../utils/asyncErrorHandler.js";
import { ApiError } from "../../lib/apiError.js";
import mongoose from "mongoose";

export const createAvailability = asyncErrorHandler(async (req, res) => {
  const { fertilizer, state, year, month, availableQty, requiredQty } =
    req.body;
  if (!fertilizer || !state || !year || !month)
    throw new ApiError("Missing required fields", 400);

  const exist = await Availability.findOne({ fertilizer, state, year, month });
  if (exist)
    throw new ApiError(
      "Availability already exists for this month/state/fertilizer",
      400
    );

  const availability = await Availability.create({
    fertilizer,
    state,
    year,
    month,
    availableQty,
    requiredQty,
  });
  res.status(201).json(
    new ApiResponse("Availability created successfully", 201, {
      availability,
    })
  );
});

export const updateAvailability = asyncErrorHandler(async (req, res) => {
  const availability = await Availability.findById(req.params.id);
  if (!availability) throw new ApiError("Availability not found", 404);

  Object.assign(availability, req.body);
  await availability.save();
  res.status(200).json(
    new ApiResponse("Availability updated successfully", 200, {
      availability,
    })
  );
});

export const deleteAvailability = asyncErrorHandler(async (req, res) => {
  const availability = await Availability.findById(req.params.id);
  if (!availability) throw new ApiError("Availability not found", 404);

  await availability.deleteOne();
  res
    .status(200)
    .json(new ApiResponse("Availability deleted successfully", 200));
});

export const getAllAvailability = asyncErrorHandler(async (req, res) => {
  const availability = await Availability.find().populate("fertilizer");
  res.status(200).json(
    new ApiResponse("Availability fetched successfully", 200, {
      availability,
    })
  );
});

export const getTopRequiredFertilizers = asyncErrorHandler(async (req, res) => {
  const top = await Availability.aggregate([
    { $group: { _id: "$fertilizer", totalRequired: { $sum: "$requiredQty" } } },
    { $sort: { totalRequired: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "fertilizers",
        localField: "_id",
        foreignField: "_id",
        as: "fertilizer",
      },
    },
    { $unwind: "$fertilizer" },
    { $project: { name: "$fertilizer.name", totalRequired: 1 } },
  ]);
  res
    .status(200)
    .json(new ApiResponse("Top 5 most required fertilizers", 200, { top }));
});

export const getLeastAvailableFertilizers = asyncErrorHandler(
  async (req, res) => {
    console.log("Reached controller");
    const top = await Availability.aggregate([
      {
        $group: {
          _id: "$fertilizer",
          totalAvailable: { $sum: "$availableQty" },
        },
      },
      { $sort: { totalAvailable: 1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "fertilizers",
          localField: "_id",
          foreignField: "_id",
          as: "fertilizer",
        },
      },
      { $unwind: "$fertilizer" },
      { $project: { name: "$fertilizer.name", totalAvailable: 1 } },
    ]);
    res
      .status(200)
      .json(new ApiResponse("Top 5 least available fertilizers", 200, { top }));
  }
);

export const getFertilizerTrend = asyncErrorHandler(async (req, res) => {
  const { fertilizerId } = req.params;
  const { year } = req.query;

  if (!mongoose.Types.ObjectId.isValid(fertilizerId))
    throw new ApiError("Invalid fertilizer ID", 400);
  const filterYear = year ? parseInt(year) : new Date().getFullYear();

  const trend = await Availability.aggregate([
    {
      $match: {
        fertilizer: mongoose.Types.ObjectId(fertilizerId),
        year: filterYear,
      },
    },
    {
      $group: {
        _id: "$month",
        totalAvailable: { $sum: "$availableQty" },
        totalRequired: { $sum: "$requiredQty" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse("Fertilizer trend fetched successfully", 200, { trend })
    );
});
