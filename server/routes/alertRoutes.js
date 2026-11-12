
const express = require("express");
const router = express.Router();

const alertService = require("../services/alertService");

// GET /api/alerts
// Generate alerts from the latest assessment.
router.get("/", (req, res) => {
  try {
    const result = alertService.generateAlerts();
    res.json(result);
  } catch (error) {
    console.error("Alert generation error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to generate health alerts.",
    });
  }
});

// GET /api/alerts/history
// Retrieve previously saved alerts.
router.get("/history", (req, res) => {
  try {
    const history = alertService.getAlertHistory();

    res.json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    console.error("Alert history error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve alert history.",
    });
  }
});

module.exports = router;
