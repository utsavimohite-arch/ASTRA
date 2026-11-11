
const db = require("../database/db");
const baselineService = require("./baselineService");

// These are illustrative software-change indicators, NOT clinical thresholds.
const ASSESSMENT_RULES = [
  {
    key: "heart_rate",
    baselineKey: "heartRate",
    label: "Heart rate",
    unit: "bpm",
    method: "percentage",
    threshold: 15,
  },
  {
    key: "systolic_bp",
    baselineKey: "systolicBP",
    label: "Systolic blood pressure",
    unit: "mmHg",
    method: "percentage",
    threshold: 10,
  },
  {
    key: "diastolic_bp",
    baselineKey: "diastolicBP",
    label: "Diastolic blood pressure",
    unit: "mmHg",
    method: "percentage",
    threshold: 10,
  },
  {
    key: "body_temperature",
    baselineKey: "bodyTemperature",
    label: "Body temperature",
    unit: "°C",
    method: "absolute",
    threshold: 0.5,
  },
  {
    key: "sleep_hours",
    baselineKey: "sleepHours",
    label: "Sleep duration",
    unit: "hours",
    method: "percentage",
    threshold: 20,
  },
  {
    key: "stress_level",
    baselineKey: "stressLevel",
    label: "Stress level",
    unit: "/10",
    method: "absolute",
    threshold: 2,
  },
  {
    key: "glucose",
    baselineKey: "glucose",
    label: "Glucose",
    unit: "mg/dL",
    method: "percentage",
    threshold: 20,
  },
];

// Retrieve the most recent health record
function getLatestRecord() {
  return db.prepare(`
    SELECT *
    FROM health_records
    ORDER BY recorded_at DESC, id DESC
    LIMIT 1
  `).get();
}

// Compare one measurement with its personal baseline
function assessMetric(record, baseline, rule) {
  const latestValue = record[rule.key];
  const baselineValue = baseline[rule.baselineKey];

  if (
    latestValue === null ||
    latestValue === undefined ||
    baselineValue === null ||
    baselineValue === undefined
  ) {
    return {
      label: rule.label,
      status: "insufficient_data",
      message: "Not enough data to compare this measurement.",
    };
  }

  const difference = Number(
    (latestValue - baselineValue).toFixed(2)
  );

  let changeAmount;

  if (rule.method === "percentage") {
    if (baselineValue === 0) {
      return {
        label: rule.label,
        status: "insufficient_data",
        message: "A percentage comparison cannot be calculated.",
      };
    }

    changeAmount = Math.abs(
      (difference / baselineValue) * 100
    );
  } else {
    changeAmount = Math.abs(difference);
  }

  const isNotable = changeAmount >= rule.threshold;

  return {
    label: rule.label,
    unit: rule.unit,
    latestValue,
    baselineValue,
    difference,
    changeAmount: Number(changeAmount.toFixed(2)),
    status: isNotable ? "notable_change" : "close_to_reference",
    message: isNotable
      ? "This measurement differs noticeably from the personal baseline. Review the trend and relevant context."
      : "This measurement is close to the personal baseline.",
  };
}

// Generate an assessment for the latest record
function getLatestAssessment() {
  const latestRecord = getLatestRecord();

  if (!latestRecord) {
    return {
      success: true,
      status: "no_records",
      message: "No health records are available yet.",
      assessment: null,
    };
  }

  const baseline = baselineService.getPersonalBaseline({
  excludeLatest: true,
});

  if (!baseline.isReliable) {
    return {
      success: true,
      status: "insufficient_data",
      message: baseline.message,
      latestRecord,
      baseline,
      assessment: null,
    };
  }

  const metricResults = ASSESSMENT_RULES.map((rule) =>
    assessMetric(latestRecord, baseline, rule)
  );

  const hasNotableChanges = metricResults.some(
    (result) => result.status === "notable_change"
  );

  return {
    success: true,
    status: hasNotableChanges
      ? "review_suggested"
      : "no_notable_change",
    message: hasNotableChanges
      ? "One or more measurements differ noticeably from the personal baseline. Review the observations and mission medical protocols."
      : "No notable changes were identified by the current demo comparison rules.",
    latestRecord,
    baseline,
    assessment: {
      metrics: metricResults,
      rulesDisclaimer:
        "These illustrative comparison rules are for software demonstration only. They are not clinically validated thresholds, medical advice, or a diagnostic assessment.",
      additionalObservations: {
        mood: latestRecord.mood,
        symptoms: latestRecord.symptoms,
      },
    },
  };
}

module.exports = {
  getLatestRecord,
  getLatestAssessment,
};
