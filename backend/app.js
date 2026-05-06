import express from "express";
import userRoutes from "./routes/users-routes.js";
//import musicRoutes from "./routes/music-routes.js";

import errorHandler from "./handler/error-handler.js";
import { connectDB } from "./utils/bd.js";

console.log("Connection DB");

await connectDB();

console.log("CreationApp");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*", // In production, replace with your actual frontend URL
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/users", userRoutes);

//app.use("/api/music", musicRoutes);

app.use((req, res, next) => {
  const error = new Error("Route non Trouve");
  error.code = 404;
  next(error);
});

app.use(errorHandler);

app.listen(5000, () => {
  console.log("Serveur Ecoute sur", "http://localhost:5000");
});
