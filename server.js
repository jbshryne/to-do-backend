const express = require("express");
const app = express();
const server = require("http").createServer(app);

const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

const userRoutes = require("./controllers/userController");
const categoryRoutes = require("./controllers/categoryController");
const subjectRoutes = require("./controllers/subjectController");

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SECRET,
    cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 },
  })
);

app.use(userRoutes);
app.use(categoryRoutes);
app.use(subjectRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3443;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
