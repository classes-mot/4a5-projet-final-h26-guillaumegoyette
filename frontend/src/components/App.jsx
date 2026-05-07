import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useState, useCallback } from "react";
import RootLayout from "../Containers/Roots";
import ErrorPage from "../Containers/ErrorPage";
import { AuthContext } from "../context/auth-context";

//Login
import Login from "./login/loginMain/Login";
import Hub from "./login/hub/Hub";
import Register from "./login/register/Register";
import UserPage from "./login/userPage/UserPage";

//Music
import MusicMain from "./music/main/MusicMain";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const SERVER_NAME = import.meta.env.VITE_SERVER_NAME || "Default server";
const SERVER_STRING = `MMDSA: ${SERVER_NAME}`;

const routerLogin = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout serverString={SERVER_STRING} />, // Wrapper
    errorElement: <ErrorPage />,
    children: [
      { path: "hub", element: <Hub /> },
      { path: "module/music", element: <MusicMain /> },
      { path: `users/:userId`, element: <UserPage /> },
      { path: "/", element: <Navigate to="/hub" replace /> },
    ],
  },
]);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout serverString={SERVER_STRING} />, // Wrapper
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const login = useCallback((token, userData) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);
  if (token !== null) {
    return (
      <AuthContext.Provider
        value={{
          isLoggedIn: true,
          token: token,
          user: user,
          login: login,
          logout: logout,
        }}
      >
        <RouterProvider router={routerLogin} key="logged-in" />
      </AuthContext.Provider>
    );
  } else {
    return (
      <AuthContext.Provider
        value={{
          isLoggedIn: false,
          token: token,
          user: user,
          login: login,
          logout: logout,
        }}
      >
        <RouterProvider router={router} key="logged-out" />
      </AuthContext.Provider>
    );
  }
};

export default App;
