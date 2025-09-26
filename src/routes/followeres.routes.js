import { Router } from "express";
import { getFollowers, getFollwings, unfollow, userFollow } from "../controllers/followers.controllers.js";
import { authenticate } from "../middlewares/validateAuth.middlewares.js";

const followeresRouter = Router();

followeresRouter.post("/users/:id/follow", authenticate, userFollow );
followeresRouter.delete("/users/:id/unfollow", authenticate, unfollow );
followeresRouter.get("/users/:id/followers", authenticate, getFollowers );
followeresRouter.get("/users/:id/following", authenticate, getFollwings );

export default followeresRouter;