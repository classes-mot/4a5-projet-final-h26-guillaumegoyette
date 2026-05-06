import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/auth-context";
import ModalMessageErreur from "../../../UIElements/ModalMessageErreur";

export default function SmallSong({
  title,
  artist,
  filetype,
  location,
  id,
  onUpdate,
}) {
  const { user, token } = useContext(AuthContext);

  const musicRole = user?.perms?.music;

  const canAddSong = musicRole === "curator" || musicRole === "admin";
  const canModnDelete = musicRole === "admin";

  const deleteSong = async () => {
    if (!token) {
      console.error("No token found");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/music/${id}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );
      const message = await response.json();
      if (response.ok) {
        console.log("The song has been deleted successfully.");
        onUpdate();
      }
    } catch (err) {
      console.error("Failed to delete song", err);
    }
  };

  return (
    <>
      <div className="small-song-card">
        <dl>
          <dt>title:</dt>
          <dd>{title}</dd>
          <dt>artist:</dt>
          <dd>{artist}</dd>
          <dt>filetype</dt>
          <dd>{filetype}</dd>
          <dt>location</dt>
          <dd>{location}</dd>
        </dl>
      </div>
      <div className="small-song-buttons">
        {canModnDelete && <button>Modify</button>}
        {canModnDelete && (
          <button
            onClick={() => {
              deleteSong();
            }}
          >
            Delete
          </button>
        )}
      </div>
    </>
  );
}
