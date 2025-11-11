import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Thermometer, Droplets, Sun } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const BACKEND_URL = "https://room-ambiance-monitor.onrender.com";
const socket = io(BACKEND_URL);

export default function Dashboard() {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [light, setLight] = useState(0);
  const [tempHistory, setTempHistory] = useState([]);
  const [humidHistory, setHumidHistory] = useState([]);
  const [lightHistory, setLightHistory] = useState([]);

  useEffect(() => {
    socket.on("sensorData", (data) => {
      setTemperature(data.temperatura || 0);
      setHumidity(data.umiditate || 0);
      setLight(data.lumina || 0);

      setTempHistory((prev) => [...prev.slice(-49), data.temperatura || 0]);
      setHumidHistory((prev) => [...prev.slice(-49), data.umiditate || 0]);
      setLightHistory((prev) => [...prev.slice(-49), data.lumina || 0]);
    });

    return () => socket.off("sensorData");
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
    elements: {
      line: { tension: 0.4 },
      point: { radius: 0 },
    },
  };

  const createChartData = (data, color) => ({
    labels: data.map((_, i) => i),
    datasets: [
      {
        data,
        borderColor: color,
        backgroundColor: `${color}20`,
        fill: true,
        borderWidth: 2,
      },
    ],
  });

  return (
    <main className="flex-1 bg-[#f9fafb] p-10 overflow-y-auto">
      {/* Environment Overview */}
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
            <div className="h-20">
              <Line
                data={createChartData(tempHistory, "#2e8b57")}
                options={chartOptions}
              />
            </div>
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
            <div className="h-20">
              <Line
                data={createChartData(humidHistory, "#2e8b57")}
                options={chartOptions}
              />
            </div>
          </div>

          {/* Light */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sun className="text-[#0f3d33]" size={20} />
              <h3 className="font-semibold text-gray-700">Light</h3>
            </div>
            <p className="text-4xl font-bold text-[#0f3d33] mb-3">{light} lx</p>
            <div className="h-20">
              <Line
                data={createChartData(lightHistory, "#2e8b57")}
                options={chartOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
