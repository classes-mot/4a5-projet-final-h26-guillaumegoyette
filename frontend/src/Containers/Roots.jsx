import { useState, useCallback, useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import "./Root.css";

const RootLayout = ({ serverString }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isLoggedIn } = useContext(AuthContext);

  const isHubPage = location.pathname === "/hub";
  const isModule =
    location.pathname !== "/" &&
    location.pathname !== "/hub" &&
    location.pathname !== "/register";
  const isUserPage = location.pathname.startsWith("/users/");
  const isRegister = location.pathname === "/register";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-container">
      <header>
        {isRegister && (
          <button onClick={() => navigate("/")}>
            {" "}
            back to login TRANSLATE{" "}
          </button>
        )}
        {isLoggedIn &&
          !isHubPage &&
          ((
            <button onClick={() => navigate("/hub")}> Back TRANSLATE </button>
          ) || (
            <button onClick={() => navigate("/")}> logout TRANSLATE </button>
          ))}
        {isLoggedIn && (
          <button onClick={handleLogout}> Logout TRANSLATE </button>
        )}
        <strong>{serverString}</strong>
        {isLoggedIn && isModule && !isUserPage && (
          //<button onClick={() => navigate(`/users/${user?.id}/${location}`)}>

          <span> user: {user.username} </span>
          //</button>
        )}

        {isLoggedIn && isHubPage && (
          <button onClick={() => navigate(`/users/${user.id}`)}>
            {user.username}
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
