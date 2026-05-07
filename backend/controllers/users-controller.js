import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { User } from "../model/user.js";
import HttpError from "../utils/http-error.js";

/*
let MOCK_USERS = [
  {
    id: "u1",
    username: "a",
    email: "a",
    password: "a",
    perms: { admin: "admin", music: "admin" },
  },
];

const MOCK_CODES = [
  {
    code: "b",
    perms: { music: "enjoyer", admin: "null" },
  },
  {
    code: "a",
    perms: { music: "admin", admin: "admin" },
  },
  {
    code: "c",
    perms: { music: "curator", admin: "null" },
  },
];
*/
const JWT_SECRET = process.env.JWT_SECRET || "cleSuperSecrete";

const getUsers = async (req, res, next) => {
  try {
    const user = await User.find({}, "-password");
    res.json({ users });
  } catch (err) {
    return next(new HttpError("Fetching users failed", 500));
  }
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  let identifiedUser;
  try {
    identifiedUser = await User.findOne({ username: username });
  } catch (err) {
    return next(new HttpError("Logging in failed, please try again.", 500));
  }
  // add crypt here later on()
  if (!identifiedUser || identifiedUser.password !== password) {
    return res.status(401).json({
      message: "Identification failed, check your username or password",
    });
  }

  try {
    const token = jwt.sign(
      {
        id: identifiedUser._id,
        username: identifiedUser.username,
        perms: identifiedUser.perms,
      },
      JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.status(200).json({
      id: identifiedUser._id,
      usernname: identifiedUseer.username,
      perms: identifiedUser.perms,
      token: token,
    });
  } catch (err) {
    return next(new HttpError("Token generation failed.", 500));
  }
};

const register = (req, res, next) => {
  console.log("registering");
  const { username, password, email, fullname, code } = req.body;

  //IMPORATNT= CHANGE LATER
  const codeData = MOCK_CODES.find((c) => c.code === code);
  let perms = codeData ? codeData.perms : { admin: null, music: null };
  console.log(`Code used: ${code}. Permissions assigned:`, perms);

  //IMPORTANT= CHANGE LATER
  const hasUser = MOCK_USERS.find((u) => u.username === username);
  if (hasUser) {
    res.status(422).json({ message: "This username is already in use" });
    return;
  }
  const createdUser = {
    id: uuid(),
    username,
    password,
    email,
    fullname,
    perms,
  };
  MOCK_USERS.push(createdUser);
  console.log("registered with no failure");
  const token = jwt.sign(
    {
      id: createdUser.id,
      username: createdUser.username,
      perms: createdUser.perms,
    },
    "cleSuperSecrete!",
    { expiresIn: "1h" },
  );

  res.status(201).json({
    token: token,
    id: createdUser.id,
    username: createdUser.username,
    perms: createdUser.perms,
  });
};

const permsChange = (req, res, next) => {
  console.log("Changing access code/perms");
  const userId = req.params.userId;
  const { newCode } = req.body;

  //IMPORTANT: TOCHANGE
  const identifiedUser = MOCK_USERS.find((u) => u.id === userId);
  if (!identifiedUser) {
    res.status(401).json({
      message: "Failed to find a matching ID",
    });
  }

  //IMPORTANT: TO CHANGE
  const codeData = MOCK_CODES.find((c) => c.code === newCode);
  const newPerms = codeData ? codeData.perms : { admin: null, music: null };
  console.log("NewPermsLoaded");

  identifiedUser.perms = newPerms;
  console.log("UpdatedUser");
  let token;
  try {
    console.log("Perms changed!");
    token = jwt.sign(
      {
        id: identifiedUser.id,
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
    id: identifiedUser.id,
    username: identifiedUser.username,
    perms: identifiedUser.perms,
    token: token,
  });
};

export default {
  getUsers,
  login,
  register,
  permsChange,
};
