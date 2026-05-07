import { useState, useContext } from "react";
import { AuthContext } from "../../context/auth-context";

const ModifySongModal = ({ song, onClose, onUpdate }) => {
  const { token } = useContext(AuthContext);
  const [metadata, setMetadata] = useState({
    title: song.title,
    artist: song.artist,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${BACKEND}/api/music/${song.id}/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(metadata),
        },
      );

      if (response.ok) {
        onUpdate(); // Refresh the list in the parent
        onClose(); // Close modal
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error("Failed to update song", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="form-music">
        <h2>Modifier la chanson</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Titre:</label>
            <input
              type="text"
              value={metadata.title}
              onChange={(e) =>
                setMetadata({ ...metadata, title: e.target.value })
              }
            />
          </div>
          <div>
            <label>Artiste:</label>
            <input
              type="text"
              value={metadata.artist}
              onChange={(e) =>
                setMetadata({ ...metadata, artist: e.target.value })
              }
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Enregistrement..." : "Confirmer"}
          </button>
          <button type="button" onClick={onClose}>
            Annuler
          </button>
        </form>
      </div>
    </>
  );
};

export default ModifySongModal;
