import mongoose from "mongoose";
import { randomUUID } from "crypto";

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.UUID,
    default: () => randomUUID(), //supposer de generer un UUID
  },
  username: { type: String, required: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  //access( Ce qui donne access a tout les modules. Rajout de certain premade modules pour future proofing)
  perms: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    defaults: {
      music: null,
      video: null,
      homeAssist: null,
      tokenGen: null,
      storage: null,
      AI: null,
      admin: null,
    },
    required: true,
  },
  music: {
    lastPlayed: Date,
  },
});

export const User = mongoose.model("User", userSchema);
