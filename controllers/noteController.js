const bcrypt = require("bcrypt");
const NOTE = require("../models/noteModal");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createNote = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newNote = new NOTE({
      uid: req.user.id,
      title,
      description,
    });

    await newNote.save();

    res.status(201).json({
      message: "Note added successfully",
      user: {
        title,
        description,
      },
    });
  } catch (error) {
    console.error("Note adding error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const readNotes = (req, res) => {
  try {
    const { id } = req.body;
  } catch (error) {
    console.error("Note read error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createNote,
};
