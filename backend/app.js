import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import userRoutes from "./routes/users-routes.js";
import musicRoutes from "./routes/music-routes.js";
import path from "path";

import errorHandler from "./handler/error-handler.js";
import { connectDB } from "./utils/bd.js";

const port = process.env.LISTENPORT || 5000;
console.log("Connection DB");

await connectDB();

console.log("CreationApp");
const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"], // Added OPTIONS
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

const musicPath = path.resolve(
  process.env.MUSIC_UPLOAD_PATH || "uploads/music",
);

app.use(express.json());

app.use("/uploads/music", express.static(musicPath));

app.use("/api/users", userRoutes);
console.log("Upload path is:", process.env.MUSIC_UPLOAD_PATH);

app.use("/api/music", musicRoutes);

app.use((req, res, next) => {
  const error = new Error("Route non Trouve");
  error.code = 404;
  next(error);
});

app.use(errorHandler);

app.listen(port, () => {
  console.log("Serveur Ecoute sur", port);
});
