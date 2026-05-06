import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const MIME_TYPE_MAP = {
  "audio/mpeg": "mp3",
  "audio/flac": "flac",
  "audio/wav": "wav",
  "audio/ogg": "ogg",
};

const fileUpload = (req, res, next) => {
  multer({
    limits: 5000000, //hardlimit
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "~/music/");
      },
      filename: (req, file, cb) => {
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, uuidv4() + "." + ext);
      },
    }),
  });
};

export default fileUpload;
