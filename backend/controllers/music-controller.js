import { Song } from "../model/music.js";
import HttpError from "../utils/http-error.js";
import fs from "fs";
import path from "path";

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

const searchSongs = async (req, res, next) => {
  const query = req.params.query;
  //FOR MOCK
  const results = MOCK_MUSIC_LIST.filter((song) => {
    const data = song._doc || song;
    const titleMatch = data.title?.toLowerCase().includes(query.toLowerCase());
    const artistMatch = data.artist
      ?.toLowerCase()
      .includes(query.toLowerCase());
    return titleMatch || artistMatch;
  });

  //FOR BD
  /*let results;
  try {
    results = await Song.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { artist: { $regex: query, $options: "i" } },
      ],
    });
  } catch (err) {
    return next(new HttpError("Searching failed, please try again.", 500));
  } */
  res.status(200).json({
    songs: results.map((s) => s._doc || s),
  });
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

const modifySong = async (req, res, next) => {
  const songId = req.params.songId;
  const { title, artist } = req.body;

  //FOR MOCK
  const songIndex = MOCK_MUSIC_LIST.findIndex(
    (s) => (s._id || s.id).toString() === songId.toString(),
  );

  if (songIndex !== -1) {
    // If it's a Mongoose object from 'new Song()', the data is in _doc
    const currentSongData =
      MOCK_MUSIC_LIST[songIndex]._doc || MOCK_MUSIC_LIST[songIndex];

    MOCK_MUSIC_LIST[songIndex] = {
      ...currentSongData,
      title: title || currentSongData.title,
      artist: artist || currentSongData.artist,
    };
    // Return early so the response is sent immediately
    return res.status(200).json({
      message: "Chanson modifiée (MOCK)",
      song: MOCK_MUSIC_LIST[songIndex],
    });
  }

  /*
  try {
    const updatedSong = await Song.findByIdAndUpdate(
      songId,
      { title, artist },
      { new: true, runValidators: true }
    );
    if (!updatedSong) return next(new HttpError("Could not find song.", 404));
    res.status(200).json({ message: "Chanson modifiée" });
  } catch (err) {
    return next(new HttpError("Update failed", 500));
  }
  */
};

const deleteSong = async (req, res, next) => {
  const songId = req.params.songId;
  try {
    //FOR DB
    //const song = await Song.findById(songId);
    //FOR MOCK
    const songIndex = MOCK_MUSIC_LIST.findIndex(
      (s) => (s._id || s.id).toString() === songId.toString(),
    );
    const song = MOCK_MUSIC_LIST[songIndex];

    if (!song) {
      return next(new HttpError("Could not find song for this id.", 404));
    }
    const filePath = path.join(
      process.env.MUSIC_UPLOAD_PATH,
      song.fileLocation,
    );

    fs.unlink(filePath, (err) => {
      if (err) console.log("failed to delete file:", err);
    });
    //FOR DB
    //await song.remove();
    //FOR MOCK
    MOCK_MUSIC_LIST.splice(songIndex, 1);

    res.status(200).json({ message: "Deleted Song" });
  } catch (err) {
    return next(new HttpError("Could not delete song"), 500);
  }
};

export default {
  sendMusic,
  lastSong,
  deleteSong,
  modifySong,
  searchSongs,
};
