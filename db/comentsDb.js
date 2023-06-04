const getDB = require("./getDb");

const newComentDb = async (userId, text, image = "", urlimage = "") => {
  let connection;
  try {
    connection = await getDB();
    const [result] = await connection.query(
      `INSERT INTO coments (iduser, text, image, urlimage) VALUES (?,?,?,?)`,
      [userId, text, image, urlimage]
    );

    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  newComentDb,
};
