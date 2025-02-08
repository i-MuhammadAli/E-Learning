const MODULE = require("../models/moduleModel");

const findModule = async (req, res, next) => {
  try {
    const moduleId = req.params.id;
    const module = await MODULE.findById(moduleId);

    if (!module) {
      return res
        .status(404)
        .json({ success: false, message: "Module not found" });
    }

    req.module = module;
    next();
  } catch (error) {
    console.error("Finding module error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = findModule;
