const express = require("express");
const authenticateJWT = require("../middlewares/authenticateJWT");
const { createCourse } = require("../controllers/courseController");

const router = express.Router();

router.post("/create", authenticateJWT, createCourse);

module.exports = router;
