import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/auth-context";
import ModalMessageErreur from "../../UIElements/ModalMessageErreur";

export default function SearchBar() {
  return (
    <div>
      <input type="text" />
    </div>
  );
}
