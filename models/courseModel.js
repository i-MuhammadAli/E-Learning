const mongoose = require("mongoose");
const MODULE = require("./moduleModel");

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
    image: {
      type: String,
      default: "",
      validate: {
        validator: function () {
          return (
            !this.isPublished ||
            (this.isPublished && this.image && this.image.length > 0)
          );
        },
        message: "Image is required for publishing",
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
          if (this.isPublished) {
            return this.isFree ? this.price === 0 : this.price > 0;
          }
          return true;
        },
        message: "Price must be greater than 0 unless the course is not free",
      },
    },
    isFree: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

courseSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    await MODULE.deleteMany({ courseId: this._id });
    next();
  }
);

module.exports = mongoose.model("Course", courseSchema);
