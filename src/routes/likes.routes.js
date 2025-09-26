import { Router } from "express";
import { like, takeLike } from "../controllers/likes.controllers.js";
import { authenticate } from "../middlewares/validateAuth.middlewares.js";

const likesRouter = Router();

likesRouter.post("/posts/:id/like", authenticate, like);
likesRouter.delete("/posts/:id/unlike", authenticate, takeLike);

export default likesRouter;