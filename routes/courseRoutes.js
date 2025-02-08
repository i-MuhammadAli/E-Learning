const express = require("express");
const {
  createCourse,
  updateCourse,
  publishCourse,
  unpublishCourse,
} = require("../controllers/courseController");
const courseOwnership = require("../middlewares/courseOwnership");

const router = express.Router();

router.use("/:id", courseOwnership);

router.post("/create", createCourse);
router.patch("/:id", updateCourse);
router.patch("/:id/publish", publishCourse);
router.patch("/:id/unpublish", unpublishCourse);

module.exports = router;
