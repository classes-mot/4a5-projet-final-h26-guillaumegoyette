import "./SearchMusic.css";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/auth-context";
import ModalMessageErreur from "../../UIElements/ModalMessageErreur";

export default function SearchBar({ onSearch }) {
  const [term, setTerm] = useState("");

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSearch(term);
    }
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search for a song..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
