import { useState, useCallback, useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

const RootLayout = ({ serverString }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isLoggedIn } = useContext(AuthContext);

  const isHubPage = location.pathname === "/hub";
  const isModule =
    location.pathname !== "/" &&
    location.pathname !== "/hub" &&
    location.pathname !== "/register";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-container">
      <header>
        {isLoggedIn &&
          isModule &&
          ((
            <button onClick={() => navigate("/hub")}> Back TRANSLATE </button>
          ) || (
            <button onClick={() => navigate("/")}> logout TRANSLATE </button>
          ))}
        {isLoggedIn && (
          <button onClick={handleLogout}> Logout TRANSLATE </button>
        )}
        <strong>{serverString}</strong>
        {isLoggedIn && isModule && (
          <button onClick={() => navigate(`/user/${user?.id}/${location}`)}>
            {" "}
            {user.username}{" "}
          </button>
        )}
        {isLoggedIn && isHubPage && (
          <button onClick={() => navigate(`/user/${user?.id}`)}>
            {" "}
            {user?.username}{" "}
          </button>
        )}
      </header>

      <main>
        <Outlet context={{ serverString }} />
      </main>
    </div>
  );
};

export default RootLayout;
