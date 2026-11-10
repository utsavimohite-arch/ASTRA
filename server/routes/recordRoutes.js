
const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Allowed mood options
const allowedMoods = ["Good", "Okay", "Low", "Anxious"];

// Validate numeric values
function isValidNumber(value, min, max) {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= min &&
    value <= max
  );
}

// Validate YYYY-MM-DD date format and actual calendar date
function isValidDate(date) {
  if (typeof date !== "string") return false;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;

  const parsed = new Date(`${date}T00:00:00.000Z`);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
  );
}

// =========================================
// POST: Save a health record
// =========================================

router.post("/", (req, res) => {
  try {
    if (
      !req.body ||
      typeof req.body !== "object" ||
      Array.isArray(req.body)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid health record data.",
      });
    }

    const {
      heart_rate,
      systolic_bp,
      diastolic_bp,
      body_temperature,
      glucose,
      sleep_hours,
      mood,
      stress_level,
      symptoms,
    } = req.body;

    if (
      heart_rate == null ||
      systolic_bp == null ||
      diastolic_bp == null ||
      body_temperature == null
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Heart rate, blood pressure and body temperature are required.",
      });
    }

    if (!isValidNumber(heart_rate, 1, 300)) {
      return res.status(400).json({
        success: false,
        message: "Heart rate must be a number between 1 and 300.",
      });
    }

    if (!isValidNumber(systolic_bp, 1, 300)) {
      return res.status(400).json({
        success: false,
        message: "Systolic blood pressure must be between 1 and 300.",
      });
    }

    if (!isValidNumber(diastolic_bp, 1, 300)) {
      return res.status(400).json({
        success: false,
        message: "Diastolic blood pressure must be between 1 and 300.",
      });
    }

    if (!isValidNumber(body_temperature, 25, 45)) {
      return res.status(400).json({
        success: false,
        message: "Body temperature must be between 25 and 45 °C.",
      });
    }

    if (
      glucose != null &&
      !isValidNumber(glucose, 1, 1000)
    ) {
      return res.status(400).json({
        success: false,
        message: "Glucose must be a valid positive number.",
      });
    }

    if (
      sleep_hours != null &&
      !isValidNumber(sleep_hours, 0, 24)
    ) {
      return res.status(400).json({
        success: false,
        message: "Sleep duration must be between 0 and 24 hours.",
      });
    }

    if (
      mood != null &&
      (typeof mood !== "string" || !allowedMoods.includes(mood))
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid mood.",
      });
    }

    if (
      stress_level != null &&
      (
        !Number.isInteger(stress_level) ||
        stress_level < 1 ||
        stress_level > 10
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Stress level must be an integer between 1 and 10.",
      });
    }

    if (
      symptoms != null &&
      (
        typeof symptoms !== "string" ||
        symptoms.length > 1000
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Symptoms must be text with a maximum of 1000 characters.",
      });
    }

    const insert = db.prepare(`
      INSERT INTO health_records (
        heart_rate,
        systolic_bp,
        diastolic_bp,
        body_temperature,
        glucose,
        sleep_hours,
        mood,
        stress_level,
        symptoms
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      heart_rate,
      systolic_bp,
      diastolic_bp,
      body_temperature,
      glucose ?? null,
      sleep_hours ?? null,
      mood ?? null,
      stress_level ?? null,
      symptoms?.trim() || null
    );

    res.status(201).json({
      success: true,
      message: "Health record saved successfully!",
      recordId: result.lastInsertRowid,
    });

  } catch (error) {
    console.error("Error saving health record:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save health record.",
    });
  }
});

// =========================================
// GET: Retrieve, search and filter records
// =========================================

router.get("/", (req, res) => {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const fromDate =
      typeof req.query.fromDate === "string"
        ? req.query.fromDate.trim()
        : "";

    const toDate =
      typeof req.query.toDate === "string"
        ? req.query.toDate.trim()
        : "";

    // Validate date inputs
    if (fromDate && !isValidDate(fromDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid fromDate. Use YYYY-MM-DD format.",
      });
    }

    if (toDate && !isValidDate(toDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid toDate. Use YYYY-MM-DD format.",
      });
    }

    if (fromDate && toDate && fromDate > toDate) {
      return res.status(400).json({
        success: false,
        message: "From date cannot be later than to date.",
      });
    }

    let query = `
      SELECT * FROM health_records
      WHERE 1 = 1
    `;

    const params = [];

    // Search across record fields
    if (search) {
      const pattern = `%${search}%`;

      query += `
        AND (
          CAST(id AS TEXT) LIKE ?
          OR CAST(heart_rate AS TEXT) LIKE ?
          OR CAST(systolic_bp AS TEXT) LIKE ?
          OR CAST(diastolic_bp AS TEXT) LIKE ?
          OR CAST(body_temperature AS TEXT) LIKE ?
          OR COALESCE(mood, '') LIKE ?
          OR COALESCE(symptoms, '') LIKE ?
        )
      `;

      params.push(
        pattern,
        pattern,
        pattern,
        pattern,
        pattern,
        pattern,
        pattern
      );
    }

    // Filter from the selected date
    if (fromDate) {
      query += `
        AND date(recorded_at) >= date(?)
      `;

      params.push(fromDate);
    }

    // Filter until the selected date
    if (toDate) {
      query += `
        AND date(recorded_at) <= date(?)
      `;

      params.push(toDate);
    }

    query += `
      ORDER BY recorded_at DESC, id DESC
    `;

    const records = db.prepare(query).all(...params);

    res.json({
      success: true,
      count: records.length,
      records,
    });

  } catch (error) {
    console.error("Error retrieving health records:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve health records.",
    });
  }
});

 // =========================================
 // DELETE: Remove a health record
 // =========================================

router.delete("/:id", (req, res) => {
  try {
    const recordId = Number(req.params.id);

    // Validate record ID
    if (!Number.isInteger(recordId) || recordId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid health record ID.",
      });
    }

    // Delete the selected record
    const result = db.prepare(`
      DELETE FROM health_records
      WHERE id = ?
    `).run(recordId);

    // Check whether the record existed
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Health record not found.",
      });
    }

    res.json({
      success: true,
      message: "Health record deleted successfully!",
      recordId,
    });

  } catch (error) {
    console.error("Error deleting health record:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete health record.",
    });
  }
});

module.exports = router;
