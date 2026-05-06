import { useState, useContext } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import ModalMessageErreur from "../UIElements/ModalMessageErreur";
import Squared from "../UIElements/LoadingSquare";
import { useHttpClient } from "../../hooks/http-hook";

export default function Login() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [entredValues, setEntredValues] = useState({
    username: "",
    password: "",
  });

  //Va chercher le last input? renter a ^
  const handleInputChange = (identifier, value) => {
    setEntredValues((prevValue) => ({
      ...prevValue,
      [identifier]: value,
    }));
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await sendRequest(
        "http://localhost:5000/api/users/login",
        "POST",
        JSON.stringify(entredValues),
        {
          "Content-Type": "application/json",
        },
      );
      auth.login(response.userId, response.token);
      navigate("/hub");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div>
        {isLoading && <Squared />}
        <ModalMessageErreur message={error} onClose={() => clearError()} />
      </div>
      <form onSubmit={authSubmitHandler}>
        <h2>Login *TRANSLATE*</h2>

        <div className="input_form">
          <div className="input_line">
            <label htmlFor="username">Username *TRANSLATE*</label>
            <input
              id="username"
              type="username"
              name="username"
              onChange={(event) =>
                handleInputChange("username", event.target.value)
              }
              value={entredValues.username}
            />
          </div>

          <div className="input_line">
            <label htmlFor="password">Password *TRANSLATE*</label>"
            <input
              id="password"
              type="password"
              name="password"
              onChange={(event) =>
                handleInputChange("password", event.target.value)
              }
              value={entredValues.password}
            />
          </div>

          <p className="form-input">
            <button className="button">Login</button>
            <Link to="/register">
              <button className="button button-flat">
                Register *TRANSLATE*
              </button>
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
