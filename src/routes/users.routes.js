import { Router } from "express";
import { getUser, getUserById, getUserBySearch } from "../controllers/users.controllers.js";
import { authenticate } from "../middlewares/validateAuth.middlewares.js";

const usersRouter = Router();

usersRouter.get("/users/me", authenticate, getUser );
usersRouter.get("/users/:id", getUserById);
usersRouter.get("/users", getUserBySearch);

export default usersRouter;