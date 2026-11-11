
const express = require("express");
const router = express.Router();

const assessmentService = require("../services/assessmentService");
const baselineService = require("../services/baselineService");

// GET /api/assessment/baseline
router.get("/baseline", (req, res) => {
  try {
    const baseline = baselineService.getPersonalBaseline({
  excludeLatest: true,
});

    res.json({
      success: true,
      baseline,
    });
  } catch (error) {
    console.error("Baseline error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to calculate personal baseline.",
    });
  }
});

// GET /api/assessment/latest
router.get("/latest", (req, res) => {
  try {
    const result = assessmentService.getLatestAssessment();

    res.json(result);
  } catch (error) {
    console.error("Assessment error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to generate health assessment.",
    });
  }
});

module.exports = router;
