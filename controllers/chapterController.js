const MODULE = require("../models/moduleModel");
const CHAPTER = require("../models/chapterModel");

const unpublishCourse = async (course) => {
  try {
    const remainingPublishedModules = await MODULE.countDocuments({
      courseId: course._id,
      isPublished: true,
    });

    if (remainingPublishedModules === 1) {
      course.isPublished = false;
      await course.save();
    }
  } catch (error) {
    console.error("Error unpublishing course:", error);
    throw new Error(
      error.message ||
        "Error occured while unpublishing course (1 module must be published for course to be published)"
    );
  }
};

const unpublishModule = async (course, module) => {
  try {
    const remainingPublishedChapter = await CHAPTER.countDocuments({
      moduleId: module._id,
      isPublished: true,
    });

    if (remainingPublishedChapter === 1) {
      if (course.isPublished) {
        await unpublishCourse(course);
      }
      module.isPublished = false;
      await module.save();
    }
  } catch (error) {
    console.error("Error unpublishing module:", error);
    throw new Error(
      error.message ||
        "Error occured while unpublishing module (1 chapter must be published for module to be published)"
    );
  }
};

const createChapter = async (req, res) => {
  try {
    const module = req.module;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const lastChapter = await CHAPTER.findOne({ moduleId: module.id })
      .sort({ position: -1 })
      .select("position");

    const newPosition = lastChapter ? lastChapter.position + 1 : 0;

    const chapter = new CHAPTER({
      moduleId: module.id,
      title,
      position: newPosition,
    });

    await chapter.save();

    res.status(201).json({
      success: true,
      message: "Chapter added successfully",
      data: chapter,
    });
  } catch (error) {
    console.error("Chapter adding error:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
};

const readModuleChapters = async (req, res) => {
  try {
    const module = req.module;

    const chapters = await CHAPTER.find({ moduleId: module.id });

    res.status(200).json({
      success: true,
      message: "Module chapters retrieved successfully",
      data: chapters,
    });
  } catch (error) {
    console.error("Error retrieving user chapters:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const readChapter = async (req, res) => {
  try {
    const chapter = req.chapter;

    res.status(200).json({
      success: true,
      message: "Chapter retrieved successfully",
      data: chapter,
    });
  } catch (error) {
    console.error("Chapter reading error: ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const updateChapter = async (req, res) => {
  try {
    const chapter = req.chapter;

    const updatedChapter = req.body;
    const allowedUpdates = [
      "title",
      "description",
      "video",
      "isFree",
      "poisiton",
    ];
    const attemptedUpdates = Object.keys(updatedChapter);
    const invalidFields = attemptedUpdates.filter(
      (field) => !allowedUpdates.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid update fields: ${invalidFields.join(", ")}`,
      });
    }

    for (const field of allowedUpdates) {
      if (updatedChapter[field] !== undefined) {
        chapter[field] = updatedChapter[field];
      }
    }

    await chapter.save();

    res.status(200).json({
      success: true,
      message: "Chapter updated successfully",
      data: chapter,
    });
  } catch (error) {
    console.error("Chapter updating error: ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const publishChapter = async (req, res) => {
  try {
    const { chapter } = req;

    if (chapter.isPublished) {
      return res.status(400).json({
        success: false,
        message: "Chapter is already published",
      });
    }

    chapter.isPublished = true;
    await chapter.save();

    res.status(200).json({
      success: true,
      message: "Chapter published successfully",
      data: chapter,
    });
  } catch (error) {
    console.error("Chapter publishing error: ", error);
    res.status(500).json({
      success: true,
      message: error.message || "Internal server error",
    });
  }
};

const unpublishChapter = async (req, res) => {
  try {
    const { course, module, chapter } = req;

    if (!chapter.isPublished) {
      return res
        .status(400)
        .json({ success: false, message: "Chapter is already unpublished" });
    }

    if (module.isPublished) {
      await unpublishModule(course, module);
    }

    chapter.isPublished = false;
    await chapter.save();

    res.status(200).json({
      success: true,
      message: "Chapter unpublished successfully",
      data: chapter,
    });
  } catch (error) {
    console.error("Chapter unpublishing error: ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const deleteChapter = async (req, res) => {
  try {
    const { course, module, chapter } = req;
    const deletedPosition = chapter.position;

    if (module.isPublished && chapter.isPublished) {
      await unpublishModule(course, module);
    }

    await chapter.deleteOne();
    await CHAPTER.updateMany(
      { courseId: chapter.courseId, position: { $gt: deletedPosition } },
      { $inc: { position: -1 } }
    );

    res.status(200).json({
      success: true,
      message: "Chapter deleted successfully",
      data: chapter,
    });
  } catch (error) {
    console.error("Chapter deleting error: ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = {
  createChapter,
  readModuleChapters,
  readChapter,
  updateChapter,
  publishChapter,
  unpublishChapter,
  deleteChapter,
};
