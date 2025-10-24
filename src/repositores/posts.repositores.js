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
      EXISTS(SELECT 1 FROM likes l WHERE l."postId" = p.id AND l."userId" = $1) AS "likedByUser",
      COALESCE((
          SELECT json_agg(users.name)::json
          FROM (
              SELECT "userId"
              FROM likes
              WHERE "postId" = p.id
              ORDER BY id DESC
              LIMIT 2
          ) AS latest_likes
          JOIN users ON users.id = latest_likes."userId"
      ), '[]'::json) AS likers
    FROM posts p
    JOIN users u ON p."userId" = u.id
    ORDER BY p."createdAt" DESC;
  `, [userId]);
}


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

export function getPostsLikeDb(id) {
    return db.query(`
      SELECT u.id, u.name, u."imageUrl"
      FROM likes l
      JOIN users u ON u.id = l."userId"
      WHERE l."postId" = $1
    `, [id]);
};