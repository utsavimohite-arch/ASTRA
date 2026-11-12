
const SCENARIOS = {
  normal: {
    name: "Nominal Mission Conditions",
    description: "A routine mission day with relatively stable environmental conditions.",
    radiationLevel: "Low",
    gravityCondition: "Microgravity",
    isolationLevel: "Low",
    sleepHours: 8,
    stressLevel: 2,
    heartRate: 72,
    systolicBP: 115,
    diastolicBP: 75,
    bodyTemperature: 36.7,
  },

  radiation: {
    name: "Elevated Radiation Exposure",
    description: "A simulated increase in the mission radiation exposure indicator.",
    radiationLevel: "Elevated",
    gravityCondition: "Microgravity",
    isolationLevel: "Low",
    sleepHours: 7,
    stressLevel: 3,
    heartRate: 76,
    systolicBP: 118,
    diastolicBP: 78,
    bodyTemperature: 36.8,
  },

  isolation: {
    name: "Extended Isolation",
    description: "A simulated period of increased isolation and confinement.",
    radiationLevel: "Low",
    gravityCondition: "Microgravity",
    isolationLevel: "High",
    sleepHours: 6,
    stressLevel: 7,
    heartRate: 82,
    systolicBP: 120,
    diastolicBP: 80,
    bodyTemperature: 36.7,
  },

  gravity: {
    name: "Altered Gravity Conditions",
    description: "A simulated mission phase involving altered gravity conditions.",
    radiationLevel: "Low",
    gravityCondition: "Altered Gravity",
    isolationLevel: "Moderate",
    sleepHours: 7,
    stressLevel: 4,
    heartRate: 78,
    systolicBP: 117,
    diastolicBP: 77,
    bodyTemperature: 36.8,
  },

  combined: {
    name: "Combined Mission Challenges",
    description: "A demonstration scenario combining several mission-environment challenges.",
    radiationLevel: "Elevated",
    gravityCondition: "Altered Gravity",
    isolationLevel: "High",
    sleepHours: 5,
    stressLevel: 8,
    heartRate: 88,
    systolicBP: 125,
    diastolicBP: 82,
    bodyTemperature: 36.9,
  },
};

function generateSimulation(scenarioName = "normal", missionDay = 1) {
  const scenario = SCENARIOS[scenarioName];

  if (!scenario) {
    throw new Error("Invalid simulation scenario.");
  }

  if (
    !Number.isInteger(missionDay) ||
    missionDay < 1 ||
    missionDay > 1000
  ) {
    throw new Error("Mission day must be an integer between 1 and 1000.");
  }

  return {
    success: true,
    simulation: {
      scenario: scenarioName,
      scenarioName: scenario.name,
      missionDay,
      generatedAt: new Date().toISOString(),

      environment: {
        radiationLevel: scenario.radiationLevel,
        gravityCondition: scenario.gravityCondition,
        isolationLevel: scenario.isolationLevel,
      },

      simulatedHealth: {
        heartRate: scenario.heartRate,
        systolicBP: scenario.systolicBP,
        diastolicBP: scenario.diastolicBP,
        bodyTemperature: scenario.bodyTemperature,
        sleepHours: scenario.sleepHours,
        stressLevel: scenario.stressLevel,
      },

      description: scenario.description,

      disclaimer:
        "DEMONSTRATION ONLY: These are synthetic values, not real astronaut measurements or clinically validated predictions. Mission conditions do not automatically cause the displayed health values. This simulation is not a medical diagnostic tool.",
    },
  };
}

function getAvailableScenarios() {
  return Object.entries(SCENARIOS).map(([id, scenario]) => ({
    id,
    name: scenario.name,
    description: scenario.description,
  }));
}

module.exports = {
  generateSimulation,
  getAvailableScenarios,
};
