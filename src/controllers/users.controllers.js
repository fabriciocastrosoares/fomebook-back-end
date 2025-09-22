import { getUserPostsById, searchUsersByName } from "../repositores/users.repositores.js";

export async function getUser(req, res) {
    const { userId } = res.locals;
    try {
        const result = await getUserPostsById(userId);
        if (result.rowCount === 0) return res.status(404).send("Usuário não encontrado");
        
        res.send(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }

};


export async function getUserById(req, res) {
    const { id } = req.params;

    try {
        const result = await getUserPostsById(id);
        if (result.rowCount === 0) return res.status(404).send("Usuário não encontrado");

        res.send(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};


export async function getUserBySearch(req, res) {
    const { name } = req.query;
    if (!name) return res.status(400).send("The 'name' query parameter is required");

    try {
        const result = await searchUsersByName(name);
        res.send(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
};