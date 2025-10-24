import { Router } from "express";
import { getUser, getUserById, getUserBySearch, updateUser } from "../controllers/users.controllers.js";
import { authenticate } from "../middlewares/validateAuth.middlewares.js";

const usersRouter = Router();

usersRouter.get("/users/me", authenticate, getUser );
usersRouter.get("/users/search", authenticate, getUserBySearch);
usersRouter.get("/users/:id", authenticate, getUserById);
usersRouter.put("/users/:id", authenticate, updateUser);

export default usersRouter;