import jwt from "jsonwebtoken";
import HttpError from "../utils/http-error.js";

const checkAuth = (req, res, next) => {
  try {
    if (req.method === "OPTIONS") {
      return next();
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authentification failed");
    }
    const decodedToken = jwt.verify(token, "cleSuperSecrete!");
    console.log("---avant---");
    console.log(req.userData);
    req.userData = { userId: decodedToken.id };
    console.log("---apres---");
    console.log(req.userData);
    next();
  } catch (err) {
    const error = new HttpError("Authentification failed", 401);
    return next(error);
  }
};

export default checkAuth;
