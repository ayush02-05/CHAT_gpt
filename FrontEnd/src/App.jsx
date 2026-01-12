import "../src/styles/Global.css";

import React from "react";
import MainRoutes from "./MainRoutes.jsx";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="min-h-screen w-full bg-background-dark text-white selection:bg-primary selection:text-white">
      <MainRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
