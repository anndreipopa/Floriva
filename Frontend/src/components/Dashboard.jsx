import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Thermometer, Droplets, Sun } from "lucide-react";
import LineChart from "./LineChart";

const BACKEND_URL = "https://room-ambiance-monitor.onrender.com";
const socket = io(BACKEND_URL);

export default function Dashboard() {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [light, setLight] = useState(0);

  const [tempHistory, setTempHistory] = useState([]);
  const [humidHistory, setHumidHistory] = useState([]);
  const [lightHistory, setLightHistory] = useState([]);

  // Live data
  useEffect(() => {
    socket.on("sensorData", (data) => {
      setTemperature(data.temperatura || 0);
      setHumidity(data.umiditate || 0);
      setLight(data.lumina || 0);
    });
    return () => socket.off("sensorData");
  }, []);

  // Historical data
  async function fetchHistory() {
    try {
      const res = await fetch(`${BACKEND_URL}/api/history`);
      const history = await res.json();

      if (!Array.isArray(history)) {
        console.warn("Invalid history format:", history);
        return;
      }

      const sorted = [...history].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );

      setTempHistory(
        sorted.map((item) => ({
          time: new Date(item.created_at),
          value: parseFloat(item.temperature) || 0,
        }))
      );
      setHumidHistory(
        sorted.map((item) => ({
          time: new Date(item.created_at),
          value: parseFloat(item.humidity) || 0,
        }))
      );
      setLightHistory(
        sorted.map((item) => ({
          time: new Date(item.created_at),
          value: parseFloat(item.light) || 0,
        }))
      );
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  }

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    // ⬇️ Added pt-20 so content starts below the fixed header
    <main className="flex-1 bg-[#f9fafb] p-4 sm:p-6 md:p-10 pt-20 md:pt-10 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-md p-6 sm:p-8 mb-10 hover:shadow-lg transition">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0f3d33] mb-6 text-center sm:text-left">
          Environment Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Temperature */}
          <div className="p-4 rounded-2xl bg-[#f9fafb] shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between sm:justify-start gap-2 mb-2">
              <Thermometer className="text-[#0f3d33]" size={20} />
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">
                Temperature
              </h3>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-[#0f3d33] mb-3">
              {temperature.toFixed(1)}°C
            </p>
            <div className="w-full overflow-x-auto">
              <LineChart label="Temperature" dataPoints={tempHistory} />
            </div>
          </div>

          {/* Humidity */}
          <div className="p-4 rounded-2xl bg-[#f9fafb] shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between sm:justify-start gap-2 mb-2">
              <Droplets className="text-[#0f3d33]" size={20} />
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">
                Humidity
              </h3>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-[#0f3d33] mb-3">
              {humidity.toFixed(1)}%
            </p>
            <div className="w-full overflow-x-auto">
              <LineChart label="Humidity" dataPoints={humidHistory} />
            </div>
          </div>

          {/* Light */}
          <div className="p-4 rounded-2xl bg-[#f9fafb] shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between sm:justify-start gap-2 mb-2">
              <Sun className="text-[#0f3d33]" size={20} />
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">
                Light
              </h3>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-[#0f3d33] mb-3">
              {light} lx
            </p>
            <div className="w-full overflow-x-auto">
              <LineChart label="Light" dataPoints={lightHistory} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
