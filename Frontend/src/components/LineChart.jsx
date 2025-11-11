import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title, TimeScale);

// 🌟 Plugin pentru umbră lungă pe linie (fără a o dubla)
const shadowLinePlugin = {
  id: "shadowLinePlugin",
  beforeDatasetsDraw: (chart) => {
    const { ctx } = chart;
    ctx.save();

    // Setări pentru glow / umbră
    ctx.shadowColor = "rgba(46,139,87,0.55)";
    ctx.shadowBlur = 18;       // 👈 mai lung
    ctx.shadowOffsetY = 8;     // 👈 mai jos
    ctx.shadowOffsetX = 0;
  },
  afterDatasetsDraw: (chart) => {
    // resetăm contextul după ce Chart.js desenează linia originală
    chart.ctx.restore();
  },
};

export default function LineChart({ label, dataPoints }) {
  const data = useMemo(
    () => ({
      labels: dataPoints.map((d) => d.time),
      datasets: [
        {
          label,
          data: dataPoints.map((d) => d.value),
          borderColor: "#2e8b57",
          backgroundColor: "rgba(46, 139, 87, 0.1)",
          tension: 0.4,
          fill: true,
          pointRadius: 1,
          borderWidth: 3.5,
        },
      ],
    }),
    [label, dataPoints]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `Value: ${context.parsed.y}`,
          },
        },
      },
      scales: {
        x: {
          type: "time",
          time: {
            unit: "minute",
            displayFormats: { minute: "h:mm a" },
            tooltipFormat: "h:mm:ss a",
          },
          ticks: {
            color: "#777",
            source: "data",
            autoSkip: false,
            maxRotation: 0,
          },
          title: {
            display: true,
            text: "Time",
            color: "#555",
            font: { size: 14, weight: "bold" },
          },
          grid: { display: false },
        },
        y: {
          title: {
            display: true,
            text: "Scale",
            color: "#555",
            font: { size: 14, weight: "bold" },
          },
          ticks: { color: "#777" },
          grid: { color: "#e4e4e4" },
        },
      },
    }),
    []
  );

  return (
    <div className="bg-white rounded-2xl p-6 w-full transition-all duration-200">
      {dataPoints.length > 0 ? (
        <Line data={data} options={options} plugins={[shadowLinePlugin]} />
      ) : (
        <p className="text-center text-gray-500 italic">No data available</p>
      )}
    </div>
  );
}
