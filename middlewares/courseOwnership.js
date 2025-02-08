const COURSE = require("../models/courseModel");

const courseOwnership = async (req, res, next) => {
  const courseId = req.params.id;
  const userId = req.user?.userId;

  try {
    const course = await COURSE.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    if (course.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this course",
      });
    }

    req.course = course;
    next();
  } catch (error) {
    console.error("Course ownership check error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = courseOwnership;
