import { db } from "../database/database.connection.js";

export function createPostDb(userId, pictureUrl, description) {
  return db.query(`INSERT INTO posts ("userId", "pictureUrl", description) VALUES ($1, $2, $3);`, [userId, pictureUrl, description]);
};


export function deletePostDb(id) {
  return db.query(`DELETE FROM posts WHERE id = $1;`, [id]);
};

export function updatePostsDb(id, description, userId) {
  return db.query(
    `
    UPDATE posts 
    SET description = $1 
    WHERE id = $2 AND "userId" = $3
    RETURNING *;
    `,
    [description, id, userId]
  );
};

export function getTimeLineDb(userId) {
  return db.query(`
    WITH timeline_posts AS (
        -- Posts originais de quem o usuário segue
        SELECT
            p.id,
            p."userId",
            p."pictureUrl",
            p.description,
            p."createdAt",
            NULL::jsonb AS "repostedBy"
        FROM posts p
        JOIN followers f ON p."userId" = f."followingId"
        WHERE f."followerId" = $1

        UNION ALL

        -- Reposts de quem o usuário segue
        SELECT
            p.id,
            p."userId",
            p."pictureUrl",
            p.description,
            r."createdAt",
            jsonb_build_object('id', ru.id, 'name', ru.name) AS "repostedBy"
        FROM reposts r
        JOIN posts p ON r."postId" = p.id
        JOIN users ru ON r."userId" = ru.id
        JOIN followers f ON r."userId" = f."followingId"
        WHERE f."followerId" = $1
    )
    SELECT
        tp.id AS "postId",
        tp."pictureUrl",
        tp.description,
        tp."createdAt",
        u.id AS "userId",
        u.name AS "userName",
        u."imageUrl" AS "userImage",
        tp."repostedBy",
        (SELECT COUNT(*) FROM reposts r WHERE r."postId" = tp.id) AS "repostCount",
        COUNT(DISTINCT l.id)::int AS "likeCount",
        BOOL_OR(l."userId" = $1) AS "likedByUser",
        COALESCE(
            (SELECT json_agg(likers_sub.name)
             FROM (
                 SELECT u2.name
                 FROM likes l2
                 JOIN users u2 ON u2.id = l2."userId"
                 WHERE l2."postId" = tp.id
                 ORDER BY l2.id DESC
                 LIMIT 2
             ) AS likers_sub),
            '[]'::json
        ) AS likers,
        (SELECT COALESCE(json_agg(comment_data), '[]'::json)
            FROM (
                SELECT c.id, c.text, c."createdAt", cu.id as "userId", cu.name as "userName", cu."imageUrl" as "userImage"
                FROM comments c
                JOIN users cu ON c."userId" = cu.id
                WHERE c."postId" = tp.id
                ORDER BY c."createdAt" ASC
            ) as comment_data
        ) as comments
    FROM timeline_posts tp
    JOIN users u ON tp."userId" = u.id
    LEFT JOIN likes l ON l."postId" = tp.id
    GROUP BY tp.id, tp."pictureUrl", tp.description, tp."createdAt", u.id, tp."repostedBy"
    ORDER BY tp."createdAt" DESC;
    `, [userId]);
};


export function createRepostDb(userId, postId) {
  return db.query(`INSERT INTO reposts ("userId", "postId") VALUES ($1, $2);`, [userId, postId]);
};

