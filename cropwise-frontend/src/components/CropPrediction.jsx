import { useState } from "react";

const API_URL = "http://127.0.0.1:8000/crop/predict/";

export default function CropPrediction() {
  const [form, setForm] = useState({
    nitrogen: "90",
    phosphorus: "42",
    potassium: "43",
    temperature: "20.87",
    humidity: "82",
    ph: "6.5",
    rainfall: "202.9",
  });

  const [prediction, setPrediction] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setPrediction("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          Object.fromEntries(
            Object.entries(form).map(([key, value]) => [
              key,
              Number(value),
            ])
          )
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || JSON.stringify(data)
        );
      }

      setPrediction(data.predicted_crop);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Crop Prediction</h2>

      <form onSubmit={handleSubmit}>
        {Object.entries(form).map(([key, value]) => (
          <div key={key} style={{ marginBottom: "12px" }}>
            <label>
              {key.charAt(0).toUpperCase() + key.slice(1)}
              {" "}
              <input
                type="number"
                name={key}
                value={value}
                onChange={handleChange}
                step="any"
                required
              />
            </label>
          </div>
        ))}

        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict Crop"}
        </button>
      </form>

      {prediction && (
        <h3>Recommended Crop: {prediction}</h3>
      )}

      {error && (
        <p style={{ color: "red" }}>Error: {error}</p>
      )}
    </div>
  );
}