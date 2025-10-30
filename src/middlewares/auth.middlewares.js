import { db } from "..//database/database.connection.js";

export async function validateAddUser(req, res, next) {
    const { email } = req.body;
    try {
        const userExists = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (userExists.rowCount > 0) return res.status(409).send("email já cadastrado, tente outro!");
        next();
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function userExists(req, res, next) {
    const { email } = req.body;
    try {
        const user = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (user.rowCount === 0) return res.status(404).send("E-mail não cadastrado");

        const { id, name, password: savedPassword, imageUrl } = user.rows[0];
        
        res.locals.savedPassword = savedPassword;
        res.locals.id = id;
        res.locals.name = name;
        res.locals.image = imageUrl
        next();
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function postExist(req, res, next) {
     const { id } = req.params;
    try {
        const post = await db.query(`SELECT * FROM posts WHERE id = $1`, [id]);
        if (post.rowCount === 0) return res.status(404).send("Post Não encontrado");

        const { userId, id: postId } = post.rows[0];
        
        res.locals.userId = userId;
        res.locals.postId = postId;
        
        next();
    } catch (err) {
        res.status(500).send(err.message);
    }
};