const { newComentDb } = require("../db/comentsDb");
const getDB = require("../db/getDb");
const { generateError } = require("../helpers");

const newComent = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || text.length > 999) {
      throw generateError("No text or text.length > 999", 400);
    }

    const id = await newComentDb(req.userId, text);

    res.send({
      status: "ok",
      message: `New coment add with id:${id} from user id:${req.userId}`,
    });
  } catch (error) {
    next(error);
  }
};

const getComents = async (req, res, next) => {
  let connection;
  try {
    // Conseguimos una conexión con la base de datos
    connection = await getDB();

    // El primer elemento del array que nos devuelve es el resultado de nuestra query
    const [resp] = await connection.query(`SELECT * FROM coments`);

    //Enviamos la respuesta en un objeto
    res.send({ status: "ok", data: resp });
  } catch (error) {
    next(error);
    console.error(error);
  } finally {
    // Siempre liberamos la conexión tanto si la consulta es satisfactoria o si hubo un error
    if (connection) connection.release();
  }
};

const getComentsById = async (req, res, next) => {
  const { id } = req.params;
  let connection;
  try {
    // Conseguimos una conexión con la base de datos
    connection = await getDB();

    // El primer elemento del array que nos devuelve es el resultado de nuestra query
    const [resp] = await connection.query(
      `SELECT idcoments, text, iduser, create_at FROM coments WHERE iduser=?`,
      [id]
    );

    if (resp.length === 0) {
      throw generateError(`No coments with userId: ${id}`, 404);
    }

    //Enviamos la respuesta en un objeto
    res.send({ status: "ok", data: resp });
  } catch (error) {
    next(error);
    console.error(error);
  } finally {
    // Siempre liberamos la conexión tanto si la consulta es satisfactoria o si hubo un error
    if (connection) connection.release();
  }
};

module.exports = {
  newComent,
  getComents,
  getComentsById,
};
