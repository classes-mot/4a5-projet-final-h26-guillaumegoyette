import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/auth-context";
import ModalMessageErreur from "../../../UIElements/ModalMessageErreur";

export default function SmallSong({ title, artist, filetype, location }) {
  const { user } = useContext(AuthContext);

  const musicRole = user?.perms?.music;

  const canAddSong = musicRole === "curator" || musicRole === "admin";
  const canModnDelete = musicRole === "admin";
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
        {canModnDelete && <button>Delete</button>}
      </div>
    </>
  );
}
