const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: function () {
          return (
            !this.isPublished ||
            (this.isPublished &&
              this.description &&
              this.description.length > 0)
          );
        },
        message: "Description is required for publishing",
      },
    },
    video: {
      type: String,
      default: "",
      validate: {
        validator: function () {
          return (
            !this.isPublished ||
            (this.isPublished && this.video && this.video.length > 0)
          );
        },
        message: "Video is required for publishing",
      },
    },
    position: {
      type: Number,
      min: [0, "Position must be a positive number"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Module", moduleSchema);
