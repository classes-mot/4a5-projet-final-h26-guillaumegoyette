import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

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
