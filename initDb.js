require("dotenv").config();

const getDB = require("./db/getDb");

async function main() {
  let conexion;
  try {
    conexion = await getDB();

    console.log("creando database si no existe api1");
    await conexion.query("CREATE DATABASE  IF NOT EXISTS api1;");
    await conexion.query("USE api1;");

    console.log("borrado tablas");
    await conexion.query("DROP TABLE IF EXISTS likes;");
    await conexion.query("DROP TABLE IF EXISTS coments;");
    await conexion.query("DROP TABLE IF EXISTS users;");
    await conexion.query("DROP TABLE IF EXISTS puntuaciones;");

    console.log("creando tablas");
    await conexion.query(`
            CREATE TABLE users (
            id int unsigned NOT NULL AUTO_INCREMENT,
            username varchar(50) DEFAULT NULL,
            password varchar(255) DEFAULT NULL,
            email varchar(100) DEFAULT NULL,
            create_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            active tinyint(1) DEFAULT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY email (email)
            );
        `);
    await conexion.query(`
        CREATE TABLE coments (
            id int unsigned NOT NULL AUTO_INCREMENT,
            userId int unsigned DEFAULT NULL,
            image varchar(255) DEFAULT NULL,
            text varchar(255) DEFAULT NULL,
            create_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY userId (userId),
            CONSTRAINT photos_ibfk_1 FOREIGN KEY (userId) REFERENCES users (id)
            );
    `);
    await conexion.query(`
    CREATE TABLE likes (
        id int unsigned NOT NULL AUTO_INCREMENT,
        userId int unsigned DEFAULT NULL,
        fotoId int unsigned DEFAULT NULL,
        dia_creacion datetime DEFAULT NULL,
        PRIMARY KEY (id),
        KEY userId (userId),
        KEY fotoId (fotoId),
        CONSTRAINT likes_ibfk_1 FOREIGN KEY (userId) REFERENCES users (id),
        CONSTRAINT likes_ibfk_2 FOREIGN KEY (fotoId) REFERENCES coments (id)
        ) ;
`);
    await conexion.query(`
CREATE TABLE puntuaciones (
    idpuntuaciones int unsigned NOT NULL AUTO_INCREMENT,
    puntuacion int unsigned DEFAULT NULL,
    intentos int unsigned DEFAULT NULL,
    nombre varchar(50) DEFAULT NULL,
    ultima tinyint(1) DEFAULT NULL,
    tiempo varchar(255) DEFAULT NULL,
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (idpuntuaciones)
    ) ;
`);
  } catch (error) {
    console.log(error);
  } finally {
    if (conexion) conexion.release();
    process.exit();
  }
}

main();
