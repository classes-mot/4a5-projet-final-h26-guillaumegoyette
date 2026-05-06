import React from "react";
import "./LoadingSquare.css";

const Square = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <div className="SquareLoad"></div>
  </div>
);

export default Square;
