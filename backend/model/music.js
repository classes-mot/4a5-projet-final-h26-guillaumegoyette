import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: String,
  album: String,
  fileType: String,
  genre: { type: Map },
  quality: String,
  fileLocation: String,
  containImg: Boolean,
  imgLocation: String,
});

export const Song = mongoose.model("Song", songSchema);
