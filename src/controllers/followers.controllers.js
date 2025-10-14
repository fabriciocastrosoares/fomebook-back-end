import { checkIfFollowing, deleteFollow, getFollowersByUserId, getFollowingByUserId, insertFollow } from "../repositores/followers.repositores.js";
import { getUserById, getUserPostsById } from "../repositores/users.repositores.js";

export async function userFollow(req, res) {
    const { id: followedId } = req.params;
    const { userId: followerId } = res.locals;

    if (Number(followedId) === followerId) {
        return res.status(400).send("Você não pode seguir a si mesmo.");
    };

    try {
        const userToFollow = await getUserById(followedId);
        if (userToFollow.rowCount === 0) {
            return res.status(404).send("Usuário não encontrado.");
        }

        const isFollowing = await checkIfFollowing(followerId, followedId);
        if (isFollowing.rowCount > 0) {
            return res.status(409).send("Você já segue este usuário.");
        }

        await insertFollow(followerId, followedId);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function unfollow(req, res) {
    const { id: followedId } = req.params;
    const { userId: followerId } = res.locals;

    if (Number(followedId) === followerId) {
        return res.status(400).send("Você não pode deixar de seguir a si mesmo.");
    }

    try {
        const userToUnfollow = await getUserById(followedId);
        if (userToUnfollow.rowCount === 0) {
            return res.status(404).send("Usuário não encontrado.");
        }

        const isFollowing = await checkIfFollowing(followerId, followedId);
        if (isFollowing.rowCount === 0) {
            return res.status(404).send("Você não segue este usuário.");
        }

        await deleteFollow(followerId, followedId);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function getFollowers(req, res) {
    const { id } = req.params;
    try {
        const user = await getUserPostsById(id);
        if (user.rowCount === 0) return res.status(404).send("Usuário não encontrado.");
        const followers = await getFollowersByUserId(id);
        res.send(followers.rows);
    } catch (err) {
        res.status(500).send(err.message);

    }
};

export async function getFollwings(req, res) {
    const { id } = req.params;

    try {
        const user = await getUserById(id);
        if (user.rowCount === 0) return res.status(404).send("Usuário não encontrado.");

        const following = await getFollowingByUserId(id);
        res.send(following.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

