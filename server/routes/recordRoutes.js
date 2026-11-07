
const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Save a health record
router.post("/", (req, res) => {
  try {
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

    // Basic required-field validation
    if (
      heart_rate == null ||
      systolic_bp == null ||
      diastolic_bp == null ||
      body_temperature == null
    ) {
      return res.status(400).json({
        success: false,
        message: "Heart rate, blood pressure and temperature are required.",
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
      symptoms ?? null
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

// Retrieve all health records
router.get("/", (req, res) => {
  try {
    const records = db.prepare(`
      SELECT * FROM health_records
      ORDER BY recorded_at DESC, id DESC
    `).all();

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

module.exports = router;
