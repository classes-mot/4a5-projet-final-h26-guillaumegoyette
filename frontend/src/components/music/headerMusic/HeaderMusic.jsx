import "./HeaderMusic.css";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/auth-context";
import ModalMessageErreur from "../../UIElements/ModalMessageErreur";
import AddSongPrompt from "../../UIElements/addSongPrompt";

export default function HeaderMusic({ onSongAdded }) {
  const { user } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const musicRole = user?.perms?.music;

  const canAddSong = musicRole === "curator" || musicRole === "admin";

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="music-header-bar">
      {canAddSong && (
        <div
          className="add-song-trigger"
          onClick={openModal}
          style={{ cursor: "pointer" }}
        >
          <span className="add-icon">+</span>
          Add song
        </div>
      )}
      <nav className="music-header-nav">
        {/* <Link to="/module/music/library">Library</Link> */}
      </nav>
      {isModalOpen && (
        <AddSongPrompt onClose={closeModal} onSongAdded={onSongAdded} />
      )}
    </div>
  );
}
