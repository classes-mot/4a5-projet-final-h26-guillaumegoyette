import { Song } from "../model/music.js";
import HttpError from "../utils/http-error.js";

let MOCK_MUSIC_LIST = [];
const sendMusic = async (req, res, next) => {
  if (!req.file) {
    return next(new HttpError("No file provided", 422));
  }

  const { title, artist } = req.body;

  /*try {
    const existingSong = await Song.findOne({ title, artist });
    
    if (existingSong) {
      // Delete the file Multer just uploaded since we don't need it
      fs.unlink(req.file.path, (err) => { if (err) console.log(err); });
      return next(new HttpError("This song is already in the library.", 422));
    }
  */
  const createdSong = new Song({
    title,
    arist: artist || "Unknown Artist",
    fileLocation: req.file.filename,
    fileType: req.file.mimetype,
  });

  console.log(createdSong);

  try {
    // HERE HERE FOR DATABSE!!:)
    //await createdSong.save();
    MOCK_MUSIC_LIST.push(createdSong);
    res.status(201).json({ song: createdSong });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Saving song failed, try again.", 500));
  }
};

export default {
  sendMusic,
};
