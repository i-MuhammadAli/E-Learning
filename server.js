const express = require("express");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const authenticateJWT = require("./middlewares/authenticateJWT");

const port = process.env.PORT || 3000;

connectDB();
const app = express();

app.use(express.json());
app.use("/api/user", userRoutes);
app.use(authenticateJWT);
app.use("/api/course", courseRoutes);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port: ${port}`));
