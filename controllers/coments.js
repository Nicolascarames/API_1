const sharp = require("sharp");
const { newComentDb } = require("../db/comentsDb");
const getDB = require("../db/getDb");
const { generateError, createPathIfNotExist } = require("../helpers");
const path = require("path");

const newComent = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || text.length > 999) {
      throw generateError("No text or text.length > 999", 400);
    }

    let imageFileName;
    let uploadsDir;

    if (req.files && req.files.image) {
      //creo el path del directorio uploads
      // console.log(req.files);
      uploadsDir = path.join(__dirname, "../uploads");
      //creo el dir si no existe
      await createPathIfNotExist(uploadsDir);
      //procesar imagen
      const image = sharp(req.files.image.data);
      image.resize(1000);
      //guardo la imagen con un nombre aleatorio en el dir uploads
      imageFileName = `${req.files.image.md5}${req.files.image.name}`;
      await image.toFile(path.join(uploadsDir, imageFileName));
    }

    const id = await newComentDb(req.userId, text, imageFileName);

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
    const [resp] = await connection.query(`
        select c.id, c.userId, c.image, c.text, c.create_at, u.username 
        from users u, coments c 
        where u.id = c.userId;
        `);

    // console.log(resp.map((e) => e.userId));

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
      `SELECT id, text, userId, create_at FROM coments WHERE userId=?`,
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

const deleteComentsById = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.userId;
  let connection;
  try {
    // Conseguimos una conexión con la base de datos
    connection = await getDB();

    // El primer elemento del array que nos devuelve es el resultado de nuestra query
    const [resp] = await connection.query(`SELECT * FROM coments WHERE id=?`, [
      id,
    ]);

    if (resp.length === 0) {
      throw generateError(`No coments with Id: ${id}`, 404);
    }

    if (userId !== resp[0].iduser) {
      throw generateError(`Can't delete coment, not yours`, 401);
    }

    await connection.query(`DELETE FROM coments WHERE idcoments=?`, [id]);

    //Enviamos la respuesta en un objeto
    res.send({
      status: "ok",
      data: `Coment with id: ${id}, delete succesful`,
    });
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
  deleteComentsById,
};
