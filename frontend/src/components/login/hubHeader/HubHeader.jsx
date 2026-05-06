import { useState, useContext } from "react";
import "./HubHeader.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/auth-context";
import ModalMessageErreur from "../../UIElements/ModalMessageErreur";
import Square from "../../UIElements/LoadingSquare";

export default function HubHeader() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const adminStatus = user.perms.login;

  return <button className="b-logout">Logout</button>;
}
