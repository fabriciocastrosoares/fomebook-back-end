import { Router } from "express";
import { validateSchema } from "../middlewares/validate.schema.js";
import { createCommentSchema } from "../schemas/comments.schema.js";
import { authenticate } from "../middlewares/validateAuth.middlewares.js";
import { createComment } from "../controllers/comments.controllers.js";
import { postExist } from "../middlewares/auth.middlewares.js";


const commentsRouter = Router();
commentsRouter.post("/comments/:id", authenticate, postExist, validateSchema(createCommentSchema), createComment);



export default commentsRouter;