import { useState, useContext } from "react";
import "./HubModule.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/auth-context";
import ModalMessageErreur from "../../UIElements/ModalMessageErreur";

export default function HubModule(props) {
  const imgLocation = `../../../data/${props.label}`;
  const navigate = useNavigate();
  function buttonNavigate() {
    navigate(props.path);
  }

  return (
    <div className="module" onClick={() => buttonNavigate()}>
      <span>{props.label}</span>
      <img src={imgLocation} className="module-image"></img>
    </div>
  );
}
