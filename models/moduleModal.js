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
      default: "",
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

// const mongoose = require("mongoose");

// const moduleSchema = new mongoose.Schema(
//   {
//     courseId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Course",
//       required: true,
//     },
//     title: {
//       type: String,
//       required: [true, "Title is required"],
//       trim: true,
//     },
//     description: {
//       type: String,
//       default: "",
//     },
//     position: {
//       type: Number,
//       min: [0, "Position must be a positive number"],
//     },
//     isPublished: {
//       type: Boolean,
//       default: false,
//     },
//     isFree: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// moduleSchema.pre("save", function (next) {
//   if (this.isPublished) {
//     if (!this.description || !this.position) {
//       return next(new Error("All fields are required to publish the module."));
//     }
//   }
//   next();
// });

// module.exports = mongoose.model("Module", moduleSchema);
