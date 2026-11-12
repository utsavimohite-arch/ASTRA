
const API_BASE_URL = "http://localhost:5000/api";

// Reusable function for communicating with the backend
async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

// Check backend connection
export function checkBackend() {
  return apiRequest("/health");
}

// Save a new health record
export function saveHealthRecord(record) {
  return apiRequest("/records", {
    method: "POST",
    body: JSON.stringify(record),
  });
}

// Retrieve health records with search and date filters
export function getHealthRecords(search = "", fromDate = "", toDate = "") {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (fromDate) params.append("fromDate", fromDate);
  if (toDate) params.append("toDate", toDate);

  const query = params.toString()
    ? `?${params.toString()}`
    : "";

  return apiRequest(`/records${query}`);
}

// Delete a health record
export function deleteHealthRecord(id) {
  return apiRequest(`/records/${id}`, {
    method: "DELETE",
  });
}

// Fetch the personal health baseline
export function getHealthBaseline() {
  return apiRequest("/assessment/baseline");
}

// Fetch the latest health assessment
export function getLatestAssessment() {
  return apiRequest("/assessment/latest");
}

// Fetch health alerts and recommended actions
export function getHealthAlerts() {
  return apiRequest("/alerts");
}
// Fetch previously saved health alert history
export function getAlertHistory() {
  return apiRequest("/alerts/history");
}

// Mission simulation APIs
export function getSimulationScenarios() {
  return apiRequest("/simulation/scenarios");
}

export function runMissionSimulation(scenario = "normal", missionDay = 1) {
  const params = new URLSearchParams({
    scenario,
    missionDay: String(missionDay),
  });

  return apiRequest(`/simulation/run?${params.toString()}`);
}
