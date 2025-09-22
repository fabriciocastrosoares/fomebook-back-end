import { Router } from "express";
import { logout, signin, signup } from "../controllers/auth.controllers.js";
import { userExists, validateAddUser } from "../middlewares/auth.middlewares.js";
import { authenticate } from "../middlewares/validateAuth.middlewares.js";
import { validateSchema } from "../middlewares/validate.schema.js";
import { signinSchema, signupUserSchema } from "../schemas/auth.schema.js";

const authRouter = Router();

authRouter.post("/signup", validateSchema(signupUserSchema),validateAddUser, signup);
authRouter.post("/signin", validateSchema(signinSchema),userExists, signin);
authRouter.post("/logout", authenticate, logout);

export default authRouter;