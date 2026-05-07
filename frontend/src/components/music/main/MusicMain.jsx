import "./MusicMain.css";
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/auth-context";
import HeaderMusic from "../headerMusic/HeaderMusic";
import SearchBar from "../searchMusic/SearchMusic";
import SmallSong from "../small/song/SmallSong";

export default function MusicMain() {
  const [lastestSong, setLatestSong] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const auth = useContext(AuthContext);

  const fetchLastest = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/music/lastSong", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + auth.token,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setLatestSong(data.song);
        console.log(data.song);
      } else {
        setLatestSong(null);
      }
    } catch (err) {
      console.error("Failed to fetch lastest song", err);
    }
  };

  const handleSearch = async (query) => {
    if (!query || !query.trim()) {
      setSearchResults([]);
      setSearchQuery("");
      return;
    }

    setSearchQuery(query);

    try {
      const response = await fetch(
        `http://localhost:5000/api/music/songs/${query}`,
        {
          method: "GET",
          headers: { authorization: "Bearer " + auth.token },
        },
      );
      const data = await response.json();
      if (response.ok) {
        setSearchResults(data.songs || []);
      }
    } catch (err) {
      console.err("Search Failed", err);
    }
  };

  useEffect(() => {
    if (auth.token) fetchLastest();
  }, [auth.token]);
  return (
    <>
      <HeaderMusic onSongAdded={fetchLastest} />
      <div className="search-barMain">
        <SearchBar onSearch={handleSearch} />
      </div>

      {searchResults.length > 0 && (
        <div className="searchResults">
          <h2>Search Results</h2>
          <div className="songs-grid">
            {searchResults.slice(0, 8).map((song) => (
              <SmallSong
                key={song._id || song.id}
                id={song._id || song.id}
                title={song.title}
                artist={song.artist}
                filetype={song.fileType}
                location={song.fileLocation}
                onUpdate={() => {
                  fetchLastest();
                  handleSearch(searchQuery); // Now searchQuery is defined!
                }}
              />
            ))}
          </div>
        </div>
      )}
      <div className="lastAdded">
        <h2>Here is the last added song</h2>
        {lastestSong ? (
          <SmallSong
            title={lastestSong.title}
            artist={lastestSong.artist}
            filetype={lastestSong.fileType}
            location={lastestSong.fileLocation}
            id={lastestSong._id}
            onUpdate={fetchLastest}
          />
        ) : (
          <p>loading lastest song...</p>
        )}
      </div>
    </>
  );
}
