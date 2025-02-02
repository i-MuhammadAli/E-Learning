const express = require("express");
const authenticateJWT = require("../middlewares/authenticateJWT");
const {
  createCourse,
  publishCourse,
  unpublishCourse,
} = require("../controllers/courseController");

const router = express.Router();

router.post("/create", authenticateJWT, createCourse);
router.patch("/:id/publish", authenticateJWT, publishCourse);
router.patch("/:id/unpublish", authenticateJWT, unpublishCourse);

module.exports = router;
