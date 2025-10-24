import { getUserPostsById, searchUsersByName, updateUserById } from "../repositores/users.repositores.js";

export async function getUser(req, res) {
    const { userId } = res.locals;

    try {
        const result = await getUserPostsById(userId, userId);
        if (result.rowCount === 0) return res.status(404).send("Usuário não encontrado");

        res.send(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function getUserById(req, res) {
    const { id } = req.params;
    const { userId } = res.locals;
    try {
        const result = await getUserPostsById(id, userId);
        if (result.rowCount === 0) return res.status(404).send("Usuário não encontrado");

        res.send(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function getUserBySearch(req, res) {
    const { name } = req.query;
    if (!name) return res.status(400).send("The 'name' query parameter is required");

    try {
        const result = await searchUsersByName(name);
        res.send(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function updateUser(req, res) {
  const { id } = req.params;
  const { imageUrl, name, biography } = req.body;

  try {
    const updatedUser = await updateUserById(id, { imageUrl, name, biography });

    if (!updatedUser) {
      return res.status(400).send("Nenhum campo válido para atualizar.");
    }

    res.status(200).send(updatedUser);
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err);
    res.status(500).send("Erro interno do servidor.");
  }
};

