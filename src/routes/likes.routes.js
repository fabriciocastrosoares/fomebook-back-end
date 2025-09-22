import { Router } from "express";
import { like, takeLike } from "../controllers/likes.controllers.js";

const likesRouter = Router();

likesRouter.post("/posts/:id/like", like);
likesRouter.delete("/posts/:id/unlike", takeLike);

export default likesRouter;