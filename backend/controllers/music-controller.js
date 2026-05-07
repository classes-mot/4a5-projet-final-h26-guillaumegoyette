import { Song } from "../model/music.js";
import HttpError from "../utils/http-error.js";
import fs from "fs";
import path from "path";

let MOCK_MUSIC_LIST = [];

const lastSong = async (req, res, next) => {
  try {
    const foundSong = await Song.findOne().sort({ _id: -1 });
    /*const foundSong = MOCK_MUSIC_LIST[MOCK_MUSIC_LIST.length - 1];
    console.log(foundSong);
    if (!foundSong) {
      return res.status(404).json({ message: "No songs found" });
    }
    */
    res.status(200).json({ song: foundSong });
  } catch {
    res.status(500).json({ message: "Fetching last song failed" });
  }
};

const searchSongs = async (req, res, next) => {
  const query = req.params.query;
  //FOR MOCK
  /*const results = MOCK_MUSIC_LIST.filter((song) => {
    const data = song._doc || song;
    const titleMatch = data.title?.toLowerCase().includes(query.toLowerCase());
    const artistMatch = data.artist
      ?.toLowerCase()
      .includes(query.toLowerCase());
    return titleMatch || artistMatch;
  });*/

  //FOR BD
  let results;
  try {
    results = await Song.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { artist: { $regex: query, $options: "i" } },
      ],
    });
  } catch (err) {
    return next(new HttpError("Searching failed, please try again.", 500));
  }
  res.status(200).json({
    songs: results.map((s) => s._doc || s),
  });
};

const downloadSong = async (req, res) => {
  const songId = req.params.songId;
  const song = MOCK_MUSIC_LIST.find((s) => s._id === songId);
  const filePath = path.join(process.env.MUSIC_UPLOAD_PATH, song.fileLocation);
  res.download(filePath, `${song.title}.${song.fileType}`);
};

const streamSong = async (req, res, next) => {
  const songId = req.params.songId;
  let song;
  console.log("Attemp to play song.");
  // MOCK CHECK
  //song = MOCK_MUSIC_LIST.find((s) => (s._id || s.id).toString() === songId);

  // FOR DB

  if (!song) {
    try {
      song = await Song.findById(songId);
    } catch (err) {
      return next(new HttpError("Could not find song in database.", 500));
    }
  }

  if (!song) {
    return res.status(404).json({ message: "Song not found" });
  }

  const songData = song._doc || song;
  const filePath = path.join(
    process.env.MUSIC_UPLOAD_PATH,
    songData.fileLocation,
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Audio file not found on server" });
  }

  // Set headers and stream
  res.setHeader("Content-Type", songData.fileType || "audio/mpeg");
  res.sendFile(filePath);
};

const sendMusic = async (req, res, next) => {
  if (!req.file) {
    return next(new HttpError("No file provided", 422));
  }

  const { title, artist } = req.body;

  const existingSong = await Song.findOne({ title, artist });

  if (existingSong) {
    // Clean up the uploaded file if it's a duplicate
    fs.unlink(req.file.path, (err) => {
      if (err) console.log(err);
    });
    return next(new HttpError("This song is already in the library.", 422));
  }

  const createdSong = new Song({
    title,
    artist: artist || "Unknown Artist",
    fileLocation: req.file.filename,
    fileType: req.file.mimetype,
  });

  console.log(createdSong);

  try {
    // HERE HERE FOR DATABSE!!:)
    await createdSong.save();
    //MOCK_MUSIC_LIST.push(createdSong);
    res.status(201).json({ song: createdSong });
  } catch (err) {
    console.log(err);
    console.error("DETAILED BACKEND ERROR:", err); // ADD THIS
    return next(new HttpError(err.message || "Saving song failed", 500));
    r;
  }
};

const modifySong = async (req, res, next) => {
  const songId = req.params.songId;
  const { title, artist } = req.body;

  //FOR MOCK
  //const songIndex = MOCK_MUSIC_LIST.findIndex(
  //  (s) => (s._id || s.id).toString() === songId.toString(),
  //);

  /*if (songIndex !== -1) {
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
*/

  try {
    const updatedSong = await Song.findByIdAndUpdate(
      songId,
      { title, artist },
      { new: true, runValidators: true },
    );
    if (!updatedSong) return next(new HttpError("Could not find song.", 404));
    res.status(200).json({ message: "Chanson modifiée" });
  } catch (err) {
    return next(new HttpError("Update failed", 500));
  }
};

const deleteSong = async (req, res, next) => {
  const songId = req.params.songId;
  try {
    //FOR DB
    const song = await Song.findById(songId);
    //FOR MOCK
    /*const songIndex = MOCK_MUSIC_LIST.findIndex(
      (s) => (s._id || s.id).toString() === songId.toString(),
    );
    const song = MOCK_MUSIC_LIST[songIndex];
*/
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
    await song.deleteOne();
    //FOR MOCK
    //MOCK_MUSIC_LIST.splice(songIndex, 1);

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
  streamSong,
  downloadSong,
};
