const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
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

// chapterSchema.pre("save", async function (next) {
//   if (this.isModified("isPublished") && !this.isPublished) {
//     const remainingPublishedModules = await this.constructor.countDocuments({
//       moduleId: this.moduleId,
//       isPublished: true,
//     });

//     if (remainingPublishedModules === 1) {
//       const MODULE = mongoose.model("Module");
//       await MODULE.findByIdAndUpdate(this.moduleId, { isPublished: false });
//     }
//   }
//   next();
// });

module.exports = mongoose.model("Chapter", chapterSchema);
