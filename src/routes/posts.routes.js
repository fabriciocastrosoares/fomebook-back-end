import { Router } from "express";
import { createPost, getPostsByUser, deletepost, updatePosts, getTimeLine } from "../controllers/posts.controllers.js";
import { validateSchema } from "../middlewares/validate.schema.js";
import { postSchema, updatePostSchema } from "../schemas/post.schema.js";
import { authenticate } from "../middlewares/validateAuth.middlewares.js";

const postsRouter = Router();

postsRouter.post("/posts", validateSchema(postSchema), authenticate, createPost);
postsRouter.get("/posts/user/:id", authenticate, getPostsByUser);
postsRouter.delete("/posts/:id/", authenticate, deletepost);
postsRouter.put("/posts/:id", authenticate, validateSchema(updatePostSchema), updatePosts);
postsRouter.get("/timeline", authenticate, getTimeLine);

export default postsRouter;