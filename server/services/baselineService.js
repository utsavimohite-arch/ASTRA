
const db = require("../database/db");

const MINIMUM_BASELINE_RECORDS = 3;

// Calculate the average of available numeric values
function calculateAverage(values) {
  const validValues = values.filter(
    (value) =>
      typeof value === "number" &&
      Number.isFinite(value)
  );

  if (validValues.length === 0) {
    return null;
  }

  const total = validValues.reduce(
    (sum, value) => sum + value,
    0
  );

  return Number((total / validValues.length).toFixed(2));
}

// Retrieve historical health records
function getHistoricalRecords() {
  return db.prepare(`
    SELECT *
    FROM health_records
    ORDER BY recorded_at ASC, id ASC
  `).all();
}

// Calculate the personal baseline
function calculatePersonalBaseline(records) {
  const sampleCount = records.length;
  const isReliable = sampleCount >= MINIMUM_BASELINE_RECORDS;

  return {
    sampleCount,
    minimumRequired: MINIMUM_BASELINE_RECORDS,
    isReliable,
    message: isReliable
      ? "Enough records are available to establish a demo baseline."
      : `At least ${MINIMUM_BASELINE_RECORDS} records are required to establish a demo baseline.`,

    heartRate: calculateAverage(
      records.map((record) => record.heart_rate)
    ),

    systolicBP: calculateAverage(
      records.map((record) => record.systolic_bp)
    ),

    diastolicBP: calculateAverage(
      records.map((record) => record.diastolic_bp)
    ),

    bodyTemperature: calculateAverage(
      records.map((record) => record.body_temperature)
    ),

    sleepHours: calculateAverage(
      records.map((record) => record.sleep_hours)
    ),

    stressLevel: calculateAverage(
      records.map((record) => record.stress_level)
    ),

    glucose: calculateAverage(
      records.map((record) => record.glucose)
    ),
  };
}

// Get the current personal baseline
function getPersonalBaseline(options = {}) {
  const records = getHistoricalRecords();

  // Exclude the latest record when calculating a historical reference.
  const baselineRecords = options.excludeLatest
    ? records.slice(0, -1)
    : records;

  return calculatePersonalBaseline(baselineRecords);
}

module.exports = {
  calculateAverage,
  calculatePersonalBaseline,
  getPersonalBaseline,
  MINIMUM_BASELINE_RECORDS,
};
