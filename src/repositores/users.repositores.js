import { db } from "../database/database.connection.js";

export function getUserPostsById(profileUserId, loggedUserId) {
  return db.query(`
    SELECT
      u.id,
      u.name,
      u."imageUrl",
      u.biography,
      (
        SELECT json_agg(
          json_build_object(
            'id', p.id,
            'pictureUrl', p."pictureUrl",
            'description', p.description,
            'createdAt', p."createdAt",
            'likeCount', (
              SELECT COUNT(*) FROM likes l WHERE l."postId" = p.id
            ),
            'likedByUser', EXISTS(
              SELECT 1 FROM likes l WHERE l."postId" = p.id AND l."userId" = $2
            )
          )
          ORDER BY p."createdAt" DESC  
        )
        FROM posts p
        WHERE p."userId" = u.id
      ) AS posts,
      (
        SELECT json_agg(json_build_object('followerId', f."followerId"))
        FROM followers f
        WHERE f."followingId" = u.id
      ) AS followers
    FROM users u
    WHERE u.id = $1
    GROUP BY u.id;
  `, [profileUserId, loggedUserId]);
};



export function searchUsersByName(name) {
    return db.query(`
     ;   SELECT id, name, "imageUrl" 
        FROM users 
        WHERE name ILIKE $1;
    `, [`%${name}%`]);
}

export function getUserById(id) {
  return db.query(`SELECT * FROM users WHERE id = $1;`, [id]);
}