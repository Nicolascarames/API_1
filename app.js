const express = require("express");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
// const port = 3000;

const { newUser, login, getUser } = require("./controllers/users");
const { authUser } = require("./middlewares/auth");
const {
  newComent,
  getComents,
  getComentsById,
  deleteComentsById,
} = require("./controllers/coments");
const {
  createUserEmoji,
  createScoreEmoji,
  allScoresEmoji,
  newPuntuacion,
} = require("./controllers/scoresEmojis");

app.use("/uploads", express.static("./uploads"));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(fileUpload());

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
app.delete("/comentsuser/:id", authUser, deleteComentsById);

//routes scores
app.post("/createUserEmoji", createUserEmoji);
app.post("/createScoreEmoji", createScoreEmoji);
app.get("/allScoresEmoji", allScoresEmoji);
app.post("/newpuntuacion", newPuntuacion);

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
