import { db } from "../database/database.connection.js";

export function createCommentDb(userId, postId, text){
    return db.query(`INSERT INTO comments ("userId", "postId", text) VALUES ($1, $2, $3) RETURNING *;`, [userId, postId, text]);
};