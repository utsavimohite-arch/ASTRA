
const db = require("../database/db");
const assessmentService = require("./assessmentService");

// Generate understandable guidance for each assessment result.
// These are software guidance categories, not medical severity levels.
function getGuidance(metric) {
  const guidance = {
    "Heart rate": {
      category: "Review observation",
      actions: [
        "Review the measurement and confirm it was recorded correctly.",
        "Consider recent activity, rest, and mission conditions.",
        "Record any related symptoms.",
        "Follow mission medical protocols if the change persists or is concerning.",
      ],
    },

    "Systolic blood pressure": {
      category: "Review observation",
      actions: [
        "Verify the measurement and recording conditions.",
        "Repeat the measurement according to the approved measurement procedure.",
        "Review the observation alongside other health indicators.",
        "Consult qualified mission medical personnel according to mission protocols.",
      ],
    },

    "Diastolic blood pressure": {
      category: "Review observation",
      actions: [
        "Verify the measurement and recording conditions.",
        "Repeat the measurement according to the approved measurement procedure.",
        "Review the observation alongside other health indicators.",
        "Consult qualified mission medical personnel according to mission protocols.",
      ],
    },

    "Body temperature": {
      category: "Review observation",
      actions: [
        "Check that the temperature was recorded correctly.",
        "Review the measurement method and surrounding conditions.",
        "Record any accompanying symptoms.",
        "Follow mission medical protocols if the observation is concerning.",
      ],
    },

    "Sleep duration": {
      category: "Review observation",
      actions: [
        "Review recent sleep duration and sleep quality.",
        "Consider workload, schedule changes, and environmental conditions.",
        "Record changes in fatigue or concentration.",
        "Discuss persistent sleep difficulties with mission medical personnel.",
      ],
    },

    "Stress level": {
      category: "Review observation",
      actions: [
        "Review recent workload and mission conditions.",
        "Consider appropriate rest and relaxation activities.",
        "Record changes in mood or stress.",
        "Seek support through the available mission behavioral-health resources.",
      ],
    },

    "Glucose": {
      category: "Review observation",
      actions: [
        "Verify the measurement and recording method.",
        "Consider meal timing and other relevant context.",
        "Record any accompanying symptoms.",
        "Follow mission medical protocols for concerning measurements.",
      ],
    },
  };

  return guidance[metric.label] || {
    category: "Review observation",
    actions: [
      "Review the measurement.",
      "Check the recorded health history.",
      "Follow applicable mission medical protocols.",
    ],
  };
}

// Save alerts without creating duplicates.
function saveAlertHistory(alerts) {
  const findExisting = db.prepare(`
    SELECT id
    FROM alert_history
    WHERE metric = ?
      AND recorded_at IS ?
      AND latest_value IS ?
      AND baseline_value IS ?
  `);

  const insertAlert = db.prepare(`
    INSERT INTO alert_history (
      metric,
      latest_value,
      baseline_value,
      difference,
      unit,
      category,
      message,
      recommended_actions,
      recorded_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const saveTransaction = db.transaction((items) => {
    let savedCount = 0;

    for (const alert of items) {
      const existing = findExisting.get(
        alert.metric,
        alert.recordedAt,
        alert.latestValue,
        alert.baselineValue
      );

      if (existing) continue;

      insertAlert.run(
        alert.metric,
        alert.latestValue,
        alert.baselineValue,
        alert.difference,
        alert.unit,
        alert.category,
        alert.message,
        JSON.stringify(alert.recommendedActions),
        alert.recordedAt
      );

      savedCount++;
    }

    return savedCount;
  });

  return saveTransaction(alerts);
}

// Generate alerts from the latest assessment.
function generateAlerts() {
  const result = assessmentService.getLatestAssessment();

  if (
    !result.assessment ||
    !Array.isArray(result.assessment.metrics)
  ) {
    return {
      success: true,
      status: result.status,
      message: result.message,
      alertCount: 0,
      alerts: [],
    };
  }

  const alerts = result.assessment.metrics
    .filter((metric) => metric.status === "notable_change")
    .map((metric) => {
      const guidance = getGuidance(metric);

      return {
        metric: metric.label,
        latestValue: metric.latestValue,
        baselineValue: metric.baselineValue,
        difference: metric.difference,
        unit: metric.unit,
        category: guidance.category,
        message: metric.message,
        recommendedActions: guidance.actions,
        recordedAt: result.latestRecord.recorded_at,
      };
    });

  // Store newly generated alerts in local SQLite history.
  const savedCount = saveAlertHistory(alerts);

  return {
    success: true,
    status: alerts.length > 0
      ? "review_suggested"
      : "no_notable_changes",
    message: alerts.length > 0
      ? "Some measurements differ noticeably from the personal baseline. Review the observations and recommended actions."
      : "No notable changes were identified by the current demo comparison rules.",
    alertCount: alerts.length,
    alerts,
    historySaved: savedCount,
    disclaimer:
      "Alerts are generated using illustrative software comparison rules. They are not clinically validated severity classifications, medical diagnoses, or emergency detection. Follow mission medical protocols.",
  };
}

// Retrieve previously saved alerts from SQLite.
function getAlertHistory() {
  const history = db.prepare(`
    SELECT *
    FROM alert_history
    ORDER BY created_at DESC, id DESC
  `).all();

  return history.map((alert) => ({
    ...alert,
    recommended_actions: JSON.parse(
      alert.recommended_actions || "[]"
    ),
  }));
}

module.exports = {
  generateAlerts,
  getGuidance,
  getAlertHistory,
};
