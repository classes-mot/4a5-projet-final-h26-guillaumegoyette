import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/auth-context";
import HeaderMusic from "../headerMusic/HeaderMusic";
import SearchBar from "../searchMusic/SearchMusic";

export default function MusicMain() {
  return (
    <>
      <HeaderMusic />
      <div className="search-barMain">
        Here is the search bar <SearchBar />
      </div>
      <div className="lastAdded">Here is the last added song</div>
    </>
  );
}
