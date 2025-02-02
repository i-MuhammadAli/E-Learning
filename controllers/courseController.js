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

const updateCourse = async (req, res) => {
  try {
    const course = req.course;
    const updatedCourse = req.body;

    const allowedUpdates = ["title", "description", "image", "isFree", "price"];

    for (const field of allowedUpdates) {
      if (updatedCourse[field] !== undefined) {
        course[field] = updatedCourse[field];
      }
    }

    await course.save();

    res.status(200).json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Course updating error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const publishCourse = async (req, res) => {
  try {
    const course = req.course;

    if (course.isPublished) {
      return res.status(400).json({ message: "Course is already published" });
    }

    if (
      !course.title ||
      !course.description ||
      !course.image ||
      (!course.isFree && !course.price)
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
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
    const course = req.course;

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
  updateCourse,
  publishCourse,
  unpublishCourse,
};
