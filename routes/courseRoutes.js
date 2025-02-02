const express = require("express");
const authenticateJWT = require("../middlewares/authenticateJWT");
const {
  createCourse,
  updateCourse,
  publishCourse,
  unpublishCourse,
} = require("../controllers/courseController");
const courseOwnership = require("../middlewares/courseOwnership");

const router = express.Router();

router.post("/create", authenticateJWT, createCourse);
router.patch("/:id/update", authenticateJWT, courseOwnership, updateCourse);
router.patch("/:id/publish", authenticateJWT, courseOwnership, publishCourse);
router.patch(
  "/:id/unpublish",
  authenticateJWT,
  courseOwnership,
  unpublishCourse
);

module.exports = router;
