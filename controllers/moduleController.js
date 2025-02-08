const MODULE = require("../models/moduleModal");

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

const createModule = async (req, res) => {
  try {
    const course = req.course;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const lastModule = await MODULE.findOne({ courseId: course.id })
      .sort({ position: -1 })
      .select("position");

    const newPosition = lastModule ? lastModule.position + 1 : 0;

    const module = new MODULE({
      courseId: course.id,
      title,
      position: newPosition,
    });

    await module.save();

    res.status(201).json({
      success: true,
      message: "Module added successfully",
      data: module,
    });
  } catch (error) {
    console.error("Module adding error:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
};

const readCourseModules = async (req, res) => {
  try {
    const course = req.course;

    const modules = await MODULE.find({ courseId: course.id });

    res.status(200).json({
      success: true,
      message: "Course modules retrieved successfully",
      data: modules,
    });
  } catch (error) {
    console.error("Error retrieving user modules:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const readModule = async (req, res) => {
  try {
    const module = req.module;

    res.status(200).json({
      success: true,
      message: "Module retrieved successfully",
      data: module,
    });
  } catch (error) {
    console.error("Module reading error: ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const updateModule = async (req, res) => {
  try {
    const module = req.module;

    const updatedModule = req.body;
    const allowedUpdates = ["title", "description", "isFree", "poisiton"];
    const attemptedUpdates = Object.keys(updatedModule);
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
      if (updatedModule[field] !== undefined) {
        module[field] = updatedModule[field];
      }
    }

    await module.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: module,
    });
  } catch (error) {
    console.error("Course updating error: ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const publishModule = async (req, res) => {
  try {
    const moduleId = req.params.id;
    const module = await MODULE.findById(moduleId);

    if (module.isPublished) {
      return res.status(400).json({
        success: false,
        message: "Module is already published",
      });
    }

    module.isPublished = true;
    await module.save();

    res.status(200).json({
      success: true,
      message: "Module published successfully",
      data: module,
    });
  } catch (error) {
    console.error("module publishing error: ", error);
    res.status(500).json({
      success: true,
      message: error.message || "Internal server error",
    });
  }
};

const unpublishModule = async (req, res) => {
  try {
    const course = req.course;
    const moduleId = req.params.id;
    const module = await MODULE.findById(moduleId);

    if (!module.isPublished) {
      return res
        .status(400)
        .json({ success: false, message: "Module is already unpublished" });
    }

    if (course.isPublished) {
      await unpublishCourse(course);
    }

    module.isPublished = false;
    await module.save();

    res.status(200).json({
      success: true,
      message: "Module unpublished successfully",
      data: module,
    });
  } catch (error) {
    console.error("module unpublishing error: ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const deleteModule = async (req, res) => {
  try {
    const course = req.course;
    const module = req.module;
    const deletedPosition = module.position;

    if (course.isPublished && module.isPublished) {
      await unpublishCourse(course);
    }

    await module.deleteOne();
    await MODULE.updateMany(
      { courseId: module.courseId, position: { $gt: deletedPosition } },
      { $inc: { position: -1 } }
    );

    res.status(200).json({
      success: true,
      message: "Module deleted successfully",
      data: module,
    });
  } catch (error) {
    console.error("Module deleting error: ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = {
  createModule,
  readCourseModules,
  readModule,
  updateModule,
  publishModule,
  unpublishModule,
  deleteModule,
};
