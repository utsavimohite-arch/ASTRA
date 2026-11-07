
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

// Retrieve all saved health records
export function getHealthRecords() {
  return apiRequest("/records");
}
