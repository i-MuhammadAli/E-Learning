const COURSE = require("../models/courseModal");

const courseOwnership = async (req, res, next) => {
  const courseId = req.params.id;
  const userId = req.user?.userId;

  try {
    const course = await COURSE.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this course" });
    }

    req.course = course;
    next();
  } catch (error) {
    console.error("Course ownership check error:", error);
    return res.status(500).json({
      message: "Internal server error while checking course ownership",
    });
  }
};

module.exports = courseOwnership;
