import { useState } from "react";
import {
  Plus,
  Droplet,
  SunMedium,
  Leaf,
} from "lucide-react";

export default function Plants() {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [watering, setWatering] = useState(false);
  const [duration, setDuration] = useState(2);

  const [showModal, setShowModal] = useState(false); // Add Plant modal

  const plants = [
    { id: 1, name: "Monstera", type: "Tropical", moisture: 63, light: "Medium" },
    { id: 2, name: "Basil", type: "Herb", moisture: 52, light: "High" },
    { id: 3, name: "Snake Plant", type: "Cacti", moisture: 41, light: "Low" },
  ];

  const startWatering = () => {
    if (watering) return;
    setWatering(true);
    setTimeout(() => setWatering(false), duration * 1000);
  };

  const isDesktop = window.matchMedia("(min-width: 1280px)").matches;

  return (
    <div className="w-full p-4 sm:p-6 gap-6 flex flex-col xl:flex-row">

      {/* LEFT SIDE — PLANT GRID */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#0f3d33]">Plants</h1>
        </div>

        {/* GROUP TABS */}
        <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar">
          {["All Plants", "Herbs", "Cacti", "Tropical", "Seedlings"].map((g) => (
            <button
              key={g}
              className="px-4 py-2 rounded-full bg-gray-100 text-sm text-gray-600 hover:bg-gray-200 whitespace-nowrap"
            >
              {g}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {plants.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlant(p)}
              className="bg-white rounded-3xl shadow-md p-5 hover:shadow-lg transition flex flex-col text-left"
            >
              {/* Top */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Leaf size={22} className="text-[#0f3d33]" />
                  <h2 className="text-xl font-bold text-[#0f3d33]">{p.name}</h2>
                </div>
                <span className="text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                  {p.type}
                </span>
              </div>

              {/* Moisture bar */}
              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Soil Moisture</span>
                  <span>{p.moisture}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-[#0f3d33]"
                    style={{ width: `${p.moisture}%` }}
                  />
                </div>
              </div>

            </button>
          ))}

          {/* ADD NEW PLANT */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-white rounded-3xl border-2 border-dashed border-gray-300 p-5 h-[150px] flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50"
          >
            <Plus size={28} />
            <span className="mt-2 font-medium text-sm">Add New Plant</span>
          </button>
        </div>
      </div>

      {/* RIGHT SIDE — DESKTOP DETAILS PANEL */}
      <div className="w-[350px] hidden xl:flex flex-col bg-white p-6 rounded-3xl shadow-md">
        {!selectedPlant && (
          <p className="text-gray-500 text-center mt-20">
            Select a plant to view details
          </p>
        )}

        {selectedPlant && (
          <>
            <h2 className="text-2xl font-bold text-[#0f3d33] mb-4">
              {selectedPlant.name}
            </h2>

            {/* TYPE */}
            <div className="text-sm text-gray-600 mb-4">
              Type: <span className="font-semibold">{selectedPlant.type}</span>
            </div>

            {/* Moisture */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="flex items-center gap-2 text-gray-600">
                  <Droplet size={20} className="text-[#0f3d33]" />
                  Soil Moisture
                </span>
                <span className="font-bold text-[#0f3d33]">
                  {selectedPlant.moisture}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0f3d33]"
                  style={{ width: `${selectedPlant.moisture}%` }}
                />
              </div>
            </div>

            {/* Light */}
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-2xl mb-4">
              <div className="flex items-center gap-2">
                <SunMedium size={20} className="text-[#0f3d33]" />
                <span>Light preference</span>
              </div>
              <span className="font-bold text-[#0f3d33]">
                {selectedPlant.light}
              </span>
            </div>

            {/* WATER BUTTON */}
            <button
              onClick={startWatering}
              disabled={watering}
              className={`w-full py-3 rounded-2xl mt-3 text-white transition ${
                watering ? "bg-gray-400" : "bg-[#0f3d33] hover:bg-[#0c322a]"
              }`}
            >
              {watering ? "Watering…" : "Water Now"}
            </button>

            {/* DURATION SLIDER */}
            <div className="mt-5">
              <label className="text-sm text-gray-600">Duration</label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.5"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-full mt-2 accent-[#0f3d33]"
              />
              <p className="text-xs text-gray-500 mt-1">
                {duration.toFixed(1)} seconds
              </p>
            </div>

            <p className="text-xs text-gray-500 mt-6">Last watered: 2 days ago</p>
          </>
        )}
      </div>

      {/* FLOATING ADD (mobile) */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-[#0f3d33] text-white p-4 rounded-full shadow-xl xl:hidden"
      >
        <Plus size={24} />
      </button>

      {/* ADD PLANT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl relative">

            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-[#0f3d33] mb-4">
              Add New Plant
            </h2>

            {/* PLANT NAME */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600">Plant Name</label>
              <input
                type="text"
                placeholder="Ex: Monstera"
                className="w-full mt-1 p-3 border rounded-xl bg-gray-50 focus:outline-none"
              />
            </div>

            {/* PLANT TYPE */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600">Plant Type</label>
              <select className="w-full mt-1 p-3 border rounded-xl bg-gray-50 focus:outline-none">
                <option value="Tropical">Tropical</option>
                <option value="Herb">Herb</option>
                <option value="Cacti">Cacti</option>
                <option value="Seedling">Seedling</option>
              </select>
            </div>

            {/* LIGHT PREFERENCE */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600">Light Preference</label>
              <select className="w-full mt-1 p-3 border rounded-xl bg-gray-50 focus:outline-none">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            {/* SOIL PREFERENCE */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600">Soil Preference</label>
              <select className="w-full mt-1 p-3 border rounded-xl bg-gray-50 focus:outline-none">
                <option>Dry</option>
                <option>Adequate</option>
                <option>Moist</option>
              </select>
            </div>

            {/* SOIL SENSOR (DISABLED) */}
            <div className="mb-4 opacity-50 pointer-events-none">
              <label className="text-sm font-medium text-gray-600">
                Soil Sensor (Coming Soon)
              </label>
              <select className="w-full mt-1 p-3 border rounded-xl bg-gray-100">
                <option>No sensors detected</option>
              </select>
            </div>

            {/* SAVE BUTTON */}
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 bg-[#0f3d33] text-white rounded-2xl mt-1 hover:bg-[#0c322a]"
            >
              Add Plant
            </button>
          </div>
        </div>
      )}

      {/* MOBILE DETAILS MODAL */}
      {selectedPlant && !isDesktop && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 xl:hidden">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl relative">

            {/* Close */}
            <button
              onClick={() => setSelectedPlant(null)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-[#0f3d33] mb-4">
              {selectedPlant.name}
            </h2>

            {/* TYPE */}
            <div className="text-sm text-gray-600 mb-4">
              Type: <span className="font-semibold">{selectedPlant.type}</span>
            </div>

            {/* Moisture */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="flex items-center gap-2 text-gray-600">
                  <Droplet size={20} className="text-[#0f3d33]" />
                  Soil Moisture
                </span>
                <span className="font-bold text-[#0f3d33]">
                  {selectedPlant.moisture}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0f3d33]"
                  style={{ width: `${selectedPlant.moisture}%` }}
                />
              </div>
            </div>

            {/* Light */}
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-2xl mb-4">
              <span className="flex items-center gap-2 text-gray-700">
                <SunMedium size={20} className="text-[#0f3d33]" />
                Light preference
              </span>
              <span className="font-bold text-[#0f3d33]">{selectedPlant.light}</span>
            </div>

            {/* WATER BUTTON */}
            <button
              onClick={startWatering}
              disabled={watering}
              className={`w-full py-3 rounded-2xl mt-3 text-white transition ${
                watering ? "bg-gray-400" : "bg-[#0f3d33] hover:bg-[#0c322a]"
              }`}
            >
              {watering ? "Watering…" : "Water Now"}
            </button>

            {/* DURATION SLIDER */}
            <div className="mt-5">
              <label className="text-sm text-gray-600">Duration</label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.5"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-full mt-2 accent-[#0f3d33]"
              />
              <p className="text-xs text-gray-500 mt-1">
                {duration.toFixed(1)} seconds
              </p>
            </div>

            <p className="text-xs text-gray-500 mt-6">Last watered: 2 days ago</p>
          </div>
        </div>
      )}

    </div>
  );
}
