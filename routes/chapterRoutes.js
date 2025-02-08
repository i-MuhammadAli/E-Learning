const express = require("express");
const {
  createChapter,
  readModuleChapters,
  readChapter,
  updateChapter,
  publishChapter,
  unpublishChapter,
  deleteChapter,
} = require("../controllers/chapterController");
const findChapter = require("../middlewares/findChapter");

const router = express.Router();

router.use("/:id", findChapter);

router.post("/", createChapter);
router.get("/", readModuleChapters);
router.get("/:id", readChapter);
router.patch("/:id", updateChapter);
router.patch("/:id/publish", publishChapter);
router.patch("/:id/unpublish", unpublishChapter);
router.delete("/:id", deleteChapter);

module.exports = router;
