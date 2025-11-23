import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Droplet,
  SunMedium,
  Leaf,
} from "lucide-react";

const socket = io("https://room-ambiance-monitor.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
  secure: true,
});

export default function Plants() {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [watering, setWatering] = useState(false);
  const [duration, setDuration] = useState(2);

  const [showModal, setShowModal] = useState(false);

  const [plants, setPlants] = useState([
    { id: 1, name: "Aloe Vera", type: "Succulent", moisture: 0, light: "High" },
  ]);

  const startWatering = () => {
    if (watering) return;
    setWatering(true);
    socket.emit("pumpCommand", "ON");
    setTimeout(() => {
      socket.emit("pumpCommand", "OFF");
      setWatering(false);
    }, duration * 1000);
  };

  useEffect(() => {
    socket.on("pumpStatus", (status) => console.log("Pump status:", status));
    return () => socket.off("pumpStatus");
  }, []);

  useEffect(() => {
    socket.on("sensorData", (data) => {
      const percent = data.soil_percent;

      //update only Aloe Vera for demo
      setPlants((prev) =>
        prev.map((p) =>
          p.id === 1 ? { ...p, moisture: percent } : p
        )
      );
    });
    return () => socket.off("sensorData");
  }, []);

  const isDesktop = window.matchMedia("(min-width: 1280px)").matches;

  return (
    <motion.div
      className="w-full p-4 sm:p-6 gap-6 flex flex-col xl:flex-row"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >

      {/* LEFT SIDE  PLANT GRID */}
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
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Leaf size={22} className="text-[#0f3d33]" />
                  <h2 className="text-xl font-bold text-[#0f3d33]">{p.name}</h2>
                </div>
                <span className="text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                  {p.type}
                </span>
              </div>

              {/* Moisture */}
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

          {/* ADD PLANT */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-white rounded-3xl border-2 border-dashed border-gray-300 p-5 h-[150px] flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50"
          >
            <Plus size={28} />
            <span className="mt-2 font-medium text-sm">Add New Plant</span>
          </button>
        </div>
      </div>

      {/* DESKTOP DETAILS PANEL*/}
      <div className="w-[350px] hidden xl:flex flex-col bg-white rounded-3xl shadow-md relative overflow-hidden">

        <AnimatePresence mode="wait">

          {/* EMPTY STATE */}
          {!selectedPlant && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0 p-6 overflow-y-auto flex items-center justify-center"
            >
              <p className="text-gray-500 text-center">
                Select a plant to view details
              </p>
            </motion.div>
          )}

          {/* DETAILS PANEL */}
          {selectedPlant && (
            <motion.div
              key={selectedPlant.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 p-6 overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-[#0f3d33] mb-4">
                {selectedPlant.name}
              </h2> 
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

              {/* Water Button */}
              <button
                onClick={startWatering}
                disabled={watering}
                className={`w-full py-3 rounded-2xl mt-3 text-white transition ${
                  watering ? "bg-gray-400" : "bg-[#0f3d33] hover:bg-[#0c322a]"
                }`}
              >
                {watering ? "Watering…" : "Water Now"}
              </button>

              {/* Duration slider */}
              <div className="mt-5">
                <label className="text-sm text-gray-600">Duration</label>
                <input
                  type="range"
                  min="0.5"
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
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* FLOATING ADD BUTTON (MOBILE) */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-[#0f3d33] text-white p-4 rounded-full shadow-xl xl:hidden"
      >
        <Plus size={24} />
      </button>

      {/* ADD PLANT MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold text-[#0f3d33] mb-4">
                Add New Plant
              </h2>

              {/* FORM INPUTS */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-600">Plant Name</label>
                <input
                  type="text"
                  placeholder="Ex: Monstera"
                  className="w-full mt-1 p-3 border rounded-xl bg-gray-50 focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-600">Plant Type</label>
                <select className="w-full mt-1 p-3 border rounded-xl bg-gray-50 focus:outline-none">
                  <option value="Tropical">Tropical</option>
                  <option value="Herb">Herb</option>
                  <option value="Cacti">Cacti</option>
                  <option value="Seedling">Seedling</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-600">Light Preference</label>
                <select className="w-full mt-1 p-3 border rounded-xl bg-gray-50 focus:outline-none">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-600">Soil Preference</label>
                <select className="w-full mt-1 p-3 border rounded-xl bg-gray-50 focus:outline-none">
                  <option>Dry</option>
                  <option>Adequate</option>
                  <option>Moist</option>
                </select>
              </div>

              <div className="mb-4 opacity-50 pointer-events-none">
                <label className="text-sm font-medium text-gray-600">
                  Soil Sensor (Coming Soon)
                </label>
                <select className="w-full mt-1 p-3 border rounded-xl bg-gray-100">
                  <option>No sensors detected</option>
                </select>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-[#0f3d33] text-white rounded-2xl mt-1 hover:bg-[#0c322a]"
              >
                Add Plant
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE DETAILS MODAL */}
      {selectedPlant && !isDesktop && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 xl:hidden"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl relative"
            >

              <button
                onClick={() => setSelectedPlant(null)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold text-[#0f3d33] mb-4">
                {selectedPlant.name}
              </h2>

              <div className="text-sm text-gray-600 mb-4">
                Type: <span className="font-semibold">{selectedPlant.type}</span>
              </div>

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

              <div className="flex items-center justify-between bg-gray-100 p-4 rounded-2xl mb-4">
                <span className="flex items-center gap-2 text-gray-700">
                  <SunMedium size={20} className="text-[#0f3d33]" />
                  Light preference
                </span>
                <span className="font-bold text-[#0f3d33]">{selectedPlant.light}</span>
              </div>

              <button
                onClick={startWatering}
                disabled={watering}
                className={`w-full py-3 rounded-2xl mt-3 text-white transition ${
                  watering ? "bg-gray-400" : "bg-[#0f3d33] hover:bg-[#0c322a]"
                }`}
              >
                {watering ? "Watering…" : "Water Now"}
              </button>

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
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

    </motion.div>
  );
}
