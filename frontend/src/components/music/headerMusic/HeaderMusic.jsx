import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/auth-context";
import ModalMessageErreur from "../../UIElements/ModalMessageErreur";

export default function HeaderMusic() {
  const { user } = useContext(AuthContext);
  const musicRole = user?.perms?.music;
  const canAddSong = musicRole === "curator" || musicRole === "admin";
  return <>{canAddSong && <div onClick={() => addsong()}>addsong</div>}</>;
}
