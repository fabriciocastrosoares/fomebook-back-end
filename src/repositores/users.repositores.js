import { db } from "../database/database.connection.js";

export function getUserPostsById(id) {
    return db.query(`
        SELECT 
            u.id,
            u.name,
            u.biography,
            u."imageUrl",
            COALESCE(
                (SELECT json_agg(
                    json_build_object(
                        'id', p.id,
                        'pictureUrl', p."pictureUrl",
                        'description', p.description,
                        'createdAt', p."createdAt"
                    ) ORDER BY p."createdAt" DESC
                )
                FROM posts p WHERE p."userId" = u.id),
                '[]'::json
            ) AS posts
        FROM users u
        WHERE u.id = $1;
    `, [id]);
}

export function searchUsersByName(name) {
    return db.query(`
        SELECT id, name, "imageUrl" 
        FROM users 
        WHERE name ILIKE $1;
    `, [`%${name}%`]);
}