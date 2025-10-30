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
   SELECT
  p.id AS "postId",
  p."pictureUrl",
  p.description,
  p."createdAt",
  u.id AS "userId",
  u.name AS "userName",
  u."imageUrl" AS "userImage",
  COUNT(DISTINCT l.id) AS "likeCount",
  BOOL_OR(l."userId" = $1) AS "likedByUser",

  COALESCE(
    (
      SELECT json_agg(likers_sub.name)
      FROM (
        SELECT u2.name
        FROM likes l2
        JOIN users u2 ON u2.id = l2."userId"
        WHERE l2."postId" = p.id
        ORDER BY l2.id DESC
        LIMIT 2
      ) AS likers_sub
    ),
    '[]'::json
  ) AS likers,

  COALESCE(
    json_agg(
      DISTINCT jsonb_build_object(
        'id', c.id,
        'text', c.text,
        'createdAt', c."createdAt",
        'userId', cu.id,
        'userName', cu.name,
        'userImage', cu."imageUrl"
      )
    ) FILTER (WHERE c.id IS NOT NULL),
    '[]'::json
  ) AS comments

FROM posts p
JOIN users u ON u.id = p."userId"
LEFT JOIN likes l ON l."postId" = p.id
LEFT JOIN comments c ON c."postId" = p.id
LEFT JOIN users cu ON cu.id = c."userId"

WHERE p."userId" = $1
   OR p."userId" IN (
     SELECT f."followingId"
     FROM followers f
     WHERE f."followerId" = $1
   )


GROUP BY p.id, u.id
ORDER BY p."createdAt" DESC;


    `, [userId]);
};

