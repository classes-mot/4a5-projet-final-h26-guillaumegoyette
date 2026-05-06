import express from "express";
import usersController from "../controllers/users-controller.js";
import checkAuth from "../middleware/check-auth.js";

const router = express.Router();

router.get("/", usersController.getUsers);

router.post("/login", usersController.login);

router.post("/register", usersController.register);

router.use(checkAuth);

router.get("/", usersController.getUsers);

router.patch("/:userId/permsChange", usersController.permsChange);

export default router;
