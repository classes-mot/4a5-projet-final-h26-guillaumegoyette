import jwt from "jsonwebtoken";
import HttpError from "../utils/http-error.js";

const checkAuth = (req, res, next) => {
  try {
    if (req.method === "OPTIONS") {
      return next();
    }
    let token;

    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      console.log("No token found in headers or query");
      throw new Error("Authentication failed");
    }

    const decodedToken = jwt.verify(token, "cleSuperSecrete!");
    console.log("---avant---");
    console.log(req.userData);
    req.userData = { userId: decodedToken.id || decodedToken.userId };
    console.log("---apres---");
    console.log(req.userData);
    next();
  } catch (err) {
    const error = new HttpError("Authentification failed", 401);
    return next(error);
  }
};

export default checkAuth;
