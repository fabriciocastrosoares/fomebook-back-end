import { db } from "..//database/database.connection.js";

export function createUser(name, email, password, biography, imageUrl) {
    return db.query(`INSERT INTO users (name, email, password, biography, "imageUrl") VALUES ($1, $2, $3, $4, $5);`, [name, email, password, biography, imageUrl]);
};

export function createSession(id, token) {
    return db.query(`INSERT INTO sessions ("userId", token) VALUES ($1, $2);`, [id, token]);
};

export async function logoutUser(token){
    return db.query(`DELETE FROM sessions WHERE token = $1;`, [token]);
};