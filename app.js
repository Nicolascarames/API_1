const express = require("express");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");

const app = express();
const port = 3000;

app.use(morgan("dev"));
app.use(express.json());

const { newUser, login, getUser } = require("./controllers/users");
const { authUser } = require("./middlewares/auth");
const {
  newComent,
  getComents,
  getComentsById,
} = require("./controllers/coments");

// Home
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "./routes.txt"));
});

//routes
app.post("/newuser", newUser);
app.post("/login", login);
app.get("/user", authUser, getUser);
app.get("/user/:username", authUser, getUser);
app.post("/post", authUser, newComent);
app.get("/coments", getComents);
app.get("/comentsuser/:id", getComentsById);

// Página no encontrada - 404 page
app.use((req, res) => {
  res.status(404).send({
    status: 404,
    message: "Not found",
  });
});

// Página de error en el servidor - 500 page
app.use((error, req, res, next) => {
  console.error(error.message);
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: "error",
    message: error.message,
  });
});

app.listen(port, () =>
  console.log(
    `Express started on http://localhost:${port}; ` +
      `press Ctrl-C to terminate.`
  )
);
