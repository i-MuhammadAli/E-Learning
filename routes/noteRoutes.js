const express = require("express");
const authenticateJWT = require("../middlewares/authenticateJWT");
const { createNote } = require("../controllers/noteController");

const router = express.Router();

router.post("/create", authenticateJWT, createNote);

module.exports = router;
