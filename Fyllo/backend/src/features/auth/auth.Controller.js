import User from "../users/authModel.js";
import { asyncErrorHandler } from "../../utils/asyncErrorHandler.js";
import { ApiError } from "../../lib/apiError.js";
import { ApiResponse } from "../../lib/ApiResponse.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
};

const generateAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

export const registerUser = asyncErrorHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password)
    throw new ApiError("All fields are required", 400);

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError("User already exists", 400);

  const user = await User.create({ name, email, password, role });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json(
    new ApiResponse("User registered successfully", 201, {
      user: { id: user._id, name, email, role },
    })
  );
});

export const loginUser = asyncErrorHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new ApiError("Email and password are required", 400);

  const user = await User.findOne({ email });
  if (!user) throw new ApiError("Invalid email or password", 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError("Invalid email or password", 401);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json(
    new ApiResponse("Login successful", 200, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  );
});

export const logoutUser = asyncErrorHandler(async (req, res) => {
  const user = await User.findById(req.user?.id);
  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  res.status(200).json(new ApiResponse("Logged out successfully", 200));
});

export const refreshToken = asyncErrorHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw new ApiError("Refresh token missing", 401);

  const user = await User.findOne({ refreshToken });
  if (!user) throw new ApiError("Invalid refresh token", 401);

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err) => {
    if (err) throw new ApiError("Refresh token expired", 401);
  });

  const accessToken = generateAccessToken(user);
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.status(200).json(
    new ApiResponse("Access token refreshed", 200, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  );
});
