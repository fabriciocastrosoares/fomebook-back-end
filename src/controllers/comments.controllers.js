import { createCommentDb } from "../repositores/comments.repositores.js";

export async function createComment(req, res) {
    const { text } = req.body;
    const { userId, postId } = res.locals;
    try {
        const result = await createCommentDb(userId, postId, text);
        res.status(201).send(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};