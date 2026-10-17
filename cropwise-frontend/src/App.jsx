import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CropPrediction from "./components/CropPrediction";
export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/register" replace />}
      />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route
        path="/predict"
        element={<CropPrediction />}
      />

      <Route
        path="*"
        element={<Navigate to="/register" replace />}
      />
    </Routes>
  );
}