import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";

const RootLayout = ({ serverString }) => {
  return (
    <div className="app-container">
      <header
        style={{ background: "#eee", padding: "10px", textAlign: "center" }}
      >
        <strong>{serverString}</strong>
      </header>

      <main>
        <Outlet context={{ serverString }} />
      </main>
    </div>
  );
};

export default RootLayout;
