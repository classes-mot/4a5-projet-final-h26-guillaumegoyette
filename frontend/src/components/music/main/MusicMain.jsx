import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/auth-context";
import ModalMessageErreur from "../../UIElements/ModalMessageErreur";
import Square from "../../UIElements/LoadingSquare";

export default function MusicMain() {
  return (
    <>
      <div className="search-barMain">Here is the search bar</div>
      <div className="lastAdded">Here is the last added song</div>
    </>
  );
}
