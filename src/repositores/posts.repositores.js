import { db } from "../database/database.connection.js";

export function createPostDb(userId, pictureUrl, description) {
    return db.query(`INSERT INTO posts ("userId", "pictureUrl", description) VALUES ($1, $2, $3);`, [userId, pictureUrl, description]);
};

export function getPostsDb(userId) {
    return db.query(`
        SELECT 
            p.id,
            p."pictureUrl",
            p.description,
            p."createdAt",
            json_build_object(
                'id', u.id,
                'name', u.name,
                'imageUrl', u."imageUrl"
            ) AS "user",
            (SELECT COUNT(*) FROM likes l WHERE l."postId" = p.id) AS "likeCount",
            EXISTS(SELECT 1 FROM likes l WHERE l."postId" = p.id AND l."userId" = $1) AS "likedByUser"
        FROM posts p
        JOIN users u ON p."userId" = u.id
        ORDER BY p."createdAt" DESC;
    `, [userId]);
};