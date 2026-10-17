# CropWise – React frontend

Register, log in, log out, and a crop prediction page (soil type, season, pH, N/P/K, water, temperature, humidity).

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## How it works

- `src/context/AuthContext.jsx` – register / login / logout. **Demo only:** accounts are kept in the browser's localStorage.
  Replace these three functions with calls to your backend for real use.
- `src/components/ProtectedRoute.jsx` – sends logged-out visitors to `/login`.
- `src/pages/Dashboard.jsx` – the prediction form and results.
- `src/utils/cropModel.js` – rule-based scoring for 13 crops. Edit the `CROPS` table to match your region.
- `src/services/predict.js` – set `VITE_PREDICT_API_URL` in `.env` to use your own ML backend instead
  (copy `.env.example` to `.env`).

## Build

```bash
npm run build   # output in dist/
```
