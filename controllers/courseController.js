const COURSE = require("../models/courseModal");
require("dotenv").config();

const createCourse = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const course = new COURSE({
      userId: req.user.userId,
      title,
    });

    await course.save();

    res.status(201).json({
      message: "Course added successfully",
      course: {
        title,
      },
    });
  } catch (error) {
    console.error("course adding error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const publishCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.userId;

    const course = await COURSE.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to publish this course" });
    }

    if (course.isPublished) {
      return res.status(400).json({ message: "Course is already published" });
    }

    course.isPublished = true;

    await course.save();

    res.status(200).json({
      message: "Course published successfully",
      course,
    });
  } catch (error) {
    console.error("course publishing error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const unpublishCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.userId;

    const course = await COURSE.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to unpublish this course" });
    }

    if (!course.isPublished) {
      return res.status(400).json({ message: "Course is already unpublished" });
    }

    course.isPublished = false;

    await course.save();

    res.status(200).json({
      message: "Course unpublished successfully",
      course,
    });
  } catch (error) {
    console.error("course unpublishing error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createCourse,
  publishCourse,
  unpublishCourse,
};
