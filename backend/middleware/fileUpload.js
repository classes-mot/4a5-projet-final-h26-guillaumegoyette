import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const MIME_TYPE_MAP = {
  "audio/mpeg": "mp3",
  "audio/flac": "flac",
  "audio/wav": "wav",
  "audio/ogg": "ogg",
};

const fileUpload = multer({
  limits: { fileSize: 100 * 1024 * 1024 }, //hardlimit
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const path = process.env.MUSIC_UPLOAD_PATH || "uploads/music";
      cb(null, path);
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, `${uuidv4()}.${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

export default fileUpload;
