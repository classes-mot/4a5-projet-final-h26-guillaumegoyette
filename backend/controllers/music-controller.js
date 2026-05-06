import { Song } from "../model/music.js";
import HttpError from "../utils/http-error.js";

let MOCK_MUSIC_LIST = [];

const lastSong = async (req, res, next) => {
  try {
    //const foundSong = await Song.findOne().sort({ _id: -1 });
    const foundSong = MOCK_MUSIC_LIST[MOCK_MUSIC_LIST.length - 1];
    console.log(foundSong);
    if (!foundSong) {
      return res.status(404).json({ message: "No songs found" });
    }

    res.status(200).json({ song: foundSong });
  } catch {
    res.status(500).json({ message: "Fetching last song failed" });
  }
};

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
    artist: artist || "Unknown Artist",
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
  lastSong,
};
