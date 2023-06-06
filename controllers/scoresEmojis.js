const getDB = require("../db/getDb");

const newPuntuacion = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();
    const { nombre, puntuacion, intentos, tiempo, ultima } = req.body;

    if (!nombre && !puntuacion) {
      throw generateError("nombre missing", 400);
    }

    const [newUser] = await connection.query(
      `INSERT INTO puntuaciones (nombre, puntuacion, intentos, tiempo, ultima) VALUES (?,?,?,?,?)`,
      [nombre, puntuacion, intentos, tiempo, ultima]
    );

    res.send({
      status: "ok",
      message: `Created newPuntuacion with id: ${newUser.insertId}`,
    });

    return newUser.insertId;
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

const createUserEmoji = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();
    const { nombre } = req.body;

    if (!nombre) {
      throw generateError("nombre missing", 400);
    }

    const [newUser] = await connection.query(
      `INSERT INTO puntuaciones (nombre) VALUES (?)`,
      [nombre]
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
      `SELECT nombre, puntuacion, create_at, intentos, tiempo, ultima FROM puntuaciones`
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
  newPuntuacion,
};
