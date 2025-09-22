import { db } from "../database/database.connection.js";

export function createPostDb(userId, pictureUrl, description) {
    return db.query(`INSERT INTO posts ("userId", "pictureUrl", description) VALUES ($1, $2, $3);`, [userId, pictureUrl, description]);
};

export function getPostsDb(id) {
    return db.query(`
        SELECT 
            p.id,
            p."pictureUrl",
            p.description,
            p."createdAt",
            u.name AS "userName",
            u."imageUrl" AS "userImageUrl",
            u.biography 
        FROM posts p
        JOIN users u ON p."userId" = u.id
        ORDER BY p."createdAt" DESC;
    `);
};