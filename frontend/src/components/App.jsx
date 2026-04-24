import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useState, useCallback } from "react";
import RootLayout from "../Containers/Roots";
import ErrorPage from "../Containers/ErrorPage";
import { AuthContext } from "../context/auth-context";

const routerLogin = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [{}],
  },
]);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [{}],
  },
]);

const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token) => {
    setToken(token);
    setUserId(uid);
  }, []);
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
  }, []);
  if (token !== null) {
    return (
      <AuthContext.Provider
        value={{
          isLoggedIn: true,
          token: token,
          userId: userId,
          login: login,
          logout: logout,
        }}
      >
        <RouterProvider router={routerLogin} />
      </AuthContext.Provider>
    );
  } else {
    return (
      <AuthContext.Provider
        value={{
          isLoggedIn: false,
          token: token,
          userId: userId,
          login: login,
          logout: logout,
        }}
      >
        <RouterProvider router={router} />
      </AuthContext.Provider>
    );
  }
};

export default App;
