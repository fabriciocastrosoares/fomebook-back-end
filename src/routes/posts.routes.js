import { Router } from "express";
import { createPost, getPostsByUser, getPosts } from "../controllers/posts.controllers.js";
import { validateSchema } from "../middlewares/validate.schema.js";
import { postSchema } from "../schemas/post.schema.js";
import { authenticate } from "../middlewares/validateAuth.middlewares.js";

const postsRouter = Router();

postsRouter.post("/posts", validateSchema(postSchema), authenticate, createPost);
postsRouter.get("/posts", authenticate, getPosts);
postsRouter.get("/posts/user/:id", authenticate, getPostsByUser);


export default postsRouter;