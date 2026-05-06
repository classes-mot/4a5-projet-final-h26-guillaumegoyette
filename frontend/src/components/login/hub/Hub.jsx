import { useState, useContext } from "react";
import "./Hub.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/auth-context";
import ModalMessageErreur from "../../UIElements/ModalMessageErreur";
import Square from "../../UIElements/LoadingSquare";
import HubHeader from "../hubHeader/HubHeader";
import HubModule from "../hubModules/HubModule";

export default function Hub() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const userPerms = user.perms;
  const MODULE_CONFIG = {
    music: { label: "Music", path: "/music" },
  };

  return (
    <>
      <HubHeader />
      <div className="hubSquare">
        {Object.keys(MODULE_CONFIG).map((key) => {
          const hasPermission = user.perms && user.perms[key];

          if (hasPermission) {
            return (
              <HubModule
                key={key}
                label={MODULE_CONFIG[key].label}
                path={MODULE_CONFIG[key].path}
              />
            );
          }
          return null;
        })}
      </div>
    </>
  );
}
