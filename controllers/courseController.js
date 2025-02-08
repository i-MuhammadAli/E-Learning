const COURSE = require("../models/courseModel");

const createCourse = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const course = new COURSE({
      userId: req.user.userId,
      title,
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: "Course added successfully",
      data: course,
    });
  } catch (error) {
    console.error("course adding error: ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const readUserCourses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const courses = await COURSE.find({ userId });

    res.status(200).json({
      success: true,
      message: "User courses retrieved successfully",
      data: courses,
    });
  } catch (error) {
    console.error("Error retrieving user courses:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const readCourse = async (req, res) => {
  try {
    const course = req.course;

    res.status(200).json({
      success: true,
      message: "Course retrieved successfully",
      data: course,
    });
  } catch (error) {
    console.error("Course reading error: ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = req.course;
    const updatedCourse = req.body;

    const allowedUpdates = ["title", "description", "image", "isFree", "price"];
    const attemptedUpdates = Object.keys(updatedCourse);
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
      if (updatedCourse[field] !== undefined) {
        course[field] = updatedCourse[field];
      }
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error("Course updating error: ", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
};

const publishCourse = async (req, res) => {
  try {
    const course = req.course;

    if (course.isPublished) {
      return res.status(400).json({
        success: false,
        message: "Course is already published",
      });
    }

    course.isPublished = true;

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course published successfully",
      data: course,
    });
  } catch (error) {
    console.error("course publishing error: ", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
};

const unpublishCourse = async (req, res) => {
  try {
    const course = req.course;

    if (!course.isPublished) {
      return res.status(400).json({
        success: false,
        message: "Course is already unpublished",
      });
    }

    course.isPublished = false;

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course unpublished successfully",
      data: course,
    });
  } catch (error) {
    console.error("course unpublishing error: ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = req.course;

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: course,
    });
  } catch (error) {
    console.error("course deleting error: ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = {
  createCourse,
  readUserCourses,
  readCourse,
  updateCourse,
  publishCourse,
  unpublishCourse,
  deleteCourse,
};
