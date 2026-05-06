import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useState, useCallback } from "react";
import RootLayout from "../Containers/Roots";
import ErrorPage from "../Containers/ErrorPage";
import { AuthContext } from "../context/auth-context";
import Login from "./login/loginMain/Login";
import Hub from "./login/hub/Hub";
import Register from "./login/register/Register";
import UserPage from "./login/userPage/UserPage";

const SERVER_NAME = import.meta.env.VITE_SERVER_NAME || "Default server";
const SERVER_STRING = `MMDSA: ${SERVER_NAME}`;

const routerLogin = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout serverString={SERVER_STRING} />, // Wrapper
    errorElement: <ErrorPage />,
    children: [
      { path: "hub", element: <Hub /> },
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
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const login = useCallback((token, userData) => {
    setToken(token);
    setUser(userData);
  }, []);
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
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
