import express from "express";
import usersController from "../controllers/users-controller.js";

const router = express.Router();

router.get("/", usersController.getUsers);

router.post("/login", usersController.login);

router.post("/register", usersController.register);

//http://localhost:5000/api/users/$id/permsChange;
router.patch("/:userId/permsChange", usersController.permsChange);

export default router;
