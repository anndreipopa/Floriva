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

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  TimeScale
);

// 🌟 Shadow glow effect for line
const shadowLinePlugin = {
  id: "shadowLinePlugin",
  beforeDatasetsDraw: (chart) => {
    const { ctx } = chart;
    ctx.save();
    ctx.shadowColor = "rgba(46,139,87,0.55)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;
    ctx.shadowOffsetX = 0;
  },
  afterDatasetsDraw: (chart) => {
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
          pointRadius: 1.5,
          borderWidth: 3,
        },
      ],
    }),
    [label, dataPoints]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false, // 🔑 allows flexible height
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          bodyFont: { size: 12 },
          titleFont: { size: 12 },
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
            autoSkip: true,
            maxTicksLimit: 4, // fewer ticks for mobile
            font: { size: 10 },
          },
          title: {
            display: true,
            text: "Time",
            color: "#555",
            font: { size: 12, weight: "bold" },
          },
          grid: { display: false },
        },
        y: {
          title: {
            display: true,
            text: "Value",
            color: "#555",
            font: { size: 12, weight: "bold" },
          },
          ticks: { color: "#777", font: { size: 10 } },
          grid: { color: "#e4e4e4" },
        },
      },
    }),
    []
  );

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-6 w-full h-48 sm:h-64 md:h-72 transition-all duration-200">
      {dataPoints.length > 0 ? (
        <Line data={data} options={options} plugins={[shadowLinePlugin]} />
      ) : (
        <p className="text-center text-gray-500 italic text-sm sm:text-base">
          No data available
        </p>
      )}
    </div>
  );
}
