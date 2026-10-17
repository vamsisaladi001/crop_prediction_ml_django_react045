/*
 * Rule-based crop suitability model.
 * Each crop has ideal ranges for soil, pH, nutrients, water, temperature,
 * humidity and season. Every factor is scored 0–1 and combined with weights.
 * The values are general agronomy guidelines — tune them for your region,
 * or replace predictCrops() with a trained ML model behind an API.
 */

export const SOILS = [
  { id: "Alluvial", color: "#B79B6E", hint: "River plains, fertile" },
  { id: "Black", color: "#2B2623", hint: "Holds moisture well" },
  { id: "Red", color: "#A44A32", hint: "Iron-rich, drains fast" },
  { id: "Laterite", color: "#B5653D", hint: "Acidic, leached" },
  { id: "Sandy", color: "#E0C48A", hint: "Light, low water hold" },
  { id: "Clay", color: "#7C6A5A", hint: "Heavy, waterlogs" },
  { id: "Loamy", color: "#6B4A32", hint: "Balanced mix" },
];

export const SEASONS = [
  { id: "Kharif", hint: "Jun – Oct, monsoon" },
  { id: "Rabi", hint: "Nov – Mar, winter" },
  { id: "Zaid", hint: "Mar – Jun, summer" },
];

export const FIELDS = [
  { key: "ph", label: "Soil pH", min: 3.5, max: 9.5, step: 0.1, unit: "" },
  { key: "n", label: "Nitrogen (N)", min: 0, max: 140, step: 1, unit: " kg/ha" },
  { key: "p", label: "Phosphorus (P)", min: 5, max: 145, step: 1, unit: " kg/ha" },
  { key: "k", label: "Potassium (K)", min: 5, max: 205, step: 1, unit: " kg/ha" },
  { key: "water", label: "Water available this season", min: 100, max: 3000, step: 10, unit: " mm", help: "Rainfall plus irrigation" },
  { key: "temp", label: "Average temperature", min: 5, max: 45, step: 1, unit: " °C" },
  { key: "humidity", label: "Relative humidity", min: 10, max: 100, step: 1, unit: " %" },
];

export const DEFAULT_INPUT = {
  nitrogen: 90,
  phosphorus: 42,
  potassium: 43,
  temperature: 20.8,
  humidity: 82,
  ph: 6.5,
  rainfall: 202.9,
  soil: "Loamy",
  season: "Kharif",
};


const ALL = ["Kharif", "Rabi", "Zaid"];

const CROPS = [
  { name: "Rice", soils: [["Alluvial", "Clay"], ["Loamy", "Black"]], ph: [5.5, 7], n: [60, 120], p: [30, 60], k: [30, 60], water: [1000, 2000], temp: [22, 32], humidity: [70, 95], seasons: ["Kharif"] },
  { name: "Wheat", soils: [["Alluvial", "Loamy"], ["Clay", "Black"]], ph: [6, 7.5], n: [80, 120], p: [40, 60], k: [30, 50], water: [400, 800], temp: [12, 25], humidity: [50, 70], seasons: ["Rabi"] },
  { name: "Maize", soils: [["Loamy", "Alluvial"], ["Red", "Sandy"]], ph: [5.8, 7.2], n: [80, 140], p: [40, 70], k: [30, 60], water: [500, 900], temp: [18, 30], humidity: [55, 75], seasons: ["Kharif", "Rabi"] },
  { name: "Cotton", soils: [["Black"], ["Alluvial", "Red"]], ph: [6, 8], n: [80, 120], p: [30, 60], k: [30, 60], water: [600, 1100], temp: [21, 32], humidity: [50, 75], seasons: ["Kharif"] },
  { name: "Sugarcane", soils: [["Alluvial", "Loamy", "Black"], ["Clay", "Red"]], ph: [6, 7.5], n: [100, 140], p: [40, 70], k: [50, 100], water: [1200, 2200], temp: [24, 35], humidity: [65, 85], seasons: ["Kharif", "Zaid"] },
  { name: "Groundnut", soils: [["Sandy", "Red"], ["Loamy", "Laterite"]], ph: [5.8, 7], n: [15, 40], p: [30, 60], k: [30, 60], water: [500, 900], temp: [24, 33], humidity: [50, 70], seasons: ["Kharif", "Rabi"] },
  { name: "Chickpea", soils: [["Black", "Loamy"], ["Alluvial", "Sandy"]], ph: [6, 8], n: [20, 50], p: [40, 70], k: [30, 60], water: [300, 600], temp: [15, 28], humidity: [40, 65], seasons: ["Rabi"] },
  { name: "Pearl millet (Bajra)", soils: [["Sandy", "Red"], ["Laterite", "Loamy"]], ph: [6, 8], n: [40, 80], p: [20, 40], k: [20, 40], water: [250, 600], temp: [25, 35], humidity: [35, 60], seasons: ["Kharif", "Zaid"] },
  { name: "Soybean", soils: [["Black", "Loamy"], ["Alluvial", "Red"]], ph: [6, 7.5], n: [20, 50], p: [40, 70], k: [40, 70], water: [600, 1000], temp: [22, 30], humidity: [60, 80], seasons: ["Kharif"] },
  { name: "Mustard", soils: [["Alluvial", "Loamy", "Sandy"], ["Black"]], ph: [6, 7.5], n: [60, 100], p: [30, 50], k: [20, 40], water: [300, 500], temp: [10, 25], humidity: [40, 60], seasons: ["Rabi"] },
  { name: "Banana", soils: [["Alluvial", "Loamy"], ["Black", "Clay"]], ph: [6, 7.5], n: [100, 140], p: [40, 70], k: [100, 200], water: [1200, 2000], temp: [24, 33], humidity: [70, 90], seasons: ALL },
  { name: "Chilli", soils: [["Red", "Black"], ["Loamy", "Alluvial"]], ph: [6, 7.5], n: [60, 100], p: [40, 70], k: [40, 70], water: [600, 1200], temp: [20, 30], humidity: [55, 75], seasons: ["Kharif", "Rabi"] },
  { name: "Pigeon pea (Redgram)", soils: [["Red", "Black"], ["Laterite", "Loamy"]], ph: [5.5, 7.5], n: [15, 40], p: [40, 70], k: [20, 50], water: [600, 1000], temp: [20, 32], humidity: [50, 70], seasons: ["Kharif"] },
];

const WEIGHTS = { soil: 0.22, water: 0.2, temp: 0.12, ph: 0.1, season: 0.1, n: 0.08, p: 0.07, k: 0.07, humidity: 0.04 };

const LABELS = {
  soil: "Soil type",
  season: "Season",
  water: "Water",
  temp: "Temperature",
  ph: "Soil pH",
  n: "Nitrogen",
  p: "Phosphorus",
  k: "Potassium",
  humidity: "Humidity",
};

const UNITS = { ph: "", n: " kg/ha", p: " kg/ha", k: " kg/ha", water: " mm", temp: " °C", humidity: " %" };

// 1 inside the ideal range, fading linearly to 0 as the value moves away.
function rangeFit(value, [lo, hi]) {
  if (value >= lo && value <= hi) return 1;
  const tolerance = Math.max((hi - lo) * 0.8, 1);
  const distance = value < lo ? lo - value : value - hi;
  return Math.max(0, 1 - distance / tolerance);
}

function scoreCrop(crop, input) {
  const factors = [];

  const [primary, secondary] = crop.soils;
  const soilFit = primary.includes(input.soil) ? 1 : secondary.includes(input.soil) ? 0.55 : 0.1;
  factors.push({
    key: "soil",
    label: LABELS.soil,
    fit: soilFit,
    note: soilFit < 0.7 ? `${crop.name} grows best in ${primary.join(" or ").toLowerCase()} soil.` : null,
  });

  const seasonFit = crop.seasons.includes(input.season) ? 1 : 0.2;
  factors.push({
    key: "season",
    label: LABELS.season,
    fit: seasonFit,
    note: seasonFit < 0.7 ? `Usually sown in ${crop.seasons.join(" / ")}.` : null,
  });

  for (const key of ["water", "temp", "ph", "n", "p", "k", "humidity"]) {
    const fit = rangeFit(Number(input[key]), crop[key]);
    const [lo, hi] = crop[key];
    const u = UNITS[key];
    factors.push({
      key,
      label: LABELS[key],
      fit,
      note: fit < 0.7 ? `${LABELS[key]} is ${input[key]}${u}; ideal is ${lo}–${hi}${u}.` : null,
    });
  }

  const score = Math.round(factors.reduce((sum, f) => sum + f.fit * WEIGHTS[f.key], 0) * 100);
  return { name: crop.name, score, factors };
}

export function verdict(score) {
  if (score >= 80) return "Strong fit";
  if (score >= 60) return "Good fit";
  if (score >= 40) return "Possible with changes";
  return "Poor fit";
}

export function predictCrops(input) {
  return CROPS.map((c) => scoreCrop(c, input)).sort((a, b) => b.score - a.score);
}
