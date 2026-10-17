const API_URL = "http://127.0.0.1:8000/crop/predict/";

export async function getPredictions(input) {
  const keys = [
    "nitrogen",
    "phosphorus",
    "potassium",
    "temperature",
    "humidity",
    "ph",
    "rainfall",
  ];

  const payload = {};

  // Validate and convert input values
  for (const key of keys) {
    const value = input[key];

    if (
      value === "" ||
      value === null ||
      value === undefined ||
      !Number.isFinite(Number(value))
    ) {
      throw new Error(`Please enter a valid number for ${key}.`);
    }

    payload[key] = Number(value);
  }

  // Get JWT access token for prediction history
  const accessToken = localStorage.getItem("access");

  const headers = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log("Django response:", response.status, data);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          "Your session may have expired. Please log in again."
        );
      }

      throw new Error(
        data.details ||
        data.detail ||
        JSON.stringify(data) ||
        "Prediction failed."
      );
    }

    if (!data.predicted_crop) {
      throw new Error("The backend did not return a predicted crop.");
    }

    return data.predicted_crop;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Cannot connect to Django. Please check that the backend server is running."
      );
    }

    throw error;
  }
}