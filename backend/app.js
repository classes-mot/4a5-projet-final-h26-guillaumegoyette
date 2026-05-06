import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import userRoutes from "./routes/users-routes.js";
import musicRoutes from "./routes/music-routes.js";
import path from "path";

import errorHandler from "./handler/error-handler.js";
import { connectDB } from "./utils/bd.js";

console.log("Connection DB");

//await connectDB();

console.log("CreationApp");
const app = express();
const musicPath = path.resolve(
  process.env.MUSIC_UPLOAD_PATH || "uploads/music",
);

app.use(express.json());

app.use("/uploads/music", express.static(musicPath));

app.use(
  cors({
    origin: "*", // In production, replace with your actual frontend URL
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/users", userRoutes);
console.log("Upload path is:", process.env.MUSIC_UPLOAD_PATH);

app.use("/api/music", musicRoutes);

app.use((req, res, next) => {
  const error = new Error("Route non Trouve");
  error.code = 404;
  next(error);
});

app.use(errorHandler);

app.listen(5000, () => {
  console.log("Serveur Ecoute sur", "http://localhost:5000");
});
