// Creamos una instancia de mysql asíncrona (con  /promise)
const mysql = require("mysql2/promise");

// Damos acceso a nuestras variables de entorno definidas en .env
require("dotenv").config();

// Hacemos destructuring de las variables de entorno que vamos a necesitar
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT } =
  process.env;
// console.log(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE);

// Creamos una variable donde se almacenará el grupo de conexiones
let pool;

// Creamos la función asíncrona que nos retornará una conexión con la base de datos
const getDB = async () => {
  // Si no existe ningún grupo de conexiones
  if (!pool) {
    // Creamos un grupo de conexiones
    pool = mysql.createPool({
      // Marcamos un límite de conexiones máximas (10 es más que suficiente)
      connectionLimit: 10,
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      port: MYSQL_PORT,
      // Usamos el horario Zulú para fechas y horas estándar
      timezone: "Z",
    });
  }

  // Cuando ya exista un grupo de conexiones, usamos el método 'getConnection' propio de 'pool' y devolvemos una conexión del grupo de conexiones
  return await pool.getConnection();
};

// Exportamos la función 'getDB' porque la vamos a invocarla en otros archivos de nuestro proyecto
module.exports = getDB;
