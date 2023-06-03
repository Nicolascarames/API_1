const express = require("express");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");

const app = express();
const port = 3000;

app.use(morgan("dev"));
app.use(express.json());

const { newUser, login, getUser, getUsers } = require("./controllers/users");

// Home
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "./routes.txt"));
});

//routes
app.get("/users", getUsers);
app.get("/user/:id", getUser);
app.post("/user", newUser);
app.post("/login", login);

// Página no encontrada - 404 page
app.use((req, res) => {
  res.type("text/plain");
  res.status(404);
  res.send("404 - Not Found");
});

// Página de error en el servidor - 500 page
app.use((err, req, res, next) => {
  console.error(err.message);
  res.type("text/plain");
  res.status(500);
  res.send("500 - Server Error");
});

app.listen(port, () =>
  console.log(
    `Express started on http://localhost:${port}; ` +
      `press Ctrl-C to terminate.`
  )
);
