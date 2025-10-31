import { createPostDb, createRepostDb, deletePostDb, getTimeLineDb, updatePostsDb } from "../repositores/posts.repositores.js";
import { getUserPostsById } from "../repositores/users.repositores.js";

export async function createPost(req, res) {
    const { pictureUrl, description } = req.body;
    const { userId } = res.locals;
    try {
        const result = await createPostDb(userId, pictureUrl, description);
        res.status(201).send(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function deletepost(req, res) {
    const { id } = req.params;

    try {
        await deletePostDb(id);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send(err.message);
    }
};


export async function getPostsByUser(req, res) {
    const { id } = req.params;
    const { userId } = res.locals;

    try {
        const result = await getUserPostsById(id, userId);
        if (result.rowCount === 0) return res.status(404).send("Usuário não encontrado");
        res.send(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};
export async function updatePosts(req, res) {
    const { id } = req.params;
    const { description } = req.body;
    const { userId } = res.locals;

    try {
        const result = await updatePostsDb(id, description, userId);
        if (result.rowCount === 0)
            return res.status(403).send("Você não tem permissão para editar este post.");

        res.send(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function getTimeLine(req, res){
    const { userId } = res.locals;

    try{
         const result = await getTimeLineDb(userId);
        
        res.send(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function repostPost(req, res) {
    const { id } = req.params;
    const { userId } = res.locals;
    try {
        await createRepostDb(userId, id);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

