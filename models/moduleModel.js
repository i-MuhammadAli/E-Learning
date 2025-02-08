const mongoose = require("mongoose");
const CHAPTER = require("./chapterModel");

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
    position: {
      type: Number,
      required: [true, "Position is required"],
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

moduleSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    await CHAPTER.deleteMany({ moduleId: this._id });
    next();
  }
);

module.exports = mongoose.model("Module", moduleSchema);
