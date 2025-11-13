import React from "react";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";

export default function LineChart({ dataPoints }) {
  const data = dataPoints.map((p) => ({
    time: p.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    value: p.value,
  }));

  return (
    <div className="w-full h-[290px]">
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>

          {/* GRID (must be BEFORE the area gradient) */}
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />

          {/* GRADIENT */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f3d33" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#0f3d33" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          {/* GRADIENT FILL */}
          <Area
            type="monotone"
            dataKey="value"
            stroke="none"
            fill="url(#chartGradient)"
            fillOpacity={1}
            hide             // prevents duplicate tooltip entries
          />

          {/* MAIN LINE */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0f3d33"
            strokeWidth={2}
            dot={false}
          />

          {/* AXES */}
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            width={30}
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />

          {/* TOOLTIP */}
          <Tooltip
            contentStyle={{
              background: "white",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontSize: "12px",
            }}
          />

        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}
