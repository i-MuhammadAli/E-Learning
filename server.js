const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");
const authenticateJWT = require("./middlewares/authenticateJWT");

const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const chapterRoutes = require("./routes/chapterRoutes");

// const port = process.env.PORT || 3000;

connectDB();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("E-Learning Platform");
});

app.use("/api/user", userRoutes);
app.use(authenticateJWT);
app.use("/api/course", courseRoutes);
app.use("/api/course/:id/module", moduleRoutes);
app.use("/api/course/:id/module/:id/chapter", chapterRoutes);

// app.listen(port, () => console.log(`Server running on port: ${port}`));

module.exports = app;
