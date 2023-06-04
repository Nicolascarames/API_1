const getDB = require("../db/getDb");

const createUserEmoji = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();
    const { username } = req.body;

    if (!username) {
      throw generateError("Username missing", 400);
    }

    const [newUser] = await connection.query(
      `INSERT INTO puntuaciones (username) VALUES (?)`,
      [username]
    );

    res.send({
      status: "ok",
      message: `User created with id: ${newUser.insertId}`,
    });

    return newUser.insertId;
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

const createScoreEmoji = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();
    const { score, idPuntuaciones } = req.body;

    if (!score || !idPuntuaciones) {
      throw generateError("score missing", 400);
    }

    const [newScore] = await connection.query(
      `UPDATE puntuaciones SET puntuacion=? WHERE idpuntuaciones=?`,
      [score, idPuntuaciones]
    );

    res.send({
      status: "ok",
      message: `Score created with id: ${newScore.insertId}`,
    });

    return newScore.insertId;
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

const allScoresEmoji = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const [allScores] = await connection.query(
      `SELECT username, puntuacion, create_at FROM puntuaciones`
    );

    res.send({
      status: "ok",
      data: allScores,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createScoreEmoji,
  createUserEmoji,
  allScoresEmoji,
};
