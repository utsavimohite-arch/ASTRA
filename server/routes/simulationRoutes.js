
const express = require("express");
const router = express.Router();

const simulationService = require("../services/simulationService");

// GET /api/simulation/scenarios
// Return all available mission scenarios.
router.get("/scenarios", (req, res) => {
  try {
    const scenarios = simulationService.getAvailableScenarios();

    res.json({
      success: true,
      count: scenarios.length,
      scenarios,
    });
  } catch (error) {
    console.error("Scenario retrieval error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve simulation scenarios.",
    });
  }
});

// GET /api/simulation/run?scenario=normal&missionDay=1
// Generate synthetic mission data.
router.get("/run", (req, res) => {
  try {
    const scenario = req.query.scenario || "normal";
    const missionDay = Number(req.query.missionDay || 1);

    const result = simulationService.generateSimulation(
      scenario,
      missionDay
    );

    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
