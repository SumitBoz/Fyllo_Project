import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { globalErrorHandler } from "./src/middleware/globalErrorHandler.js";
import authRoutes from "./src/features/auth/authRoutes.js";
import fertilizerRoutes from "./src/features/fertilizers/fertilizerRoutes.js";
import availabilityRoutes from "./src/features/availability/availabilityRoutes.js";

const app = express();

const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/fertilizers", fertilizerRoutes);
app.use("/api/availability", availabilityRoutes);

app.use(globalErrorHandler);

app.get("/", (req, res) => {
  res.send("api is running...");
});

export default app;
