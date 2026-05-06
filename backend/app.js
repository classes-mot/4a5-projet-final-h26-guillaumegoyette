import express from "express";
import userRoutes from "./routes/users-routes.js";
import musicRoutes from "./routes/music-routes.js";

import errorHandler from "./handler/error-handler.js";
import { connectDB } from "./utils/bd.js";

await connectDB();

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-AllowHeaders",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  next();
});

app.use("/api/users", userRoutes);

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
