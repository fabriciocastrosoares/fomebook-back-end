import { createPostDb, getPostsDb } from "../repositores/posts.repositores.js";

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

export async function getPosts(req, res) {
    try {
        const result = await getPostsDb();
        res.send(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}


export async function getPotsByUser(req, res) {
    const {id} = req.params;

    try{
        

    } catch (err) {
        res.status(500).send(err.message);
    }

};
