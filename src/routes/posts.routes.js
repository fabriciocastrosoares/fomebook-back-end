import { Router } from "express";
import { createPost, getPotsByUser } from "../controllers/posts.controllers.js";

const postsRouter = Router();

postsRouter.post("/posts", createPost);
postsRouter.get("/posts/user/:id", getPotsByUser);


export default postsRouter;