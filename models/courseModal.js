const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required."],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      validate: {
        validator: function () {
          return (
            !this.isPublished ||
            (this.description && this.description.length > 0)
          );
        },
        message: "Description is required for publishing.",
      },
    },
    image: {
      type: String,
      default: "",
      validate: {
        validator: function () {
          return !this.isPublished || (this.image && this.image.length > 0);
        },
        message: "Image is required for publishing.",
      },
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
      validate: {
        validator: function () {
          return !this.isPublished || (this.price && this.price > 0);
        },
        message: "Price must be greater than 0 for publishing.",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
