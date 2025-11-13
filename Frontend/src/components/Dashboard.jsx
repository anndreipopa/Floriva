import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Thermometer, Droplets, Sun } from "lucide-react";
import LineChart from "./LineChart";

const BACKEND_URL = "https://room-ambiance-monitor.onrender.com";
const socket = io(BACKEND_URL);

// --- Best Growth Window Helper ---
function calculateBestGrowthWindow(tempHistory, humidHistory, lightHistory) {
  if (
    tempHistory.length === 0 ||
    humidHistory.length === 0 ||
    lightHistory.length === 0
  ) {
    return null;
  }

  const length = Math.min(
    tempHistory.length,
    humidHistory.length,
    lightHistory.length
  );

  let bestStart = null;
  let bestEnd = null;
  let currentStart = null;

  for (let i = 0; i < length; i++) {
    const t = tempHistory[i].value;
    const h = humidHistory[i].value;
    const l = lightHistory[i].value;

    // Use the same ranges you already use conceptually
    const tempOK = t >= 20 && t <= 30;
    const humOK = h >= 40 && h <= 75;
    const lightOK = l >= 100 && l <= 1500;

    const allGood = tempOK && humOK && lightOK;

    if (allGood && currentStart === null) {
      currentStart = tempHistory[i].time;
    }

    if (!allGood && currentStart !== null) {
      const currentEnd = tempHistory[i - 1].time;

      if (!bestStart || currentEnd - currentStart > bestEnd - bestStart) {
        bestStart = currentStart;
        bestEnd = currentEnd;
      }

      currentStart = null;
    }
  }

  // Close streak if it reaches the end
  if (currentStart !== null) {
    const currentEnd = tempHistory[length - 1].time;
    if (!bestStart || currentEnd - currentStart > bestEnd - bestStart) {
      bestStart = currentStart;
      bestEnd = currentEnd;
    }
  }

  if (!bestStart || !bestEnd) return null;

  const fmt = (d) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return `${fmt(bestStart)} – ${fmt(bestEnd)}`;
}

export default function Dashboard() {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [light, setLight] = useState(0);

  const [tempHistory, setTempHistory] = useState([]);
  const [humidHistory, setHumidHistory] = useState([]);
  const [lightHistory, setLightHistory] = useState([]);

  // Live updates
  useEffect(() => {
    socket.on("sensorData", (data) => {
      setTemperature(data.temperatura || 0);
      setHumidity(data.umiditate || 0);
      setLight(data.lumina || 0);
    });
    return () => socket.off("sensorData");
  }, []);

  // Fetch history
  async function fetchHistory() {
    try {
      const res = await fetch(`${BACKEND_URL}/api/history`);
      const history = await res.json();
      if (!Array.isArray(history)) return;

      const sorted = [...history].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );

      setTempHistory(
        sorted.map((i) => ({
          time: new Date(i.created_at),
          value: parseFloat(i.temperature) || 0,
        }))
      );

      setHumidHistory(
        sorted.map((i) => ({
          time: new Date(i.created_at),
          value: parseFloat(i.humidity) || 0,
        }))
      );

      setLightHistory(
        sorted.map((i) => ({
          time: new Date(i.created_at),
          value: parseFloat(i.light) || 0,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Helpers for summary
  const avg = (arr) =>
    (arr.reduce((a, b) => a + b.value, 0) / (arr.length || 1)).toFixed(1);

  return (
    <main className="flex-1 bg-[#f9fafb] p-4 sm:p-6 md:p-10 pt-20 xl:pt-10 overflow-y-auto">

      {/* GRID */}
      <div
        className="
          grid gap-6
          grid-cols-1

          xl:grid-cols-[70%_30%]
          xl:grid-rows-[auto_1fr]
          xl:min-h-[calc(100vh-5rem)]
        "
      >

        {/* ENVIRONMENT OVERVIEW */}
        <section
          className="
            bg-white rounded-3xl shadow-md p-6 overflow-visible
            order-1
            xl:order-none xl:col-start-1 xl:row-start-1
          "
        >
          <h2 className="text-xl sm:text-2xl font-bold text-[#0f3d33] mb-4">
            Environment Overview
          </h2>

          {/* CHARTS SCROLLER */}
          <div
            className="
              flex overflow-x-auto snap-x snap-mandatory gap-6 no-scrollbar

              xl:grid xl:grid-cols-3 xl:gap-6 xl:overflow-visible xl:snap-none
            "
          >
            {/* Temperature */}
            <div className="min-w-[85%] xl:min-w-0 snap-center bg-[#f9fafb] p-4 rounded-2xl shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="text-[#0f3d33]" size={20} />
                <h3 className="font-semibold text-gray-700">Temperature</h3>
              </div>
              <p className="text-3xl sm:text-4xl text-[#0f3d33] font-bold mb-2">
                {temperature.toFixed(1)}°C
              </p>
              <LineChart label="Temperature" dataPoints={tempHistory} />
            </div>

            {/* Humidity */}
            <div className="min-w-[85%] xl:min-w-0 snap-center bg-[#f9fafb] p-4 rounded-2xl shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="text-[#0f3d33]" size={20} />
                <h3 className="font-semibold text-gray-700">Humidity</h3>
              </div>
              <p className="text-3xl sm:text-4xl text-[#0f3d33] font-bold mb-2">
                {humidity.toFixed(1)}%
              </p>
              <LineChart label="Humidity" dataPoints={humidHistory} />
            </div>

            {/* Light */}
            <div className="min-w-[85%] xl:min-w-0 snap-center bg-[#f9fafb] p-4 rounded-2xl shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="text-[#0f3d33]" size={20} />
                <h3 className="font-semibold text-gray-700">Light</h3>
              </div>
              <p className="text-3xl sm:text-4xl text-[#0f3d33] font-bold mb-2">
                {light} lx
              </p>
              <LineChart label="Light" dataPoints={lightHistory} />
            </div>
          </div>
        </section>

        {/* ENVIRONMENT SUMMARY */}
        <section
          className="
            bg-white rounded-3xl shadow-md p-6 flex flex-col

            order-2
            xl:order-none xl:col-start-1 xl:row-start-2
          "
        >
          <h2 className="text-xl sm:text-2xl font-bold text-[#0f3d33] mb-4">
            Environment Summary
          </h2>

          {/* --- CALCULATED VALUES --- */}
          {(() => {
            const avgTemp = parseFloat(avg(tempHistory));
            const avgHum = parseFloat(avg(humidHistory));
            const avgLight = parseFloat(
              (
                lightHistory.reduce((a, b) => a + b.value, 0) /
                (lightHistory.length || 1)
              ).toFixed(0)
            );

            // Temperature interpretation
            let tempStatus =
              avgTemp < 20 ? "Too cold" :
              avgTemp > 30 ? "Too hot" :
              "Normal";

            // Humidity interpretation
            let humStatus =
              avgHum < 40 ? "Too dry" :
              avgHum > 75 ? "Too humid" :
              "Normal";

            // Light interpretation
            let lightStatus =
              avgLight < 100 ? "Low light" :
              avgLight > 1500 ? "Too harsh" :
              "Adequate";

            // Best growth interval based on readings
            const bestWindow = calculateBestGrowthWindow(
              tempHistory,
              humidHistory,
              lightHistory
            );

            return (
              <>
                {/* MINI CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">

                  {/* AVG TEMP */}
                  <div className="bg-[#f9fafb] rounded-2xl p-4 shadow-sm flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <Thermometer className="text-[#0f3d33]" size={18} />
                      <span className="text-sm text-gray-600 font-medium">Avg Temp</span>
                    </div>
                    <span className="text-2xl font-bold text-[#0f3d33]">
                      {avgTemp}°C
                    </span>
                    <span className="text-sm mt-1 text-gray-500">{tempStatus}</span>
                  </div>

                  {/* AVG HUMIDITY */}
                  <div className="bg-[#f9fafb] rounded-2xl p-4 shadow-sm flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <Droplets className="text-[#0f3d33]" size={18} />
                      <span className="text-sm text-gray-600 font-medium">
                        Avg Humidity
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-[#0f3d33]">
                      {avgHum}%
                    </span>
                    <span className="text-sm mt-1 text-gray-500">{humStatus}</span>
                  </div>

                  {/* AVG LIGHT */}
                  <div className="bg-[#f9fafb] rounded-2xl p-4 shadow-sm flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <Sun className="text-[#0f3d33]" size={18} />
                      <span className="text-sm text-gray-600 font-medium">Avg Light</span>
                    </div>
                    <span className="text-2xl font-bold text-[#0f3d33]">
                      {avgLight} lx
                    </span>
                    <span className="text-sm mt-1 text-gray-500">{lightStatus}</span>
                  </div>

                </div>

                {/* GROWTH WINDOW / BEST TIME INTERVAL */}
                <div className="bg-[#f9fafb] rounded-2xl p-4 shadow-sm">
                  <p className="text-gray-600 font-medium mb-1">
                    Best Growth Interval
                  </p>
                  <p className="text-xl font-bold text-[#0f3d33]">
                    {bestWindow || "No optimal interval today"}
                  </p>
                  {/* Additional growth hint */}
                  <p className="text-sm text-gray-500 mt-1">
                    {(() => {
                      if (!bestWindow) return "Conditions were not optimal at any point.";

                      // Determine which factor is the weakest
                      if (tempStatus !== "Normal") {
                        return `*In existing conditions, but not ideal - ${tempStatus.toLowerCase()}.`;
                      }
                      if (humStatus !== "Normal") {
                        return `*In existing conditions, but not ideal - ${humStatus.toLowerCase()}.`;
                      }
                      if (lightStatus !== "Adequate") {
                        return `*In existing conditions, but not ideal - ${lightStatus.toLowerCase()}.`;
                      }

                      return "Ideal - perfect growth conditions.";
                    })()}
                    </p>
                </div>
                
              </>
            );
          })()}
        </section>

        {/* WEATHER FORECAST */}
        <section
          className="
            bg-white rounded-3xl shadow-md p-6

            order-3
            xl:order-none xl:col-start-2 xl:row-start-1
          "
        >
          <h2 className="text-xl font-bold text-[#0f3d33] mb-4">
            Weather Forecast
          </h2>
          <p className="text-gray-600">Coming soon…</p>
        </section>

        {/* SYSTEM HEALTH */}
        <section
          className="
            bg-white rounded-3xl shadow-md p-6 flex flex-col

            order-4
            xl:order-none xl:col-start-2 xl:row-start-2
          "
        >
          <h2 className="text-xl font-bold text-[#0f3d33] mb-4">
            System Health
          </h2>
          <p className="text-gray-600">Coming soon…</p>
        </section>

      </div>
    </main>
  );
}
