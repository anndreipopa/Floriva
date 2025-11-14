import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Thermometer, Droplets, Sun } from "lucide-react";
import LineChart from "./LineChart";

const BACKEND_URL = "https://room-ambiance-monitor.onrender.com";
const socket = io(BACKEND_URL);

// --- Best Growth Window Helper (returns interval + data slice) ---
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
  let bestStartIndex = null;
  let bestEndIndex = null;

  let currentStart = null;
  let currentStartIndex = null;

  for (let i = 0; i < length; i++) {
    const t = tempHistory[i].value;
    const h = humidHistory[i].value;
    const l = lightHistory[i].value;

    const tempOK = t >= 20 && t <= 30;
    const humOK = h >= 40 && h <= 75;
    const lightOK = l >= 125 && l <= 1500;

    const allGood = tempOK && humOK && lightOK;

    if (allGood && currentStart === null) {
      currentStart = tempHistory[i].time;
      currentStartIndex = i;
    }

    if (!allGood && currentStart !== null) {
      const currentEnd = tempHistory[i - 1].time;
      const currentEndIndex = i - 1;

      if (!bestStart || currentEnd - currentStart > bestEnd - bestStart) {
        bestStart = currentStart;
        bestEnd = currentEnd;
        bestStartIndex = currentStartIndex;
        bestEndIndex = currentEndIndex;
      }

      currentStart = null;
      currentStartIndex = null;
    }
  }

  // Close if streak continues to end
  if (currentStart !== null) {
    const currentEnd = tempHistory[length - 1].time;
    const currentEndIndex = length - 1;

    if (!bestStart || currentEnd - currentStart > bestEnd - bestStart) {
      bestStart = currentStart;
      bestEnd = currentEnd;
      bestStartIndex = currentStartIndex;
      bestEndIndex = currentEndIndex;
    }
  }

  if (!bestStart) return null;

  return {
    interval: `${bestStart.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} – ${bestEnd.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`,
    startIndex: bestStartIndex,
    endIndex: bestEndIndex,
  };
}

export default function Dashboard() {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [light, setLight] = useState(0);

  const [tempHistory, setTempHistory] = useState([]);
  const [humidHistory, setHumidHistory] = useState([]);
  const [lightHistory, setLightHistory] = useState([]);

  // Weather state
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(null);

  // Live updates
useEffect(() => {
  socket.on("sensorData", (data) => {
    setTemperature(data.temperatura || 0);
    setHumidity(data.umiditate || 0);
    setLight(data.lumina || 0);

    setLastServerUpdate(Date.now()); // <-- TRACK LAST SERVER CONTACT
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

  // Weather fetch
  async function fetchWeather() {
    try {
      const res = await fetch(`${BACKEND_URL}/weather`);
      const data = await res.json();
      if (!data || !data.current || !data.daily) {
        setWeatherError("Unable to load weather data");
        return;
      }
      setWeather(data);
      setWeatherError(null);
    } catch (err) {
      console.error("Weather error:", err);
      setWeatherError("Weather unavailable");
    }
  }

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // --- Server connection ---
const [lastServerUpdate, setLastServerUpdate] = useState(Date.now());
const SERVER_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const serverOnline = Date.now() - lastServerUpdate < SERVER_TIMEOUT_MS;

// --- Tank level (temporary mock value until hardware exists) ---
const tankLevel = 65; // %
  // Helpers for summary
  const avg = (arr) =>
    (arr.reduce((a, b) => a + b.value, 0) / (arr.length || 1)).toFixed(1);

  return (
<main className="
  flex-1 bg-[#f9fafb]
  p-4 sm:p-6 md:p-10
  pt-20 xl:pt-10
  min-h-screen overflow-y-auto
  min-h-screen
">

      {/* GRID */}
<div className="flex justify-center items-start xl:items-center relative xl:-top-[8px]">
  <div className="
      grid gap-6 
      grid-cols-1 
      w-full max-w-[1600px]
      xl:grid-cols-[2.8fr_1fr]
      xl:grid-rows-[auto_auto]
  ">
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

            // Only consider readings between 6AM–6PM for light avg
            const daytimeLight = lightHistory.filter((entry) => {
              const hour = entry.time.getHours();
              return hour >= 6 && hour < 18;
            });

            const avgLight = daytimeLight.length
              ? parseFloat(
                  (
                    daytimeLight.reduce(
                      (sum, entry) => sum + entry.value,
                      0
                    ) / daytimeLight.length
                  ).toFixed(0)
                )
              : 0;

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
              !daytimeLight.length ? "No daytime data" :
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
                      <span className="text-sm text-gray-600 font-medium">
                        Avg Temp
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-[#0f3d33]">
                      {avgTemp}°C
                    </span>
                    <span className="text-sm mt-1 text-gray-500">
                      {tempStatus}
                    </span>
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
                    <span className="text-sm mt-1 text-gray-500">
                      {humStatus}
                    </span>
                  </div>

                  {/* AVG LIGHT */}
                  <div className="bg-[#f9fafb] rounded-2xl p-4 shadow-sm flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <Sun className="text-[#0f3d33]" size={18} />
                      <span className="text-sm text-gray-600 font-medium">
                        Avg Light (6–18h)
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-[#0f3d33]">
                      {avgLight} lx
                    </span>
                    <span className="text-sm mt-1 text-gray-500">
                      {lightStatus}
                    </span>
                  </div>
                </div>

                {/* GROWTH WINDOW / BEST TIME INTERVAL */}
                <div className="bg-[#f9fafb] rounded-2xl p-4 shadow-sm">
                  <p className="text-gray-600 font-medium mb-1">
                    Best Growth Interval
                  </p>
                  <p className="text-xl font-bold text-[#0f3d33]">
                    {bestWindow ? bestWindow.interval : "No optimal interval today"}
                  </p>

                  {/* Additional growth hint based on window averages */}
                  <p className="text-sm text-gray-500 mt-1">
                    {(() => {
                      if (!bestWindow)
                        return "Conditions were not optimal at any time today.";

                      const sliceTemp = tempHistory.slice(
                        bestWindow.startIndex,
                        bestWindow.endIndex + 1
                      );
                      const sliceHum = humidHistory.slice(
                        bestWindow.startIndex,
                        bestWindow.endIndex + 1
                      );
                      const sliceLight = lightHistory.slice(
                        bestWindow.startIndex,
                        bestWindow.endIndex + 1
                      );

                      const avgTempWindow = (
                        sliceTemp.reduce((a, b) => a + b.value, 0) /
                        sliceTemp.length
                      ).toFixed(1);

                      const avgHumWindow = (
                        sliceHum.reduce((a, b) => a + b.value, 0) /
                        sliceHum.length
                      ).toFixed(1);

                      const avgLightWindow = (
                        sliceLight.reduce((a, b) => a + b.value, 0) /
                        sliceLight.length
                      ).toFixed(0);

                      const tempOK =
                        avgTempWindow >= 20 && avgTempWindow <= 30;
                      const humOK =
                        avgHumWindow >= 40 && avgHumWindow <= 75;
                      const lightOK =
                        avgLightWindow >= 100 && avgLightWindow <= 1500;

                      if (tempOK && humOK && lightOK)
                        return "Ideal — perfect growth conditions during this interval.";

                      if (!tempOK)
                        return `Not ideal — temperature was ${
                          avgTempWindow < 20 ? "too low" : "too high"
                        } during this interval.`;

                      if (!humOK)
                        return `Not ideal — humidity was ${
                          avgHumWindow < 40 ? "too low" : "too high"
                        } during this interval.`;

                      if (!lightOK)
                        return `Not ideal — light was ${
                          avgLightWindow < 100 ? "too low" : "too harsh"
                        } during this interval.`;

                      return "Not ideal — conditions were slightly off.";
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
            bg-white rounded-3xl shadow-md p-6 flex flex-col

            order-3
            xl:order-none xl:col-start-2 xl:row-start-1
          "
        >
          <h2 className="text-xl sm:text-2xl font-bold text-[#0f3d33] mb-4">
            Weather Forecast
          </h2>

          {!weather && !weatherError && (
            <p className="text-gray-500">Loading weather…</p>
          )}

          {weatherError && (
            <p className="text-red-500">{weatherError}</p>
          )}

          {weather && (
            <div className="flex flex-col gap-4 h-full">
              {/* TODAY OVERVIEW */}
              <div className="bg-[#f9fafb] rounded-2xl p-4 shadow-sm flex items-center justify-between">
                <div className="flex flex-col">
                  <p className="text-3xl font-bold text-[#0f3d33]">
                    {Math.round(weather.current.temp)}°C
                  </p>
                  <p className="capitalize text-gray-600 text-sm">
                    {weather.current.weather[0].description}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Feels like{" "}
                    <span className="font-semibold">
                      {Math.round(weather.current.feels_like)}°C
                    </span>
                  </p>
                </div>

                <img
                  src={`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`}
                  className="w-16 h-16"
                  alt="Weather icon"
                />

                <div className="text-sm text-gray-600 text-right">
                  <p>
                    Min:{" "}
                    <span className="font-semibold">
                      {Math.round(weather.daily[0].temp.min)}°
                    </span>
                  </p>
                  <p>
                    Max:{" "}
                    <span className="font-semibold">
                      {Math.round(weather.daily[0].temp.max)}°
                    </span>
                  </p>
                  <p>
                    Sunrise:{" "}
                    <span className="font-semibold">
                      {new Date(
                        weather.current.sunrise * 1000
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </p>
                  <p>
                    Sunset:{" "}
                    <span className="font-semibold">
                      {new Date(
                        weather.current.sunset * 1000
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </p>
                </div>
              </div>

              {/* NEXT 3 DAYS */}
<div className="flex flex-col gap-3 mt-4 xl:mt-8">
  {weather.daily.slice(1, 4).map((day, i) => {
    const date = new Date(day.dt * 1000);
    const weekday = date.toLocaleDateString("en-US", {
      weekday: "short",
    });

    return (
      <div
        key={i}
        className="
          flex items-center justify-between
          bg-[#f9fafb] rounded-2xl p-3 shadow-sm
        "
      >
        <div className="flex flex-col">
          <p className="text-sm font-medium text-[#0f3d33]">{weekday}</p>
          <p className="text-sm text-gray-700 font-semibold">
            {Math.round(day.temp.max)}° / {Math.round(day.temp.min)}°
          </p>
        </div>

        <img
          src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
          className="w-12 h-12"
          alt="Forecast icon"
        />
      </div>
    );
  })}
</div>
            </div>
          )}
        </section>

          {/* SYSTEM HEALTH */}
          <section
            className="
              bg-white rounded-3xl shadow-md p-6 flex flex-col gap-4
              order-4
              xl:order-none xl:col-start-2 xl:row-start-2
            "
          >
            <h2 className="text-xl font-bold text-[#0f3d33] mb-1">System Health</h2>

            {/* ALL SENSORS SUMMARY */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Sensors</span>
              <span className="font-semibold text-green-600">● All OK</span>
            </div>

            {/* CONNECTION SUMMARY (REAL STATUS) */}
            <div className="flex items-center justify-between text-sm -mt-2">
              <span className="text-gray-600">Connection</span>
              <span
                className={`font-semibold ${
                  serverOnline ? "text-green-600" : "text-red-600"
                }`}
              >
                ● {serverOnline ? "Online" : "Offline"}
              </span>
            </div>

            {/* TANK LEVEL TITLE */}
            <p className="text-sm text-gray-600 font-medium mt-1">Tank Level</p>

            {/* TANK LEVEL BAR (65% WITH ANIMATION) */}
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-[#0f3d33] animate-[fillTank_1.8s_ease-out] origin-left"
                style={{ width: `${tankLevel}%` }}
              ></div>
            </div>

            {/* SMALL NOTE */}
            <p className="text-xs text-gray-500 -mt-1">
              Awaiting tank hardware — level tracking coming soon.
            </p>

            {/* LAST SYNC */}
            <p className="text-xs text-gray-500 pt-1">
              Last sync:{" "}
              <span className="text-[#0f3d33] font-semibold">
                {new Date(lastServerUpdate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>

            {/* Tank animation keyframes */}
            <style>{`
              @keyframes fillTank {
                0% { transform: scaleX(0); }
                100% { transform: scaleX(1); }
              }
            `}</style>
          </section>



      </div>
</div>
    </main>
  );
}
