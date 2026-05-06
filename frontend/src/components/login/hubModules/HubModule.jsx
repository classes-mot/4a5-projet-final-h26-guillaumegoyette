import { useState, useContext } from "react";
import "./HubModule.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/auth-context";
import ModalMessageErreur from "../../UIElements/ModalMessageErreur";
import Square from "../../UIElements/LoadingSquare";

export default function HubModule(props) {
  const imgLocation = `../../../data/${props.label}`;
  return (
    <div className="module">
      <span>{props.label}</span>
      <img src={imgLocation} className="module-image"></img>
    </div>
  );
}
