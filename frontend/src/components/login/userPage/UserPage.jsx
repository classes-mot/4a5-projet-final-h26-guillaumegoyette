import { useContext, useState } from "react";
import "./UserPage.css";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import ModalMessageErreur from "../../UIElements/ModalMessageErreur";
import { AuthContext } from "../../../context/auth-context";

export default function UserPage() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { user, logout, isLoggedIn, token } = useContext(AuthContext);
  const { userId } = useParams();
  const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!user) {
    return (
      <div className="error-msg">Loading user data or session expired...</div>
    );
  }
  if (userId !== user.id) {
    return <div>You are not authorized to view this profile.</div>;
  }

  const MODULE_CONFIG = {
    admin: { label: "Admin Panel", path: null },
    music: { label: "Music Module", path: "/module/music" },
  };

  async function handleSubmit(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());

    try {
      setIsLoading(true);
      const response = await fetch(
        `${BACKEND}/api/users/${userId}/permsChange`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",

            Authorization: "Bearer " + auth.token,
          },
          body: JSON.stringify(data),
        },
      );
      const responseData = await response.json();
      console.log(responseData);
      if (!response.ok) {
        throw new Error(responseData.message || "Code Changed Failed");
      }
      setIsLoading(false);
      auth.login(responseData.token, responseData);
      navigate("/hub");
    } catch (err) {
      setError(
        err.message || "There's been an error, try again later. TRANSLATE",
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }

    event.target.reset();
  }

  return (
    <div className="profile-container">
      <div>
        <h2> Profile of {user.username}</h2>
        <h2> Your permissions</h2>
        <dl>
          {Object.keys(MODULE_CONFIG).map((key) => {
            const permissionValue = user.perms && user.perms[key];
            const hasPermission =
              permissionValue !== null && permissionValue !== undefined;

            return (
              <div key={key} className="perm-row">
                <dt>{MODULE_CONFIG[key].label}</dt>

                <dd>
                  {hasPermission ? (
                    <span className="access-granted">{user.perms[key]}</span>
                  ) : (
                    <span className="access-denied">No access</span>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>

      <div>
        <form onSubmit={handleSubmit}>
          <h2>NEW CODE *TRANSLATE*</h2>

          <div className="input_form">
            <div className="input_line">
              <label htmlFor="newCode">New Code Here *TRANSLATE*</label>
              <input id="newCode" type="newCode" name="newCode" required />
            </div>
          </div>
          <div className="form-input">
            <button className="button" disabled={isLoading}>
              {isLoading ? "Loading..." : "Confirm**TRANSLATE*"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
