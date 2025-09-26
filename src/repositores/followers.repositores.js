import { db } from "../database/database.connection.js";

export function checkIfFollowing(followerId, followedId) {
    return db.query(`
        SELECT * FROM followers WHERE "followerId" = $1 AND "followingId" = $2;
    `, [followerId, followedId]); 
};

export function insertFollow(followerId, followedId) {
    return db.query(`
        INSERT INTO followers ("followerId", "followingId") VALUES ($1, $2);
    `, [followerId, followedId]);
};

export function deleteFollow(followerId, followedId) {
    return db.query(`
        DELETE FROM followers WHERE "followerId" = $1 AND "followingId" = $2;
    `, [followerId, followedId]);
};

export function getFollowersByUserId(userId) {
    return db.query(`SELECT u.id, u.name, u."imageUrl" FROM users u JOIN followers f ON u.id = f."followerId" WHERE f."followingId" = $1;`, [userId]);
};

export function getFollowingByUserId(userId) {
    return db.query(`SELECT u.id, u.name, u."imageUrl" FROM users u JOIN followers f ON u.id = f."followingId" WHERE f."followerId" = $1;`, [userId]);
};