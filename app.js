const express = require("express");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");

const port = process.env.PORT || 3000;

connectDB();
const app = express();

app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/note", noteRoutes);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port: ${port}`));
