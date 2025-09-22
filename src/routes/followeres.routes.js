import { Router } from "express";
import { getFollowers, getFollwings, unfollow, userFollow } from "../controllers/followers.controllers.js";

const followeresRouter = Router();

followeresRouter.post("/users/:id/follow", userFollow );
followeresRouter.delete("/users/:id/unfllow", unfollow );
followeresRouter.get("/users/:id/followers", getFollowers );
followeresRouter.get("/users/:id/following", getFollwings );


export default followeresRouter;