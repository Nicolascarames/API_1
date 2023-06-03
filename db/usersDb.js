const getDB = require("./getDb");
const bcrypt = require("bcrypt");
const { generateError } = require("../helpers");

const createUser = async (email, password) => {
  let connection;

  try {
    connection = await getDB();

    const [user] = await connection.query(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    );

    if (user.length > 0) {
      throw generateError("Email already exists", 409);
    }

    const userHash = await bcrypt.hash(password, 8);

    const [newUser] = await connection.query(
      `INSERT INTO users (email, password) VALUES (?,?)`,
      [email, userHash]
    );

    return newUser.insertId;
  } finally {
    if (connection) connection.release();
  }
};

const getUserByEmail = async (email) => {
  let connection;
  try {
    connection = await getDB();
    const [result] = await connection.query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
    if (result.length === 0) {
      throw generateError("Email not found", 404);
    }
    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createUser,
  getUserByEmail,
};
