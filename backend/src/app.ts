import cors from "cors";
import express from "express";
import { bundleConfig, bundleOptions } from "./data/bundleData.js";

export const app = express();

app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/bundle/options", (_req, res) => {
  res.json(bundleOptions);
});

app.get("/api/bundle/config", (_req, res) => {
  res.json(bundleConfig);
});
