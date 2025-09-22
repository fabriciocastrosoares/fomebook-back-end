import { db } from "../database/database.connection.js";

export async function authenticate(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token) return res.sendStatus(401);

    try {
        const session = await db.query(`SELECT * FROM sessions WHERE token = $1`, [token]);
        if (session.rowCount === 0) return res.sendStatus(401);

        const checkUser = await db.query(`SELECT * FROM users WHERE id = $1`, [session.rows[0].userId]);
        if (checkUser.rowCount === 0) return res.sendStatus(401);

        const { userId } = session.rows[0];
        res.locals.userId = userId;
        res.locals.token = token;
        res.locals.user = checkUser.rows[0];
        
        next();
    } catch (err) {
        res.status(500).send(err.message);
    }
};