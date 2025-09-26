import { deleteLike, findLike, findPostById, insertLike } from "../repositores/likes.repositores.js";

export async function like (req, res){
    const { id: postId } = req.params;
    const { userId } = res.locals;

    try {
        const post = await findPostById(postId);
        if (post.rowCount === 0) return res.status(404).send("Post não encontrado");

        const likeExists = await findLike(userId, postId);
        if (likeExists.rowCount > 0) return res.status(409).send("Você já curtiu este post");

        await insertLike(userId, postId);

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
};


export async function takeLike (req, res){
    const { id: postId } = req.params;
    const { userId } = res.locals;

    try {
        const post = await findPostById(postId);
        if (post.rowCount === 0) return res.status(404).send("Post não encontrado");

        const likeExists = await findLike(userId, postId);
        if (likeExists.rowCount === 0) return res.status(404).send("Você ainda não curtiu este post");

        await deleteLike(userId, postId);

        res.sendStatus(204);
    } catch (err) {
        res.status(500).send(err.message);
    }
};
