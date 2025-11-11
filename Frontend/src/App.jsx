import React from "react";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <div className="flex min-h-screen bg-[#f6f8f5] text-[#1b4332]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-10">
        <h2 className="text-4xl font-bold mb-6">Dashboard</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">🌡 Temperature</div>
          <div className="bg-white rounded-2xl shadow p-6">💧 Humidity</div>
          <div className="bg-white rounded-2xl shadow p-6">☀️ Light</div>
        </div>
      </main>
    </div>
  );
}