import { useContext, useState } from "react";
import "./Register.css";
import { Link, Navigate } from "react-router-dom";
import ModalMessageErreur from "../../UIElements/ModalMessageErreur";
import Square from "../../UIElements/LoadingSquare";
import { AuthContext } from "../../../context/auth-context";

export default function Register() {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordAreNotEqual, setPasswordAreNotEqual] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());
    if (data.password !== data["confirm-password"]) {
      setPasswordAreNotEqual(true);
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      console.log(responseData);
      if (!response.ok) {
        throw new Error(responseData.message || "Registration Failed");
      }
      setIsLoading(false);
      auth.login(responseData.token, responseData.user);
      navigate("/");
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
    <>
      <div>
        {isLoading && <Squared />}
        <ModalMessageErreur message={error} onClose={() => clearError()} />
      </div>
      <form onSubmit={handleSubmit}>
        <h2>REGISTER *TRANSLATE*</h2>

        <div className="input_form">
          <div className="reg-userPass">
            <div className="input_line">
              <label htmlFor="username">Username *TRANSLATE*</label>
              <input id="username" type="username" name="username" required />
            </div>

            <div className="reg-PasswordControl">
              <div className="input_line">
                <label htmlFor="password">Password *TRANSLATE*</label>"
                <input id="password" type="password" name="password" required />
              </div>
              <div className="input_line">
                <label htmlFor="password">Confirm password *TRANSLATE*</label>"
                <input id="password" type="password" name="password" required />
                {passwordAreNotEqual ? (
                  <div className="reg-PassError">
                    <p>TRANSLATE password must match</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="input_line">
            <label htmlFor="email">email *TRANSLATE*</label>"
            <input id="email" type="email" name="email" required />
          </div>
          <div className="input_line">
            <label htmlFor="fullname">fullname *TRANSLATE*</label>"
            <input id="fullname" type="fullname" name="fullname" required />
          </div>
          <div className="input_line">
            <label htmlFor="code">Access code *TRANSLATE*</label>"
            <input id="code" type="code" name="code" required />
          </div>

          <div className="form-input">
            <button className="button" disabled={isLoading}>
              {isLoading ? "Loading..." : "Confirm**TRANSLATE*"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
