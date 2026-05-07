import React from "react";
import "./ModalMessageErreur.css";

const ModalMessageErreur = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-container">
        <h2>Error *TRANSLATE*</h2>
        <p>{message}</p>
        <button className="button" onClick={onClose}>
          Close *TRANSLATE*
        </button>
      </div>
    </>
  );
};

export default ModalMessageErreur;
