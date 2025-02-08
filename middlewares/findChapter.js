const CHAPTER = require("../models/chapterModel");

const findChapter = async (req, res, next) => {
  try {
    const chapterId = req.params.id;
    const chapter = await CHAPTER.findById(chapterId);

    if (!chapter) {
      return res
        .status(404)
        .json({ success: false, message: "Chapter not found" });
    }

    req.chapter = chapter;
    next();
  } catch (error) {
    console.error("Finding chapter error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = findChapter;
