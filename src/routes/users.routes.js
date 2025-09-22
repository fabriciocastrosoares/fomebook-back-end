import { Router } from "express";
import { getUser, getUserById, getUserBySearch } from "../controllers/users.controllers.js";

const usersRouter = Router();

usersRouter.get("/users/me", getUser );
usersRouter.get("/userr/:id", getUserById);
usersRouter.get("/users", getUserBySearch);

export default usersRouter;