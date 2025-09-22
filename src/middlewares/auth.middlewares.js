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

        const { id, name, password: savedPassword } = user.rows[0];

        await db.query(`DELETE FROM sessions WHERE "userId" = $1`, [id]);
        
        res.locals.savedPassword = savedPassword;
        res.locals.id = id;
        res.locals.name = name;
        next();
    } catch (err) {
        res.status(500).send(err.message);
    }
};