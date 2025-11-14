import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import PlantsPage from "./components/PlantsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plants" element={<PlantsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
