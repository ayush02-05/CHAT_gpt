import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import CursorGlow from "./components/CursorGlow.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CursorGlow />
    <App />
  </BrowserRouter>
);
