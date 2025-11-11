import React from "react";
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

export default function LineChart({ label, dataPoints }) {
  const data = {
    labels: dataPoints.map((_, i) => `${i}`),
    datasets: [
      {
        label,
        data: dataPoints,
        borderColor: "#2e8b57",
        backgroundColor: "rgba(46, 139, 87, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "#777" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#777" },
        grid: { color: "#e4e4e4" },
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 w-full hover:shadow-lg transition-all duration-200">
      <Line data={data} options={options} />
    </div>
  );
}
