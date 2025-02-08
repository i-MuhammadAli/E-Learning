const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");
const authenticateJWT = require("./middlewares/authenticateJWT");

const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const moduleRoutes = require("./routes/moduleRoutes");

const port = process.env.PORT || 3000;

connectDB();
const app = express();

app.use(express.json());

app.use("/api/user", userRoutes);

app.use(authenticateJWT);

app.use("/api/course", courseRoutes);
app.use("/api/course/:id/module", moduleRoutes);

app.listen(port, () => console.log(`Server running on port: ${port}`));
