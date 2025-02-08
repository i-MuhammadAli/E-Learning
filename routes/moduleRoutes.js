const express = require("express");
const {
  createModule,
  readCourseModules,
  readModule,
  updateModule,
  publishModule,
  unpublishModule,
  deleteModule,
} = require("../controllers/moduleController");
const findModule = require("../middlewares/findModule");

const router = express.Router();

router.use("/:id", findModule);

router.post("/", createModule);
router.get("/", readCourseModules);
router.get("/:id", readModule);
router.patch("/:id", updateModule);
router.patch("/:id/publish", publishModule);
router.patch("/:id/unpublish", unpublishModule);
router.delete("/:id", deleteModule);

module.exports = router;
