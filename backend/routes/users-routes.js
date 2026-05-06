import express from "express";
import usersController from "../controllers/users-controller.js";

const router = express.Router();

router.get("/", usersController.getUsers);

router.post("/login", usersController.login);

router.post("/register", usersController.register);

export default router;
