import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODBLINK; // Define inside to ensure env is loaded

  if (isConnected) return;

  if (!uri) {
    console.error("ERREUR : MONGODBLINK n'est pas défini dans le fichier .env");
    return;
  }

  try {
    console.log(
      "Tentative de connexion à :",
      uri.includes("mongodb+srv") ? "MongoDB Atlas" : "Localhost",
    );

    await mongoose.connect(uri);
    isConnected = true;
    console.log("Connexion MongoDB Réussie");
  } catch (err) {
    console.error("Erreur de connexion MongoDB :", err.message);
  }
};
