import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

let MOCK_USERS = [
  {
    id: "u1",
    username: "admin",
    email: "admin",
    password: "admin",
    perms: { login: "admin", music: "admin" },
  },
];

const getUsers = (req, res, next) => {
  setTimeout(() => {
    res.json({ users: MOCK_USERS });
  }, 3000);
};

const login = (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password);
  // IMPORANT = Change this thing later
  const identifiedUser = MOCK_USERS.find(
    (u) => u.username === username && u.password === password,
  );
  console.log(identifiedUser);
  if (!identifiedUser) {
    res.status(401).json({
      message: "identification failed, check your username or password",
    });
  } else {
    let token;

    try {
      console.log("Logged in!");
      token = jwt.sign(
        {
          userId: identifiedUser.id,
          username: identifiedUser.username,
          perms: identifiedUser.perms,
        },
        //IMPORTANT: CHANGE THIS LATER
        "cleSuperSecrete!",
        { expiresIn: "1h" },
      );
      console.log(token);
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Signing up failed, please try again later.",
        500,
      );
      return next(error);
    }
    res.status(201).json({
      userId: identifiedUser.id,
      email: identifiedUser.email,
      token: token,
    });
  }
};

export default {
  getUsers,
  login,
};
