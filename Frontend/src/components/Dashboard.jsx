import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Thermometer, Droplets, Sun } from "lucide-react";
import LineChart from "../components/LineChart";

const BACKEND_URL = "https://room-ambiance-monitor.onrender.com";
const socket = io(BACKEND_URL);

export default function Dashboard() {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [light, setLight] = useState(0);

  const [tempHistory, setTempHistory] = useState([]);
  const [humidHistory, setHumidHistory] = useState([]);
  const [lightHistory, setLightHistory] = useState([]);

  // 1️⃣ Datele live doar pentru valorile instantanee
  useEffect(() => {
    socket.on("sensorData", (data) => {
      setTemperature(data.temperatura || 0);
      setHumidity(data.umiditate || 0);
      setLight(data.lumina || 0);
    });

    return () => socket.off("sensorData");
  }, []);

  // 2️⃣ Datele istorice doar din API (actualizate o dată la 5 min)
  async function fetchHistory() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/history`);
    const history = await res.json();

    if (!Array.isArray(history)) {
      console.warn("Format invalid pentru history:", history);
      return;
    }

    // Sortăm descrescător după dată (ca să apară de la cele mai vechi la cele mai noi)
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
    console.error("Eroare la fetch history:", err);
  }
}

  useEffect(() => {
    fetchHistory();
    // opțional — actualizează graficul la fiecare 5 minute
    const interval = setInterval(fetchHistory, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex-1 bg-[#f9fafb] p-10 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-md p-8 mb-10 hover:shadow-lg transition">
        <h2 className="text-2xl font-bold text-[#0f3d33] mb-6">
          Environment Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Temperature */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="text-[#0f3d33]" size={20} />
              <h3 className="font-semibold text-gray-700">Temperature</h3>
            </div>
            <p className="text-4xl font-bold text-[#0f3d33] mb-3">
              {temperature.toFixed(1)}°C
            </p>
            <LineChart label="Temperature" dataPoints={tempHistory} />
          </div>

          {/* Humidity */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="text-[#0f3d33]" size={20} />
              <h3 className="font-semibold text-gray-700">Humidity</h3>
            </div>
            <p className="text-4xl font-bold text-[#0f3d33] mb-3">
              {humidity.toFixed(1)}%
            </p>
            <LineChart label="Humidity" dataPoints={humidHistory} />
          </div>

          {/* Light */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sun className="text-[#0f3d33]" size={20} />
              <h3 className="font-semibold text-gray-700">Light</h3>
            </div>
            <p className="text-4xl font-bold text-[#0f3d33] mb-3">{light} lx</p>
            <LineChart label="Light" dataPoints={lightHistory} />
          </div>
        </div>
      </div>
    </main>
  );
}
