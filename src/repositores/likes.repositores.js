import { db } from "../database/database.connection.js";

export function findPostById(postId) {
    return db.query(`SELECT id FROM posts WHERE id = $1;`, [postId]);
};

export function findLike(userId, postId) {
    return db.query(`SELECT id FROM likes WHERE "userId" = $1 AND "postId" = $2;`, [userId, postId]);
};

export function insertLike(userId, postId) {
    return db.query(`INSERT INTO likes ("userId", "postId") VALUES ($1, $2);`, [userId, postId]);
};

export function deleteLike(userId, postId) {
    return db.query(`DELETE FROM likes WHERE "userId" = $1 AND "postId" = $2;`, [userId, postId]);
};