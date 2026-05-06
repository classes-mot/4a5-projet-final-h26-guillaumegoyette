import express from "express";
import usersController from "../controllers/user-controller.js";
const router = express.router();

router.get("/", usersController.getUsers);

router.post("/login", usersController.login);

export default router;
