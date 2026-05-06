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

songSchema.index({ title: 1, artist: 1 }, { unique: true });

export const Song = mongoose.model("Song", songSchema);
