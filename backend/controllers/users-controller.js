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
    console.log("Secret is:", JWT_SECRET);
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
      username: identifiedUser.username,
      perms: identifiedUser.perms,
      token: token,
    });
  } catch (err) {
    return next(new HttpError("Token generation failed.", 500));
  }
};

const register = async (req, res, next) => {
  console.log("registering");

  const { username, password, email, fullname, code } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(422)
        .json({ message: "This username is already in use" });
    }

    //add code collection here.
    const MOCK_CODES = {
      b: { music: "enjoyer", admin: null },
      a: { music: "admin", admin: "admin" },
      c: { music: "curator", admin: "null" },
    };

    const perms = MOCK_CODES[code] || { admin: null, music: null };

    const createdUser = new User({
      username,
      //encrypt
      password,
      email,
      fullName: fullname,
      perms,
    });

    await createdUser.save();

    const token = jwt.sign(
      {
        id: createdUser._id,
        username: createdUser.username,
        perms: createdUser.perms,
      },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(201).json({
      token: token,
      id: createdUser._id,
      username: createdUser.username,
      perms: createdUser.perms,
    });
  } catch (err) {
    return next(new HttpError("Registering failed, please try again", 500));
  }
};

const permsChange = async (req, res, next) => {
  console.log("Changing access code/perms");
  const userId = req.params.userId;
  const { newCode } = req.body;

  //IMPORTANT: TOCHANGE
  const MOCK_CODES = {
    b: { music: "enjoyer", admin: null },
    a: { music: "admin", admin: "admin" },
    c: { music: "curator", admin: null },
  };

  const newPerms = MOCK_CODES[newCode] || { admin: null, music: null };

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new HttpError("Failed to find a matching ID", 404));
    }

    user.perms = newPerms;
    user.markModified("perms");
    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username, perms: user.perms },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(200).json({
      id: user._id,
      username: user.username,
      perms: user.perms,
      token: token,
    });
  } catch (err) {
    return next(new HttpError("Updating permission failed.", 500));
  }
};

export default {
  getUsers,
  login,
  register,
  permsChange,
};
