import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "./Dashboard.css";

import {
  DEFAULT_INPUT,
  FIELDS,
  SEASONS,
  SOILS,
} from "../utils/cropModel.js";

import { getPredictions } from "../services/predict.js";

export default function Dashboard() {
  const { user } = useAuth();

  const [input, setInput] = useState({ ...DEFAULT_INPUT });
  const [prediction, setPrediction] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (key, value) => {
    setInput((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPrediction(null);

    const keys = [
      "nitrogen",
      "phosphorus",
      "potassium",
      "temperature",
      "humidity",
      "ph",
      "rainfall",
    ];

    // Validate all seven ML model inputs.
    for (const key of keys) {
      const value = input[key];

      if (
        value === "" ||
        value === null ||
        value === undefined ||
        !Number.isFinite(Number(value))
      ) {
        setError(`Please enter a valid number for ${key}.`);
        return;
      }
    }

    setBusy(true);

    try {
      const result = await getPredictions(input);
      setPrediction(result);
    } catch (err) {
      setError(err.message || "Prediction failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleReset = () => {
    setInput({ ...DEFAULT_INPUT });
    setPrediction(null);
    setError("");
  };

  return (
    <>
      <Navbar />

      <main className="dash">
        <div className="dash-head">
          <h1>Crop Prediction</h1>
          <p className="muted">
            Hello {user?.username || "Farmer"}! Enter your soil and
            climate details to predict a suitable crop.
          </p>
        </div>

        <form className="panel stack-lg" onSubmit={handleSubmit}>
          <h2>Soil and Climate Details</h2>

          <div className="manual-input-grid">
            {FIELDS.map((field) => (
              <div className="manual-field" key={field.key}>
                <label htmlFor={field.key}>
                  {field.label}
                  {field.unit ? ` (${field.unit.trim()})` : ""}
                </label>

                <input
                  id={field.key}
                  type="number"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={input[field.key] ?? ""}
                  onChange={(e) =>
                    set(
                      field.key,
                      e.target.value === ""
                        ? ""
                        : Number(e.target.value)
                    )
                  }
                  required
                />

                {field.help && <small>{field.help}</small>}
              </div>
            ))}
          </div>

          <div className="manual-field">
            <label htmlFor="soil">Soil Type</label>
            <select
              id="soil"
              value={input.soil ?? ""}
              onChange={(e) => set("soil", e.target.value)}
            >
              {SOILS.map((soil) => (
                <option key={soil.id} value={soil.id}>
                  {soil.id}
                </option>
              ))}
            </select>
          </div>

          <div className="manual-field">
            <label htmlFor="season">Season</label>
            <select
              id="season"
              value={input.season ?? ""}
              onChange={(e) => set("season", e.target.value)}
            >
              {SEASONS.map((season) => (
                <option key={season.id} value={season.id}>
                  {season.id}
                </option>
              ))}
            </select>
          </div>

          <div className="actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={busy}
            >
              {busy ? "Predicting..." : "Predict Crop"}
            </button>

            <button
              type="button"
              className="btn btn-quiet"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </form>

        <section className="results" aria-live="polite">
          {error && (
            <p className="notice notice-error">{error}</p>
          )}

          {prediction && (
            <article className="result result-top">
              <h2>Recommended Crop</h2>
              <h3>
                {typeof prediction === "string"
                  ? prediction
                  : prediction.predicted_crop ??
                    JSON.stringify(prediction)}
              </h3>
            </article>
          )}
        </section>
      </main>
    </>
  );
}