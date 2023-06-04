const getDB = require("../db/getDb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser, getUserByEmail } = require("../db/usersDb");
const { generateError } = require("../helpers");

const newUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //pendiente usar JOI
    if (!password || !email) {
      throw generateError("Username or password error", 400);
    }

    const id = await createUser(email, password);

    res.send({
      status: "ok",
      message: `User created with id: ${id}`,
      userId: id,
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  let connection;

  try {
    const id = req.userId;
    const { username } = req.params;

    connection = await getDB();

    if (username) {
      const [resp] = await connection.query(
        `UPDATE users SET username =? WHERE id =? `,
        [username, id]
      );
      if (resp.length === 0) {
        throw generateError(`No username insert`, 404);
      }
      res.send({ status: "ok", data: "Change username successful" });
    } else {
      // El primer elemento del array que nos devuelve es el resultado de nuestra query
      const [resp] = await connection.query(
        `SELECT id, email, username, create_at FROM users WHERE id=?`,
        [id]
      );
      if (resp.length === 0) {
        throw generateError(`Nobody with id: ${id}`, 404);
      }
      //Enviamos la respuesta en un objeto
      res.send({ status: "ok", data: resp[0] });
    }
  } catch (error) {
    next(error);
  } finally {
    // Siempre liberamos la conexión tanto si la consulta es satisfactoria o si hubo un error
    if (connection) connection.release();
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!password || !email) {
      throw generateError("Username or password error in login", 400);
    }

    const user = await getUserByEmail(email);

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw generateError(`Password not correct`, 401);
    }

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" });

    res.send({
      status: "ok",
      data: token,
      userId: user.id,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  newUser,
  login,
  getUser,
};
