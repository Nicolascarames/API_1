const getDB = require("./getDb");

const newComentDb = async (userId, text, image = "") => {
  let connection;
  try {
    connection = await getDB();
    const [result] = await connection.query(
      `INSERT INTO coments (userId, text, image) VALUES (?,?,?)`,
      [userId, text, image]
    );

    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  newComentDb,
};
