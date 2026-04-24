import { useState, useCallback } from "react";

import { Outlet } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

export default function RootLayout() {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
}
