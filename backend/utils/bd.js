import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;
  let uri = "mongodb://localhost:27017/testMango";
  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log("Connextion MongoDb Reussie");
  } catch (err) {
    console.error("Erreur de connection MongoDb :", err.messsage);
    process.exit(1);
  }
};
