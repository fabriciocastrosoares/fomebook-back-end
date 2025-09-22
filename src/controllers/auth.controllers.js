import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { createSession, createUser, logoutUser } from '../repositores/auth.repositores.js';

export async function signup(req, res) {
    const { name, email, password, biography, imageUrl } = req.body;
    try {
        const hash = bcrypt.hashSync(password, 10);
        await createUser(name, email, hash, biography, imageUrl);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
};


export async function signin(req, res) {
    const { password } = req.body;
    const { id, name, savedPassword } = res.locals;
    try {
        const correctPassword = bcrypt.compareSync(password, savedPassword);
        if (!correctPassword) return res.status(401).send("Senha incorreta");

        const token = uuid();
        await createSession(id, token);
        res.status(200).send({ name, token })
    } catch (err) {
        res.status(500).send(err.message);
    }
};


export async function logout(req, res) {
    const { token } = res.locals;

    try {
        await logoutUser(token)
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
};