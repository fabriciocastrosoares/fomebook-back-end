import { db } from "../database/database.connection.js";

export function createPostDb(userId, pictureUrl, description) {
  return db.query(
    `INSERT INTO posts ("userId", "pictureUrl", description)
     VALUES ($1, $2, $3)
     RETURNING *;`,
    [userId, pictureUrl, description]
  );
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
    WITH following AS (
      SELECT "followingId" FROM followers WHERE "followerId" = $1
    ),
    timeline_posts AS (
      SELECT
          p.id,
          p."userId",
          p."pictureUrl",
          p.description,
          p."createdAt",
          NULL::jsonb AS "repostedBy"
      FROM posts p
      WHERE p."userId" = $1
         OR p."userId" IN (SELECT "followingId" FROM following)

      UNION ALL

      SELECT
          p.id,
          p."userId",
          p."pictureUrl",
          p.description,
          r."createdAt",
          jsonb_build_object('id', ru.id, 'name', ru.name, 'imageUrl', ru."imageUrl") AS "repostedBy"
      FROM reposts r
      JOIN posts p ON r."postId" = p.id
      JOIN users ru ON r."userId" = ru.id
      WHERE r."userId" IN (SELECT "followingId" FROM following)
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

      (SELECT COUNT(*) FROM reposts rr WHERE rr."postId" = tp.id) AS "repostCount",

      (SELECT COUNT(*) FROM likes ll WHERE ll."postId" = tp.id)::int AS "likeCount",

      (SELECT EXISTS (SELECT 1 FROM likes l3 WHERE l3."postId" = tp.id AND l3."userId" = $1)) AS "likedByUser",

      COALESCE((
        SELECT json_agg(json_build_object('id', sub.id, 'name', sub.name))
        FROM (
          SELECT u2.id, u2.name
          FROM likes l2
          JOIN users u2 ON u2.id = l2."userId"
          WHERE l2."postId" = tp.id
          ORDER BY l2."createdAt" DESC NULLS LAST, l2.id DESC
          LIMIT 2
        ) sub
      ), '[]'::json) AS likers,
      COALESCE((
        SELECT json_agg(comment_data)
        FROM (
          SELECT c.id, c.text, c."createdAt", cu.id as "userId", cu.name as "userName", cu."imageUrl" as "userImage"
          FROM comments c
          JOIN users cu ON c."userId" = cu.id
          WHERE c."postId" = tp.id
          ORDER BY c."createdAt" ASC
        ) comment_data
      ), '[]'::json) AS comments

    FROM timeline_posts tp
    JOIN users u ON tp."userId" = u.id
    ORDER BY tp."createdAt" DESC;
  `, [userId]);
}




export function createRepostDb(userId, postId) {
  return db.query(
    `INSERT INTO reposts ("userId", "postId")
     VALUES ($1, $2)
     ON CONFLICT ("userId", "postId") DO NOTHING
     RETURNING *;`,
    [userId, postId]
  );
};

