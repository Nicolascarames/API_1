const getDB = require("../db/getDb");

const newUser = async (req, res, next) => {};

const login = async (req, res, next) => {};

const getUser = async (req, res, next) => {};

const getUsers = async (req, res, next) => {
  let connection;
  try {
    // Conseguimos una conexión con la base de datos
    connection = await getDB();

    // El primer elemento del array que nos devuelve es el resultado de nuestra query
    const [resp] = await connection.query(`SELECT * FROM users`);

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
  newUser,
  login,
  getUser,
  getUsers,
};
