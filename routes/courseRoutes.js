const express = require("express");
const {
  createCourse,
  updateCourse,
  publishCourse,
  unpublishCourse,
  deleteCourse,
} = require("../controllers/courseController");
const courseOwnership = require("../middlewares/courseOwnership");

const router = express.Router();

router.use("/:id", courseOwnership);

router.post("/create", createCourse);
router.patch("/:id", updateCourse);
router.patch("/:id/publish", publishCourse);
router.patch("/:id/unpublish", unpublishCourse);
router.delete("/:id", deleteCourse);

module.exports = router;
