const COURSE = require("../models/courseModal");
require("dotenv").config();

const createCourse = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newCourse = new COURSE({
      userId: req.user.userId,
      title,
    });

    await newCourse.save();

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

module.exports = {
  createCourse,
};
