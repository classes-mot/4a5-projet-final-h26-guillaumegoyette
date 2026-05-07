import React, { useState, useContext } from "react";
import * as mm from "music-metadata";
import { AuthContext } from "../../context/auth-context";
const AddSongPrompt = ({ onClose, onSongAdded }) => {
  const { user, token } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [metadata, setMetadata] = useState({ title: "", artist: "" });
  const [isLoading, setIsLoading] = useState(false);
  const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    try {
      const parsedMetadata = await mm.parseBlob(file);
      console.log("Metadata extracted", parsedMetadata);

      setMetadata({
        title: parsedMetadata.common.title || file.name,
        artist: parsedMetadata.common.artist || "Unknown Artist",
      });
    } catch (err) {
      console.error("Error reading metadata", err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("audio", selectedFile);
    formData.append("title", metadata.title);
    formData.append("artist", metadata.artist);

    try {
      setIsLoading(true);
      const response = await fetch(`${BACKEND}/api/music/send`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });
      if (response.ok) {
        onSongAdded();
      }
      if (!response.ok) throw new Error("Upload failed");
      onClose();
    } catch (err) {
      console.error(err, "Failed to send file");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "20%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        backgroundColor: "white",
        padding: "20px",
        zIndex: 1000,
      }}
    >
      <h2>Add your song here! *Translate*</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          required
        />
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={metadata.title}
            onChange={(e) =>
              setMetadata({ ...metadata, title: e.target.value })
            }
          />
        </div>
        <button type="submit" disabled={isLoading || !selectedFile}>
          {isLoading ? "Uploading..." : "Confirm"}
        </button>

        <button type="button" onClick={onClose}>
          Fermer/Give up **TRANSLATE**
        </button>
      </form>
    </div>
  );
};

export default AddSongPrompt;
